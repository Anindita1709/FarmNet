import orderSchema from '../model/ordersSchema.js';
import productSchema from '../model/productsSchema.js';
import User from "../model/userModel.js";  
import { ethers } from "ethers";
import mongoose from "mongoose"; // ✅ Add this at the top
/*
import fs from "fs";
import path from "path";

const farmNetOrderPath = path.resolve(
  "blockchain/artifacts/contracts/FarmNetOrder.sol/FarmNetOrder.json"
);


if (!fs.existsSync(farmNetOrderPath)) {
  console.error("FarmNetOrder.json not found at:", farmNetOrderPath);
  process.exit(1);
}

const FarmNetOrderJSON = JSON.parse(fs.readFileSync(farmNetOrderPath, "utf8"));
const FarmNetOrderABI = FarmNetOrderJSON.abi;

// Hardhat / Sepolia setup
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contractAddress = process.env.FARMNETORDER_ADDRESS;
const farmNetOrder = new ethers.Contract(contractAddress, FarmNetOrderABI.abi, wallet);

export const createOrder = async (req, res) => {
  try {
    const { userId, farmer, productName, amount } = req.body;

    // 1️⃣ Send transaction to blockchain
    const tx = await farmNetOrder.placeOrder(farmer, productName, amount);
    const receipt = await tx.wait(); // Wait until mined

    // 2️⃣ Extract the OrderPlaced event from receipt
    const event = receipt.events?.find(e => e.event === "OrderPlaced");
    const orderId = event?.args?.id;

    // 3️⃣ Save order in MongoDB including txHash & blockchain orderId
    const newOrder = await orderSchema.create({
      userId,
      farmer,
      productName,
      amount,
      blockchainOrderId: orderId.toString(),
      txHash: tx.hash,
      status: "Placed",
    });

    res.status(201).json({
      message: "Order placed successfully",
      order: newOrder,
      blockchainReceipt: receipt, // optional: send full receipt
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to place order", error: err.message });
  }
};
*/
//import { buyProduct } from "../blockchain/services/contract.service.js";
// -------------------- Add Order --------------------
/*
export const addOrder = async (req, res) => {
  try {
    const { userid, sellerId, productid, quantity, address } = req.body;

    const product = await productSchema.findById(productid);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const totalAmount = product.productPrice * quantity;

    await orderSchema.create({
      userid,
      productid,
      quantity,
      totalAmount,
      sellerId,
      orderStatus: 'pending',
      address,
      orderDate: new Date(),
    });
    

    res.status(201).json({ message: "Order placed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
*/
// -------------------- Add Order (with blockchain) --------------------

