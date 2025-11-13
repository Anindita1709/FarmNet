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
import marketDataRoutes from "./routes/marketDataRoutes.js"; // 👈 ADD THIS
import productRoutes from "./routes/Productroutes.js";
import orderRoutes from "./routes/OrderRoutes.js"
import settingsRoutes from "./routes/settings.js";
//import { ethers } from "ethers";
//import OrderVerifierABI from "./blockchain/abis/OrderVerifier.json" assert { type: "json" };
import analyticsRoutes from "./routes/analytics.js";




import { initContracts } from "./blockchain/services/contract.service.js"; // ✅ path to your blockchain service

//import marketRoute from "./routes/marketRoute.js";
//let marketData = [];
/*
fs.createReadStream("marketdata.csv")
  .pipe(csv())
  .on("data", (row) => {
    marketData.push(row);
  })
  .on("end", () => {
    console.log("CSV file successfully loaded.");
      console.log("Number of records:", marketData.length);
  console.log("First few rows:", marketData.slice(0, 5)); // show first 5 rows
  });
  */

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
/*
// ✅ Blockchain Verification Route
app.get("/verify-order", async (req, res) => {
  try {
    const { commodity, market, price } = req.query;
    if (!commodity || !market || !price)
      return res.status(400).json({ error: "Missing parameters" });

    // Connect to blockchain
    const provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC_URL);
    const contract = new ethers.Contract(
      process.env.CONTRACT_ADDRESS, // from your .env
      OrderVerifierABI,
      provider
    );

    // Call verification function
    const result = await contract.verifyOrder(commodity, market, price);

    res.json({
      verified: result.isValid || true, // assume true if call succeeds
      txHash: result.txHash || "0x123...dummy",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Blockchain verification failed:", error);
    res.status(500).json({ error: "Blockchain verification failed" });
  }
});
*/
app.listen(5000, () => {
  console.log("Server listening on port 5000");
});

app.get("/", (req, res) => {
  res.json({ message: "Hello from server!" });
});


// ✅ Function to fetch & store government data

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

// ✅ Function to fetch & store government data safely
/*
const fetchAndStoreMarketData = async () => {
  try {
    console.log("🔄 Fetching latest market data...");
    const apiUrl = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${process.env.DATA_GOV_API_KEY}&format=json&limit=10000`;

    const res = await fetch(apiUrl);

    // Check if HTTP response is OK
    if (!res.ok) {
      throw new Error(`HTTP Error ${res.status}: ${res.statusText}`);
    }

    // Try parsing JSON safely
    let data;
    try {
      data = await res.json();
    } catch (parseError) {
      throw new Error("Invalid or empty JSON response from API");
    }

    // Check if data has records
    if (!data || !data.records || data.records.length === 0) {
      console.log("⚠️ No records found from API.");
      return;
    }

    // Format and store records
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
    console.error("❌ Error updating market data:", err.message);
  }
};
*/
//with caching 
/*
const cacheFilePath = path.resolve("./cache/marketData.json");

const fetchAndStoreMarketData = async () => {
  try {
    console.log("🔄 Fetching latest market data...");
    const apiUrl = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${process.env.DATA_GOV_API_KEY}&format=json&limit=10000`;

    const res = await fetch(apiUrl);

    if (!res.ok) {
      throw new Error(`HTTP Error ${res.status}: ${res.statusText}`);
    }

    let data;
    try {
      data = await res.json();
    } catch {
      throw new Error("Invalid or empty JSON response from API");
    }

    if (!data || !data.records || data.records.length === 0) {
      throw new Error("No records found from API");
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

    // ✅ Save to cache file
    fs.writeFileSync(cacheFilePath, JSON.stringify(formattedRecords, null, 2));
    console.log(`✅ Stored ${formattedRecords.length} market records and cached locally`);
  } catch (err) {
    console.error(`❌ Error updating market data: ${err.message}`);

    // 🟠 Try loading from local cache if available
    if (fs.existsSync(cacheFilePath)) {
      try {
        console.log("🟠 Loading market data from local cache...");
        const cachedData = JSON.parse(fs.readFileSync(cacheFilePath, "utf-8"));
        if (cachedData.length > 0) {
          await MarketData.deleteMany({});
          await MarketData.insertMany(cachedData);
          console.log(`✅ Loaded ${cachedData.length} cached records into MongoDB`);
        } else {
          console.warn("⚠️ Cache file is empty — no fallback data.");
        }
      } catch (cacheErr) {
        console.error("⚠️ Failed to load from cache:", cacheErr.message);
      }
    } else {
      console.warn("⚠️ No cache file found. Skipping data update.");
    }
  }
};

export default fetchAndStoreMarketData;
*/
//with caching using mongodb
/*
const cacheFilePath = path.resolve("./cache/marketData.json");

const fetchAndStoreMarketData = async () => {
  try {
    console.log("🔄 Fetching latest market data...");
    const apiUrl = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${process.env.DATA_GOV_API_KEY}&format=json&limit=10000`;

    const res = await fetch(apiUrl);

    if (!res.ok) {
      throw new Error(`HTTP Error ${res.status}: ${res.statusText}`);
    }

    // 🧠 Try parsing JSON safely
    let data;
    try {
      data = await res.json();
    } catch {
      throw new Error("Invalid or empty JSON response from API");
    }

    // 🟡 Check if API returned data
    if (!data || !data.records || data.records.length === 0) {
      throw new Error("No records found from API");
    }

    // ✅ Format records
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

    // ✅ Replace MongoDB data with new data
    await MarketData.deleteMany({});
    await MarketData.insertMany(formattedRecords);
    console.log(`✅ Stored ${formattedRecords.length} fresh market records in MongoDB`);

    // ✅ Update local cache file
    const cacheDir = path.dirname(cacheFilePath);
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
    fs.writeFileSync(cacheFilePath, JSON.stringify(formattedRecords, null, 2));
    console.log("💾 Market data cached locally.");
  } catch (err) {
    console.error(`❌ Error updating market data: ${err.message}`);

    // 🟠 Step 1: Try loading from local cache
    if (fs.existsSync(cacheFilePath)) {
      try {
        console.log("🟠 Loading market data from local cache...");
        const cachedData = JSON.parse(fs.readFileSync(cacheFilePath, "utf-8"));
        if (cachedData.length > 0) {
          await MarketData.deleteMany({});
          await MarketData.insertMany(cachedData);
          console.log(`✅ Loaded ${cachedData.length} cached records into MongoDB`);
          return;
        } else {
          console.warn("⚠️ Cache file is empty — moving to MongoDB fallback.");
        }
      } catch (cacheErr) {
        console.error("⚠️ Failed to load from cache:", cacheErr.message);
      }
    } else {
      console.warn("⚠️ No cache file found. Trying MongoDB fallback...");
    }

    // 🟢 Step 2: Use existing MongoDB data (as last fallback)
    try {
      const existingData = await MarketData.find({});
      if (existingData.length > 0) {
        console.log(`📦 Using ${existingData.length} existing records from MongoDB.`);
      } else {
        console.warn("⚠️ MongoDB is empty — no market data available at all.");
      }
    } catch (dbErr) {
      console.error("❌ Failed to read from MongoDB:", dbErr.message);
    }
  }
};

export default fetchAndStoreMarketData;
*/

