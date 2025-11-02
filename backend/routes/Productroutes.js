import express from "express";
import {
  addProduct,
  
} from "../controller/ProductController.js";

const router = express.Router();

router.post("/addProduct", addProduct);


export default router;