export const addOrder = async (req, res) => {
  try {
    const { userid, sellerId, productid, quantity, address } = req.body;

    // 1️⃣ Validate product
    const product = await productSchema.findById(productid);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const totalAmount = product.productPrice * quantity;

    // 2️⃣ Create MongoDB order
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
/*
    // 3️⃣ Send blockchain transaction
    try {
      const { txHash, orderId } = await createBlockchainOrder(
        userid,
        sellerId,
        productid,
        totalAmount
      );

      // 4️⃣ Update MongoDB order with blockchain info
      newOrder.blockchainTxHash = txHash;
      newOrder.blockchainOrderId = orderId || null;
      newOrder.verifiedOnBlockchain = true;
      await newOrder.save();

      res.status(201).json({
        message: "✅ Order placed successfully (on-chain + off-chain)",
        order: newOrder,
      });
    } catch (blockchainError) {
      console.error("⚠️ Blockchain transaction failed:", blockchainError);
      res.status(201).json({
        message:
          "Order created in database, but blockchain transaction failed.",
        order: newOrder,
        blockchainError: blockchainError.message,
      });
    }
      */

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

// -------------------- Get Orders by Farmer --------------------
/*
export const getOrdersByFarmer = async (req, res) => {
  try {
    const { farmerid } = req.params;

    const orders = await orderSchema.find({ sellerId: farmerid });

    const products = await Promise.all(
      orders.map(async (order) => {
        return await productSchema.findById(order.productid);
      })
    );

    res.status(200).json({ orders, products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
*/
/*
export const getOrdersByFarmer = async (req, res) => {
  try {
    const { farmerid } = req.params;

    if (!farmerid) {
      return res.status(400).json({ message: "Farmer ID is required" });
    }

    // Fetch all orders for this farmer, populate product and buyer info
    const orders = await orderSchema
      .find({ sellerId: farmerid })
      .populate("productid", "productName productPrice productImage") // shows product info
      .populate("buyerId", "name email phone") // shows who placed the order
      .sort({ createdAt: -1 }); // latest orders first

    if (!orders.length) {
      return res.status(200).json({
        success: true,
        message: "No orders received yet",
        orders: [],
      });
    }

    // Send detailed response
    res.status(200).json({
      success: true,
      count: orders.length,
      orders: orders.map((order) => ({
        _id: order._id,
        product: order.productid,
        buyer: order.buyerId,
        quantity: order.quantity,
        totalAmount: order.totalAmount,
        status: order.status, // pending / delivered
        transactionHash: order.transactionHash || null,
        createdAt: order.createdAt,
      })),
    });
  } catch (error) {
    console.error("❌ Error fetching farmer orders:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
*/
/*
export const getOrdersByFarmer = async (req, res) => {
  try {
    const { farmerid } = req.params;

    // Convert to string if needed
    const orders = await orderSchema.find({ sellerId: farmerid.toString() });

    if (!orders || orders.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No orders received yet",
        orders: [],
      });
    }

    // Populate product details
    const ordersWithProducts = await Promise.all(
      orders.map(async (order) => {
        const product = await productSchema.findById(order.productid);
        return {
          ...order._doc,
          productName: product?.productName || "Unknown Product",
          productPrice: product?.productPrice || 0,
        };
      })
    );

    res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      orders: ordersWithProducts,
    });
  } catch (error) {
    console.error("❌ getOrdersByFarmer Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
*/
/*
export const getOrdersByFarmer = async (req, res) => {
  try {
    const { farmerid } = req.params;

    console.log("🟢 Farmer ID received:", farmerid);

    // Let's see what data actually exists in DB
    const allOrders = await orderSchema.find({});
    console.log("🟣 All orders in DB:", allOrders.map(o => ({
      sellerId: o.sellerId,
      userid: o.userid,
      productid: o.productid,
    })));

    // Try both string and ObjectId searches
    let orders = await orderSchema.find({ sellerId: farmerid });
    console.log("🔵 Orders found (string search):", orders.length);

    if (orders.length === 0) {
      orders = await orderSchema.find({
        sellerId: new mongoose.Types.ObjectId(farmerid),
      });
      console.log("🟠 Orders found (ObjectId search):", orders.length);
    }

    if (!orders || orders.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No orders received yet",
        orders: [],
      });
    }

    const ordersWithProducts = await Promise.all(
      orders.map(async (order) => {
        const product = await productSchema.findById(order.productid);
        return {
          ...order._doc,
          productName: product?.productName || "Unknown Product",
          productPrice: product?.productPrice || 0,
        };
      })
    );

    res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      orders: ordersWithProducts,
    });
  } catch (error) {
    console.error("❌ getOrdersByFarmer Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
*/

/*
export const getOrdersByFarmer = async (req, res) => {
  try {
    const { farmerid } = req.params;

    console.log("🟢 Farmer ID received:", farmerid);

    // Debug existing data
    const allOrders = await orderSchema.find({});
    console.log(
      "🟣 All orders in DB:",
      allOrders.map((o) => ({
        sellerId: o.sellerId,
        userid: o.userid,
        productid: o.productid,
      }))
    );

    // Try both string and ObjectId searches
    let orders = await orderSchema.find({ sellerId: farmerid });
    console.log("🔵 Orders found (string search):", orders.length);

    if (orders.length === 0) {
      orders = await orderSchema.find({
        sellerId: new mongoose.Types.ObjectId(farmerid),
      });
      console.log("🟠 Orders found (ObjectId search):", orders.length);
    }

    if (!orders || orders.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No orders received yet",
        orders: [],
      });
    }

    // ✅ Enrich each order with product & buyer info
    const detailedOrders = await Promise.all(
      orders.map(async (order) => {
        const product = await productSchema.findById(order.productid);
        const buyer = await User.findById(order.userid);

        return {
          _id: order._id,
          quantity: order.quantity,
          totalAmount: order.totalAmount,
          orderStatus: order.orderStatus || "pending",
          orderDate: order.orderDate || order.createdAt,
          transactionHash: order.blockchainTxHash || null,

          product: product
            ? {
                productName: product.productName,
                productPrice: product.productPrice,
                productImage: product.productImage || null,
              }
            : {
                productName: "Unknown Product",
                productPrice: 0,
                productImage: null,
              },

          buyer: buyer
            ? {
                name: buyer.name,
                email: buyer.email,
                phone: buyer.phone,
              }
            : {
                name: "Unknown Buyer",
                email: "N/A",
                phone: "N/A",
              },
        };
      })
    );

    console.log("✅ Returning detailed orders:", detailedOrders.length);

    res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      orders: detailedOrders,
    });
  } catch (error) {
    console.error("❌ getOrdersByFarmer Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

*/

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

// Get all orders for a specific farmer
/*
export const getOrdersByFarmer = async (req, res) => {
  try {
    const { farmerid } = req.params;
    console.log("🟢 Farmer ID received:", farmerid);

    let orders = await orderSchema.find({
      $or: [
        { sellerId: farmerid }, // string match
        { sellerId: new mongoose.Types.ObjectId(farmerid) } // ObjectId match
      ]
    });

    if (!orders || orders.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No orders received yet",
        orders: [],
      });
    }

    const ordersWithDetails = await Promise.all(
      orders.map(async (order) => {
        const product = await productSchema.findById(order.productid);
        const buyer = await User.findById(order.userid);

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
          status: order.orderStatus || "PENDING",
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
*/
/*
export const getOrdersByFarmer = async (req, res) => {
  try {
    const { farmerid } = req.params;
    console.log("🟢 Farmer ID received:", farmerid);

    let orders = await orderSchema.find({ sellerId: farmerid });

    if (!orders.length && mongoose.isValidObjectId(farmerid)) {
      orders = await orderSchema.find({ sellerId: new mongoose.Types.ObjectId(farmerid) });
    }

    if (!orders.length) {
      return res.status(200).json({
        success: true,
        message: "No orders received yet",
        orders: [],
      });
    }

    const ordersWithDetails = await Promise.all(
      orders.map(async (order) => {
        let product = null;
        let buyer = null;

        try {
          product = await productSchema.findById(order.productid);
        } catch (err) {
          console.warn("⚠️ Product fetch failed:", err.message);
        }

        try {
          // Try walletAddress lookup first
          buyer = await userSchema.findOne({ walletAddress: order.userid });

          // Try ObjectId lookup if that failed
          if (!buyer && mongoose.isValidObjectId(order.userid)) {
            buyer = await userSchema.findById(order.userid);
          }
        } catch (err) {
          console.warn("⚠️ Buyer fetch failed:", err.message);
        }

        return {
          _id: order._id,
          product: product
            ? {
                productName: product.productName,
                productPrice: product.productPrice,
                productImage: product.productImage,
              }
            : null,
          buyer: buyer
            ? {
                name: buyer.name,
                email: buyer.email,
                phone: buyer.phone,
              }
            : { name: "Unknown Buyer", email: "", phone: "" },
          quantity: order.quantity,
          totalAmount: order.totalAmount,
          status: order.orderStatus || "pending",
          transactionHash: order.transactionHash || null,
          createdAt: order.orderDate,
        };
      })
    );

    res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      orders: ordersWithDetails,
    });
  } catch (error) {
    console.error("❌ getOrdersByFarmer Error:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
*/
// -------------------- Get Orders by User --------------------
/*
export const getOrders = async (req, res) => {
  try {
    const { userid } = req.params;
    const orders = await orderSchema.find({ userid });
    res.status(200).json({ orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
*/
/*
export const getOrders= async (req, res) => {
  try {
    const { userid } = req.params;

    // Fetch orders for this user
    const orders = await orderSchema.find({ userid }).lean();

    // Attach product info and blockchain link
    const enrichedOrders = await Promise.all(
      orders.map(async (order) => {
        const product = await productSchema.findById(order.productid).lean();
        return {
          ...order,
          product: product || null,
          blockchainLink: order.verifiedOnBlockchain
            ? `https://sepolia.etherscan.io/tx/${order.blockchainTxHash}`
            : null,
        };
      })
    );

    res.status(200).json(enrichedOrders);
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
*/
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
