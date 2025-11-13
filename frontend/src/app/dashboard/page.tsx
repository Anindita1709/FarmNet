"use client";

import { useEffect, useState } from "react";
import { IndianRupee, Logs, Users, ClipboardList } from "lucide-react";
import SideBar from "../../../component/Sidebar";

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
  address: string;
  blockchainTxHash?: string;
  verifiedOnBlockchain?: boolean;
}

const AnalyticsPage = () => {
  const [summary, setSummary] = useState<Summary>({
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
  });

  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
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
      {/* Sidebar */}
      <SideBar />

      {/* Main Content */}
      <div className="flex-1">
        <p className="text-xl font-bold mb-4">Analytics Dashboard</p>

        {/* Summary Cards */}
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

        {/* Recent Orders Section */}
        <div className="mt-8">
          <h1 className="text-xl font-bold mb-4">Recent Orders</h1>

          {recentOrders.length === 0 ? (
            <div className="flex items-center justify-center h-60">
              <img
                src="https://cdni.iconscout.com/illustration/premium/thumb/search-not-found-illustration-download-in-svg-png-gif-file-formats--zoom-logo-404-error-empty-pack-design-development-illustrations-6632131.png?f=webp"
                alt="No orders"
                className="w-60 h-60 rounded-full"
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentOrders.map((order) => (
                <div key={order._id} className="bg-white p-4 rounded shadow">
                  <p className="font-bold">{order.productid}</p>
                  <p>Qty: {order.quantity}</p>
                  <p>Amount: ₹{order.totalAmount}</p>
                  <p>Status: {order.orderStatus}</p>
                  <p>Date: {new Date(order.orderDate).toLocaleString()}</p>
                  <p>Blockchain: {order.verifiedOnBlockchain ? "✅" : "❌"}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
