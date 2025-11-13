
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

interface Product {
  productName: string;
  productPrice: number;
  productImage?: string;
}

interface Buyer {
  name: string;
  email: string;
  phone: string;
}

interface Order {
  _id: string;
  product: Product;
  buyer: Buyer;
  quantity: number;
  totalAmount: number;
  status: string;
  transactionHash?: string;
  createdAt: string;
}

const MyOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const farmerId =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("farmer") || "{}")._id
      : null;

  useEffect(() => {
    const fetchOrders = async () => {
      if (!farmerId) {
        setLoading(false);
        setError("No farmer ID found. Please log in again.");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:5000/api/orders/getOrdersByFarmer/${farmerId}`
        );

        setOrders(response.data.orders || []);
      } catch (err) {
        console.error("❌ Fetch error:", err);
        setError("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [farmerId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-600 text-lg">
        Loading your orders...
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-600 mt-10">{error}</div>;
  }

  if (orders.length === 0) {
    return <div className="text-center text-gray-500 mt-10">No orders received yet.</div>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-green-700 mb-6">My Orders</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition"
          >
            <div className="flex gap-4">
              {order.product?.productImage ? (
                <img
                  src={order.product.productImage}
                  alt={order.product.productName}
                  className="w-24 h-24 object-cover rounded-lg"
                />
              ) : (
                <div className="w-24 h-24 bg-gray-200 flex items-center justify-center rounded-lg text-gray-500">
                  No Image
                </div>
              )}

              <div className="flex-1">
                <h2 className="text-xl font-semibold">{order.product?.productName}</h2>
                <p className="text-gray-700">
                  Price: ₹{order.product?.productPrice} × {order.quantity}
                </p>
                <p className="text-gray-800 font-semibold mt-1">
                  Total: ₹{order.totalAmount}
                </p>
              </div>
            </div>

            <div className="mt-4 border-t pt-3 text-sm text-gray-700">
              <p>
                <span className="font-semibold">Buyer:</span> {order.buyer?.name} (
                {order.buyer?.email})
              </p>
              <p>
                <span className="font-semibold">Phone:</span> {order.buyer?.phone}
              </p>
              <p className="mt-1">
                <span className="font-semibold">Status:</span>{" "}
                <span
                  className={`px-2 py-1 rounded-md text-white ${
                    order.status === "delivered" ? "bg-green-600" : "bg-yellow-500"
                  }`}
                >
                  {order.status?.toUpperCase() || "PENDING"}
                </span>
              </p>

              {order.transactionHash && (
                <p className="mt-1">
                  <span className="font-semibold">Transaction:</span>{" "}
                  <span
                    className="text-blue-600 underline cursor-pointer break-all"
                    title={order.transactionHash}
                    onClick={() => {
                      navigator.clipboard.writeText(order.transactionHash || "");
                      alert("Transaction hash copied!");
                    }}
                  >
                    {`${order.transactionHash.slice(0, 10)}...${order.transactionHash.slice(-10)}`}
                  </span>
                </p>
              )}

              <p className="mt-1 text-gray-500 text-sm">
                Ordered on {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrdersPage;


