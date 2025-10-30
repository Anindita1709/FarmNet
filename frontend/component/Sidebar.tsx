"use client";

import {
  House,
  Carrot,
  ScrollText,
  IndianRupee,
  ChartNoAxesCombined,
  LogOut,
  MapPinCheck,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { toast } from "react-toastify";

const SideBar = () => {
  const [selected, setSelected] = React.useState("home");
  const pathname = usePathname();
  const router = useRouter();

  React.useEffect(() => {
    // Auto-highlight current route
    if (pathname === "/dashboard") setSelected("home");
    else if (pathname.includes("myproducts")) setSelected("My Products");
    else if (pathname.includes("market")) setSelected("Market");
    else if (pathname.includes("orders")) setSelected("Orders");
    else if (pathname.includes("analytics")) setSelected("Analytics");
    else if (pathname.includes("settings")) setSelected("Settings");
    else setSelected("home");
  }, [pathname]);

  const handleLogout = () => {
    toast.success("Logged Out");
    localStorage.removeItem("user");
    router.push("/");
  };

  return (
    <div className="fixed h-svh left-0 h-[calc(100vh-64px)] w-[20%] bg-white border-r shadow-sm font-inter flex flex-col justify-between">
      {/* Top Section */}
      <div>
        <h1 className="text-2xl font-bold text-primary p-5">Dashboard</h1>

        <div className="px-4">
          <Link href="/dashboard" onClick={() => setSelected("home")}>
            <div
              className={`flex items-center gap-3 rounded-md p-3 mt-2 cursor-pointer transition-all ${
                selected === "home"
                  ? "bg-primary text-cyan-500"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <House size={22} />
              <p>Home</p>
            </div>
          </Link>

          <Link href="/dashboard/myproducts" onClick={() => setSelected("My Products")}>
            <div
              className={`flex items-center gap-3 rounded-md p-3 mt-2 cursor-pointer transition-all ${
                selected === "My Products"
                  ? "bg-primary text-cyan-500"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Carrot size={22} />
              <p>My Products</p>
            </div>
          </Link>

          <Link href="/dashboard/market" onClick={() => setSelected("Market")}>
            <div
              className={`flex items-center gap-3 rounded-md p-3 mt-2 cursor-pointer transition-all ${
                selected === "Market"
                  ? "bg-primary text-cyan-500"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <MapPinCheck size={22} />
              <p>Local Market</p>
            </div>
          </Link>

          <Link href="/dashboard/myorders" onClick={() => setSelected("Orders")}>
            <div
              className={`flex items-center gap-3 rounded-md p-3 mt-2 cursor-pointer transition-all ${
                selected === "Orders"
                  ? "bg-primary text-cyan-500"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <ScrollText size={22} />
              <p>My Orders</p>
            </div>
          </Link>

          <Link href="/dashboard/analytics" onClick={() => setSelected("Analytics")}>
            <div
              className={`flex items-center gap-3 rounded-md p-3 mt-2 cursor-pointer transition-all ${
                selected === "Analytics"
                  ? "bg-primary text-cyan-500"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <ChartNoAxesCombined size={22} />
              <p>Analytics</p>
            </div>
          </Link>

          <Link href="/dashboard/settings" onClick={() => setSelected("Settings")}>
            <div
              className={`flex items-center gap-3 rounded-md p-3 mt-2 cursor-pointer transition-all ${
                selected === "Settings"
                  ? "bg-primary text-cyan-500"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Settings size={22} />
              <p>Settings</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Logout Section */}
      <div className="p-5 border-t">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-red-600 hover:text-red-700 transition-all"
        >
          <LogOut size={22} />
          <p>Logout</p>
        </button>
      </div>
    </div>
  );
};

export default SideBar;
