
"use client";

import { useEffect, useState } from "react";
import { IndianRupee, Logs, Users, ClipboardList } from "lucide-react";
import SideBar from "../../../../component/Sidebar";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";

interface Summary {
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  totalCustomers: number;
}

interface Order {
  _id: string;
  userid: string;
  sellerId: string;
  productid: string;
  quantity: number;
  totalAmount: number;
  orderStatus: string;
  orderDate: string;
  verifiedOnBlockchain?: boolean;
}

interface RevenueData {
  date: string;
  revenue: number;
  orders: number;
}

const AnalyticsPage = () => {
  const [summary, setSummary] = useState<Summary>({
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
  });

  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const summaryRes = await fetch("http://localhost:5000/api/analytics/summary");
        const summaryData = await summaryRes.json();
        setSummary(summaryData);

        const recentRes = await fetch("http://localhost:5000/api/analytics/recent-orders");
        const recentData = await recentRes.json();
        setRecentOrders(recentData);

        const revenueRes = await fetch("http://localhost:5000/api/analytics/revenue-trends");
        const revenueTrendData = await revenueRes.json();
        setRevenueData(revenueTrendData);
      } catch (err) {
        console.error("Failed to fetch analytics data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="bg-gray-200 font-inter min-h-screen p-5 flex gap-5">
      <SideBar />

      <div className="flex-1">
        <p className="text-xl font-bold mb-4">Analytics Dashboard</p>

       
        <header className="flex flex-wrap gap-4">
          <div className="bg-white p-4 rounded shadow flex-1 min-w-[200px]">
            <p className="font-bold text-lg">Total Orders</p>
            <p className="text-gray-500 text-sm">All time</p>
            <div className="flex items-center gap-2 mt-2">
              <Logs size={24} />
              <p className="font-bold text-3xl">{summary.totalOrders}</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow flex-1 min-w-[200px]">
            <p className="font-bold text-lg">Total Revenue</p>
            <p className="text-gray-500 text-sm">All time</p>
            <div className="flex items-center gap-2 mt-2">
              <IndianRupee size={24} />
              <p className="font-bold text-3xl">{summary.totalRevenue}</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow flex-1 min-w-[200px]">
            <p className="font-bold text-lg">Total Customers</p>
            <p className="text-gray-500 text-sm">All time</p>
            <div className="flex items-center gap-2 mt-2">
              <Users size={24} />
              <p className="font-bold text-3xl">{summary.totalCustomers}</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow flex-1 min-w-[200px]">
            <p className="font-bold text-lg">Pending Orders</p>
            <p className="text-gray-500 text-sm">All time</p>
            <div className="flex items-center gap-2 mt-2">
              <ClipboardList size={24} />
              <p className="font-bold text-3xl">{summary.pendingOrders}</p>
            </div>
          </div>
        </header>

       
        <div className="mt-8 bg-white p-4 rounded shadow">
          <h2 className="font-bold text-lg mb-4">Revenue & Orders Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={Array.isArray(revenueData) ? revenueData : []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#8884d8" name="Revenue" />
              <Line type="monotone" dataKey="orders" stroke="#82ca9d" name="Orders" />
            </LineChart>
          </ResponsiveContainer>

        </div>

       
      </div>
    </div>
  );
};

export default AnalyticsPage;

