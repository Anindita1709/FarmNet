import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import cors from 'cors';
import auth from './routes/Auth.route.js';
import fetch from "node-fetch";
import cron from "node-cron";
import fs from "fs";
import path from "path";
import csv from "csv-parser"
import MarketData from "./model/marketData.js";
import marketFilterRoute from "./routes/marketFilterRoute.js";
import marketDataRoutes from "./routes/marketDataRoutes.js"; 
import productRoutes from "./routes/Productroutes.js";
import orderRoutes from "./routes/OrderRoutes.js"
import settingsRoutes from "./routes/settings.js";

import analyticsRoutes from "./routes/analytics.js";




import { initContracts } from "./blockchain/services/contract.service.js"; //  path to your blockchain service

const app = express();
dotenv.config();

app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000", // frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

mongoose.connect(process.env.MONGO)
.then(() => {
  console.log('MongoDB is connected');
  fetchAndStoreMarketData();
}).catch(err => {
  console.log(err);
})

app.listen(5000, () => {
  console.log("Server listening on port 5000");
});

app.get("/", (req, res) => {
  res.json({ message: "Hello from server!" });
});


//  Function to fetch & store government data

const fetchAndStoreMarketData = async () => {
  try {
    console.log("🔄 Fetching latest market data...");
    const apiUrl = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${process.env.DATA_GOV_API_KEY}&format=json&limit=10000`;

    const res = await fetch(apiUrl);
    const data = await res.json();

    if (!data.records || data.records.length === 0) {
      console.log("⚠️ No records found from API.");
      return;
    }

    const formattedRecords = data.records.map((item) => ({
      State: item.state || "",
      District: item.district || "",
      Market: item.market || "",
      Commodity: item.commodity || "",
      Variety: item.variety || "",
      Grade: item.grade || "",
      Min_x0020_Price: item.min_price || "",
      Max_x0020_Price: item.max_price || "",
      Modal_x0020_Price: Number(item.modal_price) || 0,
      Arrival_Date: item.arrival_date || "",
    }));

    await MarketData.deleteMany({});
    await MarketData.insertMany(formattedRecords);

    console.log(`✅ Stored ${formattedRecords.length} market records`);
  } catch (err) {
    console.error("❌ Error updating market data:", err);
  }
};



app.use("/market-data", marketDataRoutes); 
app.use("/market-filters", marketFilterRoute);
app.use('/api/auth', auth);
app.use("/api/products", productRoutes);  
console.log("✅ Product routes registered at /products");

app.use("/api/orders", orderRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/settings", settingsRoutes);
// Initialize Blockchain at server startup

(async () => {
  try {
    await initContracts();
    console.log("🚀 Blockchain ready for transactions");
  } catch (error) {
    console.error("❌ Failed to initialize blockchain:", error.message);
  }
})();
