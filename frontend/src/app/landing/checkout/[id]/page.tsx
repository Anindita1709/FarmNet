"use client";
/*
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Axiosinstance from "../../../../../axiosconfig";

interface Product {
  _id: string;
  productName: string;
  productPrice: number;
  productDescription?: string;
  productImage?: string;
  sellerId: string;
}

const Page = () => {
  const { id } = useParams<{ id: string }>();
  const [productdetails, setProductdetails] = useState<Product | null>(null);
  const router = useRouter();

  const fetchProducts = async () => {
    try {
      const res = await Axiosinstance.get(`products/getProductById/${id}`);
      setProductdetails(res.data.product);
      console.log(res.data.product);
    } catch (error) {
      console.error("❌ Error fetching product:", error);
    }
  };

  const user = localStorage.getItem("user");
  const userid = user ? JSON.parse(user)._id : null;

  const handleOrder = async () => {
    if (!userid || !productdetails) {
      console.error("❌ Missing user or product details");
      return;
    }

    try {
      const res = await Axiosinstance.post("orders/addOrder", {
        userid,
        sellerId: productdetails.sellerId,
        productid: productdetails._id,
        quantity: 1,
        address:
          "Rathinam Tech Park, Pollachi Main Road, Eachanari, Coimbatore, Tamil Nadu 641021",
      });
      console.log("✅ Order placed:", res.data);
      router.push("/landing");
    } catch (error) {
      console.error("❌ Error placing order:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="font-inter m-12">
      <h1 className="text-xl font-bold">CheckOut</h1>
      <div className="bg-green-100 p-6 rounded-md my-3">
        {productdetails && (
          <div className="flex flex-col gap-2">
            <div className="flex gap-1">
              <h1>Product Name:</h1>
              <p>{productdetails.productName}</p>
            </div>
            <div className="flex gap-1">
              <h1>Price:</h1>
              <p>{productdetails.productPrice}</p>
            </div>
          </div>
        )}
      </div>

      <h1 className="text-xl font-bold">Payment</h1>

      <div className="bg-green-100 p-6 rounded-md my-3">
        {productdetails && (
          <div className="flex flex-col gap-2">
            <div className="flex gap-1">
              <h1>Total Amount:</h1>
              <p>{productdetails.productPrice}</p>
            </div>
            <div className="flex gap-1">
              <h1>Delivery Fee:</h1>
              <p>40 Rs</p>
            </div>
            <div className="flex gap-1">
              <h1>Grand Total:</h1>
              <p>{productdetails.productPrice + 40}</p>
            </div>
          </div>
        )}
      </div>

      <div className="text-center mt-2">
        <button
          onClick={handleOrder}
          className="bg-black rounded-md text-white px-2 py-1"
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default Page;
*/
/*
"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Axiosinstance from "../../../../../axiosconfig";

interface Product {
  _id: string;
  productName: string;
  productPrice: number;
  productDescription?: string;
  productImage?: string;
  sellerId: string;
}

const Page = () => {
  const { id } = useParams<{ id: string }>();
  const [productdetails, setProductdetails] = useState<Product | null>(null);
  const [userid, setUserid] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchProducts = async () => {
    try {
      const res = await Axiosinstance.get(`/products/getProductById/${id}`);
      setProductdetails(res.data.product);
      console.log("✅ Product fetched:", res.data.product);
    } catch (error) {
      console.error("❌ Error fetching product:", error);
    }
  };
console.log("userid:", userid);
console.log("productdetails:", productdetails);

  useEffect(() => {
    fetchProducts();

    const user = localStorage.getItem("user");
    if (user) {
      const parsed = JSON.parse(user);
      setUserid(parsed._id);
    }
  }, []);

  const handleOrder = async () => {
    if (!userid || !productdetails) {
      console.error("❌ Missing user or product details");
      alert("Please log in or refresh the page.");
      return;
    }

    setLoading(true);
    try {
      const res = await Axiosinstance.post("/orders/addOrder", {
        userid,
        sellerId: productdetails.sellerId,
        productid: productdetails._id,
        quantity: 1,
        address:
          "Rathinam Tech Park, Pollachi Main Road, Eachanari, Coimbatore, Tamil Nadu 641021",
      });
      console.log("✅ Order placed:", res.data);
      alert("✅ Order placed successfully!");
      router.push("/landing");
    } catch (error) {
      console.error("❌ Error placing order:", error);
      alert("Failed to place order. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-inter m-12">
      <h1 className="text-xl font-bold">CheckOut</h1>
      <div className="bg-green-100 p-6 rounded-md my-3">
        {productdetails && (
          <div className="flex flex-col gap-2">
            <div className="flex gap-1">
              <h1>Product Name:</h1>
              <p>{productdetails.productName}</p>
            </div>
            <div className="flex gap-1">
              <h1>Price:</h1>
              <p>{productdetails.productPrice}</p>
            </div>
          </div>
        )}
      </div>

      <h1 className="text-xl font-bold">Payment</h1>

      <div className="bg-green-100 p-6 rounded-md my-3">
        {productdetails && (
          <div className="flex flex-col gap-2">
            <div className="flex gap-1">
              <h1>Total Amount:</h1>
              <p>{productdetails.productPrice}</p>
            </div>
            <div className="flex gap-1">
              <h1>Delivery Fee:</h1>
              <p>40 Rs</p>
            </div>
            <div className="flex gap-1">
              <h1>Grand Total:</h1>
              <p>{productdetails.productPrice + 40}</p>
            </div>
          </div>
        )}
      </div>

      <div className="text-center mt-2">
        <button
          onClick={handleOrder}
          disabled={loading}
          className={`bg-black rounded-md text-white px-2 py-1 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Placing Order..." : "Place Order"}
        </button>
      </div>
    </div>
  );
};

export default Page;
*/
"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Axiosinstance from "../../../../../axiosconfig";
import { connectWallet, getWeb3 } from "@/utils/web3.js";

