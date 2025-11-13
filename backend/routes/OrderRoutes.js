import express from "express";
import {
  addOrder,
  getOrders,
  getOrdersByFarmer,
  updateOrderStatus,
   updateOrderTx,
} from "../controller/ordersController.js";
import {
  getuserCart,
  addProductToCart,
} from "../controller/user.controller.js";
import { verifyToken } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/addOrder",addOrder);
router.put("/updateOrderTx/:id",updateOrderTx); // ✅ Added route
router.get("/getOrders/:userid", getOrders);

router.get("/getOrders",getOrders);
router.get("/getOrdersByFarmer/:farmerid", getOrdersByFarmer);
router.put("/updateOrderStatus/:id", updateOrderStatus);
router.get("/getuserCart/:userid", getuserCart);
router.post("/addProductToCart",addProductToCart);

export default router;
