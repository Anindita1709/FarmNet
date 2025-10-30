"use client";

import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

interface SalesData {
  month: string;
  sales: number;
}

export default function AnalyticsPage() {
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated analytics data (you can replace with API call)
    const data = [
      { month: "Jan", sales: 1200 },
      { month: "Feb", sales: 1900 },
      { month: "Mar", sales: 800 },
      { month: "Apr", sales: 2200 },
      { month: "May", sales: 1700 },
      { month: "Jun", sales: 2500 },
    ];
    setSalesData(data);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading analytics...</p>
      </div>
    );
  }

  const totalSales = salesData.reduce((sum, item) => sum + item.sales, 0);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard Analytics</h1>

      {/* Stats Section */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 mb-8">
        <div className="p-4 border rounded-lg text-center bg-green-50">
          <h2 className="text-xl font-semibold text-green-700">Total Sales</h2>
          <p className="text-2xl font-bold mt-2">₹{totalSales.toLocaleString()}</p>
        </div>

        <div className="p-4 border rounded-lg text-center bg-blue-50">
          <h2 className="text-xl font-semibold text-blue-700">Avg Monthly</h2>
          <p className="text-2xl font-bold mt-2">
            ₹{Math.round(totalSales / salesData.length).toLocaleString()}
          </p>
        </div>

        <div className="p-4 border rounded-lg text-center bg-yellow-50">
          <h2 className="text-xl font-semibold text-yellow-700">Best Month</h2>
          <p className="text-2xl font-bold mt-2">
            {salesData.reduce((a, b) => (a.sales > b.sales ? a : b)).month}
          </p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white border rounded-lg p-4 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Sales Overview</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="sales" stroke="#4F46E5" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
