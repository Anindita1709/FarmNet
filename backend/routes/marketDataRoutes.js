import express from "express";
import MarketData from "../model/marketData.js";

const router = express.Router();

// GET /market-data?state=...&district=...&market=...&commodity=...&variety=...&grade=...
router.get("/", async (req, res) => {
  try {
    const { state, district, market, commodity, variety, grade } = req.query;

    // Build dynamic MongoDB query
    const query = {};
    if (state) query.State = new RegExp(`^${state}$`, "i");
    if (district) query.District = new RegExp(`^${district}$`, "i");
    if (market) query.Market = new RegExp(`^${market}$`, "i");
    if (commodity) query.Commodity = new RegExp(`^${commodity}$`, "i");
    if (variety) query.Variety = new RegExp(`^${variety}$`, "i");
    if (grade) query.Grade = new RegExp(`^${grade}$`, "i");

    // Fetch matching records
    const records = await MarketData.find(query).limit(10000); // limit for safety

    res.json({
      count: records.length,
      source: "database",
      updated_date: new Date().toLocaleString("en-IN"),
      records,
    });
  } catch (error) {
    console.error("❌ Error fetching market data:", error);
    res.status(500).json({ message: "Failed to fetch market data", error });
  }
});

export default router;
