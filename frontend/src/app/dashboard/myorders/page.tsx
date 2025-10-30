"use client";

import { useEffect, useState } from "react";


interface Order {
  id: string;
  date: string;
  total: number;
  status: string;
  items: number;
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Example: replace this with your API call
    async function fetchOrders() {
      try {
        // Fake data for now
        const data: Order[] = [
          { id: "001", date: "2025-10-01", total: 499, status: "Delivered", items: 3 },
          { id: "002", date: "2025-10-12", total: 299, status: "Pending", items: 2 },
        ];
        setOrders(data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading your orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-600">
        <p>No orders found.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>

      <table className="min-w-full border border-gray-300 text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 border-b">Order ID</th>
            <th className="py-2 px-4 border-b">Date</th>
            <th className="py-2 px-4 border-b">Items</th>
            <th className="py-2 px-4 border-b">Total (₹)</th>
            <th className="py-2 px-4 border-b">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b">{order.id}</td>
              <td className="py-2 px-4 border-b">{order.date}</td>
              <td className="py-2 px-4 border-b">{order.items}</td>
              <td className="py-2 px-4 border-b">₹{order.total}</td>
              <td
                className={`py-2 px-4 border-b font-medium ${
                  order.status === "Delivered"
                    ? "text-green-600"
                    : order.status === "Pending"
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                {order.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
