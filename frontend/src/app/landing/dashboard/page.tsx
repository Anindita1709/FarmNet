"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Order {
  _id: string;
  productid: string;
  totalAmount: number;
  quantity: number;
  orderStatus: string;
  orderDate: string;
  blockchainTxHash?: string;
}

export default function UserDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userId = localStorage.getItem("userid"); // 👈 stored at login
        if (!userId) {
          toast.error("User not logged in");
          setLoading(false);
          return;
        }

        // Make sure your .env points to your backend
        // Example: NEXT_PUBLIC_API_URL=http://localhost:5000/api/orders
        const url = `${process.env.NEXT_PUBLIC_API_URL}/getOrders/${userId}`;
        console.log("Fetching orders from:", url);

        const res = await fetch(url);

        // ✅ Check for non-JSON responses
        if (!res.ok) {
          const text = await res.text(); // sometimes it's HTML
          console.error("Failed to fetch orders:", res.status, text);
          toast.error("Failed to fetch orders from server");
          setLoading(false);
          return;
        }

        const data = await res.json();

        if (data.orders && Array.isArray(data.orders)) {
          setOrders(data.orders);
        } else {
          toast.info("No orders found");
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
        toast.error("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading)
    return <div className="text-center text-gray-600 mt-10">Loading orders...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-green-700">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-500">You have not placed any orders yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border p-4 rounded-2xl shadow-md hover:shadow-lg transition"
            >
              <h2 className="text-lg font-semibold text-gray-800">
                Order ID: {order._id}
              </h2>
              <p className="text-sm text-gray-500">
                Date: {new Date(order.orderDate).toLocaleDateString()}
              </p>
              <p className="mt-2">Quantity: {order.quantity}</p>
              <p>Total Amount: ₹{order.totalAmount}</p>
              <p
                className={`mt-2 font-medium ${
                  order.orderStatus === "delivered"
                    ? "text-green-600"
                    : order.orderStatus === "pending"
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                Status: {order.orderStatus}
              </p>
              {order.blockchainTxHash && (
                <p className="text-xs text-blue-500 break-words">
                  Tx: {order.blockchainTxHash.slice(0, 15)}...
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
