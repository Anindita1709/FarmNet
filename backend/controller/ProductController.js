import productSchema from "../model/productsSchema.js";
//import orderSchema from "../model/ordersSchema.js";
//import paymentSchema from "../model/paymentSchema.js";
//import User from "../model/userModel.js";
import Farmer from "../model/FarmerSchema.js";

// Add Product
export const addProduct = async (req, res) => {
  try {
      console.log("📩 Received body in backend:", req.body); // ADD THIS LINE
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


// Get All Products
export const getProducts = async (req, res) => {
  try {
    const products = await productSchema.find();
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// Get Product by ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productSchema.findById(id);
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
/*
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, quantity, description, category, image } = req.body;

    const updatedProduct = await productSchema.findByIdAndUpdate(
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
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
}
*/
/*
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("🧩 Product ID:", id);
    console.log("🛠 Request Body:", req.body);

    const {
      productName,
      productPrice,
      stock,
      productDescription,
      productCategory,
      productImage,
      sellerId,
    } = req.body;

    if (!id) {
      return res.status(400).json({ success: false, message: "Missing product ID" });
    }
 // ✅ Validate numeric fields safely
    const safePrice = Number(productPrice);
    const safeStock = Number(stock);

    if (isNaN(safePrice) || isNaN(safeStock)) {
      return res
        .status(400)
        .json({ success: false, message: "Price and stock must be valid numbers" });
    }
    const updateData = {
      productName,
       productPrice: safePrice,
      stock: safeStock,
      productDescription,
      productCategory,
      productImage,
      sellerId,
    };

    console.log("📦 Final update data:", updateData);

    const updatedProduct = await productSchema.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      message: "✅ Product updated successfully",
      updated: updatedProduct,
    });
  } catch (error) {
    console.error("❌ Backend update error:", error.message);
    console.error(error.stack);
    res.status(500).json({ success: false, message: error.message });
  }
};
*/
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("🧩 Product ID:", id);
    console.log("🛠 Raw Request Body:", req.body);

    // Handle both naming conventions (frontend 'name', 'price' OR backend 'productName', 'productPrice')
    const {
      name,
      price,
      stock,
      description,
      category,
      image,
      userid,
      productName,
      productPrice,
      productDescription,
      productCategory,
      productImage,
      sellerId,
    } = req.body;

    // Normalize fields
    const finalData = {
      productName: productName || name,
      productPrice: Number(productPrice ?? price),
      stock: Number(stock),
      productDescription: productDescription || description,
      productCategory: productCategory || category,
      productImage: productImage || image,
      sellerId: sellerId || userid,
    };

    // Validate required fields
    if (!finalData.productName || !finalData.productPrice || !finalData.stock || !finalData.productCategory) {
      return res.status(400).json({ success: false, message: "Missing required product fields" });
    }

    console.log("📦 Final update data:", finalData);

    const updatedProduct = await productSchema.findByIdAndUpdate(id, finalData, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      message: "✅ Product updated successfully",
      updated: updatedProduct,
    });
  } catch (error) {
    console.error("❌ Backend update error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProductBySellerId = async (req, res) => {
  try {
    const { sellerId } = req.params;
    console.log("🔍 Seller ID:", sellerId);

    const product = await productSchema.find({ sellerId });
    if (!product || product.length === 0) {
      return res.status(404).json({ message: "No products found for this seller" });
    }

    res.status(200).json({ product });
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await productSchema.findByIdAndDelete(id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
/*
export const getSellerDetails = async (req, res) => {
  try {
    const { sellerId } = req.params;
    console.log(sellerId);
    
    const seller = await Farmer.findById(sellerId);
    res.json({ seller }).status(200);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};*/
export const getSellerDetails = async (req, res) => {
  try {
    const { sellerId } = req.params;
    console.log("🧩 Received sellerId:", sellerId);

    // Validate ObjectId format
    if (!sellerId || sellerId.length !== 24) {
      return res.status(400).json({ message: "Invalid seller ID format" });
    }

    const seller = await Farmer.findById(sellerId).select("name email");

    if (!seller) {
      console.log("❌ Farmer not found in DB");
      return res.status(404).json({ message: "Farmer not found" });
    }

    console.log("✅ Found farmer:", seller);
    res.status(200).json({ farmer: seller });
  } catch (error) {
    console.error("🔥 Error fetching seller:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};