interface Product {
  _id: string;
  productName: string;
  productPrice: number;
  productDescription?: string;
  productImage?: string[];
  sellerId: string;
  stock: number;
}

const Page = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [productdetails, setProductdetails] = useState<Product | null>(null);
  const [userid, setUserid] = useState<string | null>(null);
  const [account, setAccount] = useState<string | null>(null); // MetaMask wallet
  const [loading, setLoading] = useState(false);

  // ---------------- Fetch Product ----------------
  const fetchProduct = async () => {
    try {
      const res = await Axiosinstance.get(`/products/getProductById/${id}`);
      setProductdetails(res.data.product);
      console.log("✅ Product fetched:", res.data.product);
    } catch (err) {
      console.error("❌ Error fetching product:", err);
    }
  };

  // ---------------- Get logged-in user from localStorage ----------------
  const fetchUser = () => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsed = JSON.parse(user);
      setUserid(parsed._id);
    }
  };

  // ---------------- Connect wallet ----------------
  const handleConnectWallet = async () => {
    const acc = await connectWallet();
    if (acc) setAccount(acc);
  };

  // ---------------- Place Order ----------------
  const handleOrder = async () => {
    const userIdToUse = userid || account; // Use login user OR wallet
    if (!userIdToUse || !productdetails) {
      alert("❌ Please log in or connect wallet before placing an order.");
      return;
    }

    setLoading(true);
    try {
      const res = await Axiosinstance.post("/orders/addOrder", {
        userid: userIdToUse,
        sellerId: productdetails.sellerId,
        productid: productdetails._id,
        quantity: 1,
        address:
          "Rathinam Tech Park, Pollachi Main Road, Eachanari, Coimbatore, Tamil Nadu 641021",
      });
      console.log("✅ Order placed:", res.data);
      alert("✅ Order placed successfully!");
      router.push("/landing");
    } catch (err) {
      console.error("❌ Error placing order:", err);
      alert("Failed to place order. Try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
    fetchUser();

    // Check if wallet already connected
    const initWallet = async () => {
      try {
        const web3 = getWeb3();
        const accounts = await web3.eth.getAccounts();
        if (accounts.length > 0) setAccount(accounts[0]);
      } catch (err) {
        console.warn("Wallet not connected yet.");
      }
    };
    initWallet();
  }, []);

  return (
    <div className="font-inter m-12">
      <h1 className="text-xl font-bold">CheckOut</h1>

      {/* Wallet/User Info */}
      <div className="mb-4 flex items-center gap-4">
        {userid ? (
          <p className="bg-blue-600 text-white px-3 py-1 rounded">
            User ID: {userid.substring(0, 6)}...
          </p>
        ) : account ? (
          <p className="bg-green-600 text-white px-3 py-1 rounded">
            Wallet: {account.substring(0, 6)}...
          </p>
        ) : (
          <button
            onClick={handleConnectWallet}
            className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
          >
            Connect Wallet
          </button>
        )}
      </div>

      {/* Product Details */}
      <div className="bg-green-100 p-6 rounded-md my-3">
        {productdetails ? (
          <div className="flex flex-col gap-2">
            <p><strong>Product Name:</strong> {productdetails.productName}</p>
            <p><strong>Price:</strong> {productdetails.productPrice}</p>
            <p><strong>Stock:</strong> {productdetails.stock}</p>
          </div>
        ) : (
          <p>Loading product...</p>
        )}
      </div>

      {/* Payment Summary */}
      {productdetails && (
        <div className="bg-green-100 p-6 rounded-md my-3">
          <div className="flex flex-col gap-2">
            <p><strong>Total Amount:</strong> {productdetails.productPrice}</p>
            <p><strong>Delivery Fee:</strong> 40 Rs</p>
            <p><strong>Grand Total:</strong> {productdetails.productPrice + 40}</p>
          </div>
        </div>
      )}

      {/* Place Order Button */}
      <div className="text-center mt-2">
        <button
          onClick={handleOrder}
          disabled={loading}
          className={`bg-black rounded-md text-white px-3 py-2 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Placing Order..." : "Place Order"}
        </button>
      </div>
    </div>
  );
};

export default Page;
