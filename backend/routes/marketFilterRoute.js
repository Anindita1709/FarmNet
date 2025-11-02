/*import express from "express";
import MarketData from "../model/marketData.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { state, district, market, commodity, variety, grade } = req.query;

    const filters = {};

    filters.states = await MarketData.distinct("State");

    if (state)
      filters.districts = await MarketData.distinct("District", { State: new RegExp(state, "i") });

    if (state && district)
      filters.markets = await MarketData.distinct("Market", {
        State: new RegExp(state, "i"),
        District: new RegExp(district, "i"),
      });

    if (state && district && market)
      filters.commodities = await MarketData.distinct("Commodity", {
        State: new RegExp(state, "i"),
        District: new RegExp(district, "i"),
        Market: new RegExp(market, "i"),
      });

    if (state && district && market && commodity)
      filters.varieties = await MarketData.distinct("Variety", {
        State: new RegExp(state, "i"),
        District: new RegExp(district, "i"),
        Market: new RegExp(market, "i"),
        Commodity: new RegExp(commodity, "i"),
      });

    if (state && district && market && commodity && variety)
      filters.grades = await MarketData.distinct("Grade", {
        State: new RegExp(state, "i"),
        District: new RegExp(district, "i"),
        Market: new RegExp(market, "i"),
        Commodity: new RegExp(commodity, "i"),
        Variety: new RegExp(variety, "i"),
      });

    res.json({
      filters,
      source: "database",
      fetchDate: new Date().toLocaleString("en-IN"),
    });
  } catch (error) {
    console.error("❌ Error fetching filters:", error);
    res.status(500).json({ message: "Failed to fetch filters", error });
  }
});

export default router;
*/
import express from "express";
import MarketData from "../model/marketData.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { state, district, market, commodity, variety } = req.query;

    const filters = {};

    // 🟢 STEP 1 — No selection: show all states
    if (!state && !district && !market && !commodity && !variety) {
      filters.states = await MarketData.distinct("State", { State: { $ne: "" } });
    }

    // 🟢 STEP 2 — State selected: show districts in that state
    if (state && !district) {
      filters.districts = await MarketData.distinct("District", {
        State: new RegExp(state.trim(), "i"),
        District: { $ne: "" },
      });
    }

    // 🟢 STEP 3 — District selected: show markets in that district
    if (state && district && !market) {
      filters.markets = await MarketData.distinct("Market", {
        State: new RegExp(state.trim(), "i"),
        District: new RegExp(district.trim(), "i"),
        Market: { $ne: "" },
      });
    }

    // 🟢 STEP 4 — Market selected: show commodities in that market
    if (state && district && market && !commodity) {
      filters.commodities = await MarketData.distinct("Commodity", {
        State: new RegExp(state.trim(), "i"),
        District: new RegExp(district.trim(), "i"),
        Market: new RegExp(market.trim(), "i"),
        Commodity: { $ne: "" },
      });
    }

    // 🟢 STEP 5 — Commodity selected: show varieties for that commodity
    if (state && district && market && commodity && !variety) {
      filters.varieties = await MarketData.distinct("Variety", {
        State: new RegExp(state.trim(), "i"),
        District: new RegExp(district.trim(), "i"),
        Market: new RegExp(market.trim(), "i"),
        Commodity: new RegExp(commodity.trim(), "i"),
        Variety: { $ne: "" },
      });
    }

    // 🟢 STEP 6 — Variety selected: show grades
    if (state && district && market && commodity && variety) {
      filters.grades = await MarketData.distinct("Grade", {
        State: new RegExp(state.trim(), "i"),
        District: new RegExp(district.trim(), "i"),
        Market: new RegExp(market.trim(), "i"),
        Commodity: new RegExp(commodity.trim(), "i"),
        Variety: new RegExp(variety.trim(), "i"),
        Grade: { $ne: "" },
      });
    }

    res.json({
      filters,
      source: "database",
      fetchDate: new Date().toLocaleString("en-IN"),
    });
  } catch (error) {
    console.error("❌ Error fetching filters:", error);
    res.status(500).json({ message: "Failed to fetch filters", error });
  }
});

export default router;
