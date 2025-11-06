"use client";
import { UserCircle, MapPin, ShoppingCart, LogOut } from "lucide-react";

import Link from "next/link";
import React from "react";

import { useCart } from "@/context/CartContext";
const UserNav = () => {
  const { cart } = useCart(); // ✅ Access cart count
  return (
    <nav className=" top-0 left-0  sticky  flex font-inter z-30 backdrop-blur-md bg-white  w-full">
      <div className="flex flex-1">
        <h1 className="px-10 py-2 font-bold text-black font-manrope text-xl">
          Agri Chain
        </h1>
      </div>

      <div className="flex  justify-end mr-5 gap-4 x-10 py-2">
        <Link href="">
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
        {/*
        <div className="flex gap-2 cursor-pointer">
          <ShoppingCart size={24} />
          <p>Cart</p>
        </div>
        */}
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