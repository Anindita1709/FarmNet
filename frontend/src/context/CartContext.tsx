"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface Product {
  _id: string;
  productName: string;
  productPrice: number;
  stock?: number;
  productDescription?: string;
  productCategory?: string;
  productImage?: string | string[];
  sellerId?: string; // ✅ added seller reference
}

interface CartContextType {
  cart: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Product[]>([]);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const exists = prev.find((p) => p._id === product._id);
      if (exists) return prev; // prevent duplicates
      return [...prev, product];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((p) => p._id !== id));
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
