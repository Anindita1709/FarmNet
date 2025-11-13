import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";

// Load service account JSON path from environment
const serviceAccountPath = process.env.GEMINI_API_KEY_PATH;
if (!serviceAccountPath || !fs.existsSync(serviceAccountPath)) {
  throw new Error("Service account JSON not found. Set GEMINI_API_KEY_PATH in your .env file.");
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf-8"));

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(serviceAccount);

// Select the Gemini model with system instructions
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-lite-preview-02-05",
  systemInstruction: "You are an AI pricing model designed to determine fair prices for agricultural products based on real-time local market data. Ensure farmers receive a fair share while considering market demand, supply trends, transportation costs, and competitor pricing.",
});

// Configuration for AI generation
const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
  responseSchema: {
    type: "object",
    properties: {
      price: { type: "number" },
      description: { type: "string" },
    },
  },
};

/**
 * Run Gemini AI to get pricing for a product
 * @param {Object} data - Product data for pricing
 * @returns {Promise<Object>} - { price: number, description: string }
 */
export async function run(data) {
  const chatSession = model.startChat({ generationConfig, history: [] });

  try {
    const result = await chatSession.sendMessage(JSON.stringify(data));
    const text = result.response.text();
    return JSON.parse(text); // return parsed JSON with price & description
  } catch (err) {
    console.error("Gemini AI error:", err);
    throw new Error("Failed to generate pricing using Gemini AI");
  }
}
