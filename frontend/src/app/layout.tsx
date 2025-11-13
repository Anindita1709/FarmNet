

import type { Metadata } from "next";
import { Geist, Geist_Mono  , Inter ,Manrope } from "next/font/google";
import "./global.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CartProvider } from "../context/CartContext";
//import Navbar from "../../component/UserNav.tsx";
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "FarmNet - Connecting Indian Farmers to the Consumers",
  description: "Connecting Indian Farmers to the Consumers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
      <link rel="shortcut icon" href="https://cdn-icons-png.flaticon.com/512/187/187039.png" />
      </head>
      <body
        className={` ${manrope.variable} ${inter.variable} antialiased`}
      >
         {/* ✅ Provide cart state globally */}
        <CartProvider>
          {/* ✅ Navbar visible everywhere with cart count */}
          
          {children}
          <ToastContainer position="top-right" autoClose={2000} />
        </CartProvider>

     
      </body>
    </html>
  );
}