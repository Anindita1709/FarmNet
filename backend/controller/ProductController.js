import productSchema from "../model/productsSchema.js";
//import orderSchema from "../model/ordersSchema.js";
//import paymentSchema from "../model/paymentSchema.js";
//import User from "../model/userModel.js";
//import Farmer from "../model/FarmerSchmea.js";

// Add Product
export const addProduct = async (req, res) => {
  try {
    const { name, price, stock, description, category, image, userid } = req.body;

    if (!name || !price || !stock || !category || !userid) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const productImages = Array.isArray(image) ? image : [image];

    const product = await productSchema.create({
      productName: name,
      productPrice: price,
      stock,
      productDescription: description,
      productCategory: category,
      productImage: productImages,
      sellerId: userid
    });

    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
/*

// Get All Products
export const getProducts = async (req, res) => {
  try {
    const products = await productSchmea.find();
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// Get Product by ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productSchmea.findById(id);
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// Get Products by Category
export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const products = await productSchmea.find({ productCategory: category });
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// Update Product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, quantity, description, category, image } = req.body;

    const updatedProduct = await productSchmea.findByIdAndUpdate(
      id,
      {
        productName: name,
        productPrice: price,
        stock: quantity,
        productDescription: description,
        productCategory: category,
        productImage: image,
      },
      { new: true }
    );

    res.status(200).json({ success: true, product: updatedProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: "Something went wrong" })
*/