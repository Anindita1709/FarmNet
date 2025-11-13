"use client";
import { UserCircle, MapPin, ShoppingCart, LogOut, Wallet } from "lucide-react";
import Link from "next/link";
import React, { useState ,useEffect} from "react";
import { useCart } from "@/context/CartContext";
import { connectWallet } from "../src/utils/web3.js"; // adjust the path if needed

const UserNav = () => {
  const { cart } = useCart();
  const [account, setAccount] = useState<string | null>(null);
  const [isMetaMaskAvailable, setIsMetaMaskAvailable] = useState(false);

  // Check for MetaMask on client side
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      setIsMetaMaskAvailable(true);
    }
  }, []);


const handleConnectWallet = async () => {
    if (!isMetaMaskAvailable) {
      alert("Please install MetaMask!");
      return;
    }

    const acc = await connectWallet();
    if (acc) setAccount(acc);
  };
  // Shorten the address for display
  const shortAccount = account
    ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}`
    : null;

  return (
    <nav className="sticky top-0 left-0 flex font-inter z-30 backdrop-blur-md bg-white w-full shadow-md">
      <div className="flex flex-1">
        <h1 className="px-10 py-2 font-bold text-black font-manrope text-xl">
          FarmNet
        </h1>
      </div>

      <div className="flex justify-end mr-5 gap-4 py-2">
        <Link href="/landing/dashboard">
          <div className="flex gap-2 cursor-pointer">
            <UserCircle size={24} />
            <p>Account</p>
          </div>
        </Link>

        <Link href="/landing/quickstores">
          <div className="flex gap-2 cursor-pointer">
            <MapPin size={24} />
            <p>Quick Stores</p>
          </div>
        </Link>

        <Link href="/landing/cart">
          <div className="relative flex gap-2 cursor-pointer">
            <ShoppingCart size={24} />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full px-2">
                {cart.length}
              </span>
            )}
            <p>Cart</p>
          </div>
        </Link>

        {/* Connect Wallet Button */}
        <div
          className="flex gap-2 cursor-pointer items-center bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
          onClick={handleConnectWallet}
        >
          <Wallet size={20} />
          <p>{account ? shortAccount : "Connect Wallet"}</p>
        </div>

        <Link href="/userlogin">
          <div className="flex gap-2 cursor-pointer">
            <LogOut size={24} />
            <p>Logout</p>
          </div>
        </Link>
      </div>
    </nav>
  );
};

export default UserNav;
