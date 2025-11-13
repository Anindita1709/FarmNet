import orderSchema from '../model/ordersSchema.js';
import productSchema from '../model/productsSchema.js';
import User from "../model/userModel.js";  
import { ethers } from "ethers";
import mongoose from "mongoose"; 

export const addOrder = async (req, res) => {
  try {
    const { userid, sellerId, productid, quantity, address } = req.body;

    // Validate product
    const product = await productSchema.findById(productid);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const totalAmount = product.productPrice * quantity;

    // Create MongoDB order
    const newOrder = await orderSchema.create({
      userid,
      productid,
      quantity,
      totalAmount,
      sellerId,
      orderStatus: "pending",
      address,
      orderDate: new Date(),
      verifiedOnBlockchain: false, // initially false
    });

    res.status(201).json({
      message: "✅ Order placed  successfully ",
      order: newOrder,
    });
  } catch (error) {
    console.error("❌ Error adding order:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// -------------------- Update Order with Blockchain Tx --------------------
export const updateOrderTx = async (req, res) => {
  try {
    const { id } = req.params;
    const { transactionHash } = req.body;

    if (!transactionHash) {
      return res.status(400).json({ message: "Missing transaction hash" });
    }

    const updatedOrder = await orderSchema.findByIdAndUpdate(
      id,
      {
        blockchainTxHash: transactionHash,
        verifiedOnBlockchain: true,
      },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      message: "✅ Order updated with blockchain transaction",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("❌ Error updating blockchain tx:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getOrdersByFarmer = async (req, res) => {
  try {
    const { farmerid } = req.params;
    console.log("🟢 Farmer ID received:", farmerid);

    // Find orders for this farmer
    let orders = await orderSchema.find({ sellerId: farmerid });
    console.log("🔵 Orders found:", orders.length);
    if (!orders || orders.length === 0) {
      orders = await orderSchema.find({
        sellerId: new mongoose.Types.ObjectId(farmerid),
      });
    }

    if (!orders || orders.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No orders received yet",
        orders: [],
      });
    }

    // Populate product and buyer details safely
    const ordersWithDetails = await Promise.all(
      orders.map(async (order) => {
        const product = await productSchema.findById(order.productid);

        let buyer = null;
        try {
          // Try fetching buyer by wallet address (not ObjectId)
          buyer = await User.findOne({ walletAddress: order.userid });
          // If not found, try by ObjectId
          if (!buyer && mongoose.isValidObjectId(order.userid)) {
            buyer = await userSchema.findById(order.userid);
          }
        } catch (err) {
          console.warn("⚠️ Failed to fetch buyer info for:", order.userid);
        }

        return {
          _id: order._id,
          product: {
            productName: product?.productName || "Unknown Product",
            productPrice: product?.productPrice || 0,
            productImage: product?.productImage || null,
          },
          buyer: {
            name: buyer?.name || "Unknown Buyer",
            email: buyer?.email || "",
            phone: buyer?.phone || "",
          },
          quantity: order.quantity,
          totalAmount: order.totalAmount,
          status: order.orderStatus || "pending",
          transactionHash: order.blockchainTxHash || "",
          createdAt: order.orderDate || order.createdAt,
        };
      })
    );

    res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      orders: ordersWithDetails,
    });
  } catch (error) {
    console.error("❌ getOrdersByFarmer Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getOrders = async (req, res) => {
  try {
    const { userid } = req.params;
    const orders = await orderSchema.find({ userid }).populate("productid"); // populate product details
    res.json({ orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// -------------------- Update Order Status --------------------
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await orderSchema.findByIdAndUpdate(id, { orderStatus: status });

    res.status(200).json({ message: "Order status updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
