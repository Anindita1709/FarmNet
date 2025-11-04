import express from "express";
import {
  addProduct,getProducts,getProductById,getProductBySellerId,getProductsByCategory,updateProduct,deleteProduct,getSellerDetails
  
} from "../controller/ProductController.js";

const router = express.Router();

router.post("/addProduct", addProduct);
router.get('/getProducts', getProducts);
router.get('/getProductById/:id', getProductById);

router.get('/getProductsByCategory/:category', getProductsByCategory);
router.put('/updateProduct/:id', updateProduct);
router.delete("/deleteProduct/:id", deleteProduct);
router.get('/getProductBySellerId/:sellerId', getProductBySellerId);
router.get('/getSellerDetails/:sellerId', getSellerDetails);
export default router;
