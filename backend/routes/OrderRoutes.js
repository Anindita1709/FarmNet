import express from "express";
import {
  addOrder,
  getOrders,
  getOrdersByFarmer,
  updateOrderStatus,
} from "../controller/ordersController.js";
import {
  getuserCart,
  addProductToCart,
} from "../controller/user.controller.js";

const router = express.Router();

router.post("/addOrder", addOrder);
router.get("/getOrders", getOrders);
router.get("/getOrdersByFarmer/:farmerid", getOrdersByFarmer);
router.put("/updateOrderStatus/:id", updateOrderStatus);
router.get("/getuserCart/:userid", getuserCart);
router.post("/addProductToCart", addProductToCart);


export default router;