/*
const cacheFilePath = path.resolve("./cache/marketData.json");
const csvFilePath = path.resolve("./marketData.csv");

const fetchAndStoreMarketData = async () => {
  try {
    console.log("🔄 Fetching latest market data...");
    const apiUrl = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${process.env.DATA_GOV_API_KEY}&format=json&limit=10000`;

    const res = await fetch(apiUrl);

    if (!res.ok) {
      throw new Error(`HTTP Error ${res.status}: ${res.statusText}`);
    }

    let data;
    try {
      data = await res.json();
    } catch {
      throw new Error("Invalid or empty JSON response from API");
    }

    if (!data || !data.records || data.records.length === 0) {
      throw new Error("No records found from API");
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
    console.log(`✅ Stored ${formattedRecords.length} fresh market records in MongoDB`);

    // ✅ Update cache JSON
    const cacheDir = path.dirname(cacheFilePath);
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
    fs.writeFileSync(cacheFilePath, JSON.stringify(formattedRecords, null, 2));
    console.log("💾 Market data cached locally.");
  } catch (err) {
    console.error(`❌ Error updating market data: ${err.message}`);

    // 🟠 Step 1: Try cache file
    if (fs.existsSync(cacheFilePath)) {
      try {
        console.log("🟠 Loading market data from local cache...");
        const cachedData = JSON.parse(fs.readFileSync(cacheFilePath, "utf-8"));
        if (cachedData.length > 0) {
          await MarketData.deleteMany({});
          await MarketData.insertMany(cachedData);
          console.log(`✅ Loaded ${cachedData.length} cached records into MongoDB`);
          return;
        } else {
          console.warn("⚠️ Cache file empty — trying MongoDB fallback.");
        }
      } catch (cacheErr) {
        console.error("⚠️ Failed to load from cache:", cacheErr.message);
      }
    }

    // 🟢 Step 2: Try MongoDB fallback
    try {
      const existingData = await MarketData.find({});
      if (existingData.length > 0) {
        console.log(`📦 Using ${existingData.length} existing records from MongoDB.`);
        return;
      } else {
        console.warn("⚠️ MongoDB empty — trying CSV fallback.");
      }
    } catch (dbErr) {
      console.error("⚠️ Failed to read from MongoDB:", dbErr.message);
    }

    // 🟣 Step 3: Try CSV fallback
    if (fs.existsSync(csvFilePath)) {
      try {
        console.log("📄 Loading market data from CSV file...");
        const csvData = await new Promise((resolve, reject) => {
          const results = [];
          fs.createReadStream(csvFilePath)
            .pipe(csv())
            .on("data", (row) => {
              results.push({
                State: row.State || row.state || "",
                District: row.District || row.district || "",
                Market: row.Market || row.market || "",
                Commodity: row.Commodity || row.commodity || "",
                Variety: row.Variety || row.variety || "",
                Grade: row.Grade || row.grade || "",
                Min_x0020_Price: row.Min_x0020_Price || row.min_price || "",
                Max_x0020_Price: row.Max_x0020_Price || row.max_price || "",
                Modal_x0020_Price: Number(row.Modal_x0020_Price || row.modal_price) || 0,
                Arrival_Date: row.Arrival_Date || row.arrival_date || "",
              });
            })
            .on("end", () => resolve(results))
            .on("error", (error) => reject(error));
        });

        if (csvData.length > 0) {
          await MarketData.deleteMany({});
          await MarketData.insertMany(csvData);
          console.log(`✅ Loaded ${csvData.length} records from CSV into MongoDB`);
          // Also save CSV to cache for next time
          fs.writeFileSync(cacheFilePath, JSON.stringify(csvData, null, 2));
          console.log("💾 CSV data cached for offline use.");
        } else {
          console.warn("⚠️ CSV file was empty — no fallback data available.");
        }
      } catch (csvErr) {
        console.error("❌ Failed to load CSV fallback:", csvErr.message);
      }
    } else {
      console.warn("⚠️ No CSV file found. No market data could be loaded.");
    }
  }
};

export default fetchAndStoreMarketData;
*/

app.use("/market-data", marketDataRoutes); // 👈 ADD THIS LINE
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
