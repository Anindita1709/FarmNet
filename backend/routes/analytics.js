import express from "express";
import orderSchema from '../model/ordersSchema.js';// Make sure this is your Order model

const router = express.Router();

// --- GET /api/analytics/summary ---
router.get("/summary", async (req, res) => {
  try {
    const totalOrders = await orderSchema.countDocuments();
    const pendingOrders = await orderSchema.countDocuments({ orderStatus: "pending" });

    const revenueAgg = await orderSchema.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } }
    ]);
    const totalRevenue = revenueAgg[0]?.totalRevenue || 0;

    const totalCustomers = await orderSchema.distinct("userid").then(ids => ids.length);

    res.json({ totalOrders, pendingOrders, totalRevenue, totalCustomers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// --- GET /api/analytics/recent-orders ---
router.get("/recent-orders", async (req, res) => {
  try {
    const orders = await orderSchema.find()
      .sort({ orderDate: -1 }) // use your orderDate field
      .limit(5); // last 5 orders
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/analytics/revenue-trends?days=30
router.get("/revenue-trends", async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Aggregate orders by day
    const trends = await orderSchema.aggregate([
      { $match: { orderDate: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$orderDate" } },
          dailyRevenue: { $sum: "$totalAmount" },
          dailyOrders: { $sum: 1 },
        },
      },
      { $sort: { "_id": 1 } }, // sort by date ascending
    ]);

    // Map _id to date
    const revenueData = trends.map((t) => ({
      date: t._id,
      revenue: t.dailyRevenue,
      orders: t.dailyOrders,
    }));

    res.json(revenueData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch revenue trends" });
  }
});


export default router;