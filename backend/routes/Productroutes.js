import express from "express";
import {
  addProduct,getProducts,getProductById,getProductBySellerId,getProductsByCategory,updateProduct,deleteProduct
  
} from "../controller/ProductController.js";

const router = express.Router();

router.post("/addProduct", addProduct);
router.get('/getProducts', getProducts);
router.get('/getProductById/:id', getProductById);
router.get('/getProductBySellerId/:sellerId', getProductBySellerId);
router.get('/getProductsByCategory/:category', getProductsByCategory);
router.put('/updateProduct/:id', updateProduct);
router.delete("/deleteProduct/:id", deleteProduct);
export default router;
