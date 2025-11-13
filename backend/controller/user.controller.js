/*
import User from "../model/userModel.js";
import bcrypt from 'bcrypt'
import jsonwebtoken from "jsonwebtoken";
export const test = (req,res) => {
  res.json({message: 'API is working!'});
};

   export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if( !email || !password  || email === '' || password === ''){
                return res.status(400).json({message: 'All fields are required'})
            }
    try{
    const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }
        const token = jsonwebtoken.sign({ _id: user._id }, process.env.SIGN_JWT);

        const {password: pass, ...rest} = user._doc;

        res.status(200).json({ message: "Login successful" , user:rest , token}); 
    }catch(error){
        console.error(error);
    res.status(500).json({ message: error.message || "Internal Server Error" });
    }
    //console.log(req.body);
   }

   export const registerUser = async (req,res) => {
     console.log("Incoming body:", req.body); 
        const { name, email, phone ,password} = req.body;
        const user = await User.findOne({ email });
        
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

            if(!name || !email || !password || !phone || name === '' || email === '' || phone === ''|| password === ''){
                return res.status(400).json({message: 'All fields are required'})
            }
        
        const hashedPassword = await bcrypt.hash(password, 12);
        
        const newUser = new User({
            name, email, phone, password:hashedPassword
        });
        try{
        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    }
    catch (error) {
        res.json({ message:error }).status(500);
    }
   }
export const getuserCart = async (req, res) => {
    try {
        const { userid } = req.params;
        const user = await userSchema.findById(userid);
        res.status(200).json({ cart: user.cart });
    }
    catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
}

export const addProductToCart = async (req, res) => {
    try {
        const { userid, productid } = req.body;
        const user = await userSchema.findById(userid);
        user.cart.push({ productid });
        await user.save();
        res.status(200).json({ message: "Product added to cart" });
    }
    catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
}
    */
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../model/userModel.js";

dotenv.config();

// ✅ Test Route
export const test = (req, res) => {
  res.status(200).json({ success: true, message: "API is working!" });
};

// ✅ Register User
export const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    console.log("📩 Incoming registration:", req.body);

    // Validation
    if (!name || !email || !password || !phone) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: { name, email, phone },
    });
  } catch (error) {
    console.error("❌ Registration Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ✅ Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    // Generate JWT Token
    const token = jwt.sign({ _id: user._id }, process.env.SIGN_JWT, { expiresIn: "7d" });

    const { password: pass, ...userData } = user._doc;

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: userData,
    });
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ✅ Get User Cart
export const getuserCart = async (req, res) => {
  try {
    const { userid } = req.params;

    if (!userid) {
      return res.status(400).json({ success: false, message: "User ID required" });
    }

    const user = await User.findById(userid).populate("cart.productid", "productName productPrice");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      cart: user.cart || [],
    });
  } catch (error) {
    console.error("❌ Get Cart Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ✅ Add Product to Cart
export const addProductToCart = async (req, res) => {
  try {
    const { userid, productid } = req.body;

    if (!userid || !productid) {
      return res.status(400).json({ success: false, message: "User ID and Product ID required" });
    }

    const user = await User.findById(userid);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check if product already exists in cart
    const existingItem = user.cart.find((item) => item.productid.toString() === productid);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      user.cart.push({ productid, quantity: 1 });
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Product added to cart",
      cart: user.cart,
    });
  } catch (error) {
    console.error("❌ Add to Cart Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ✅ Remove Product from Cart
export const removeProductFromCart = async (req, res) => {
  try {
    const { userid, productid } = req.body;

    if (!userid || !productid) {
      return res.status(400).json({ success: false, message: "User ID and Product ID required" });
    }

    const user = await User.findById(userid);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.cart = user.cart.filter((item) => item.productid.toString() !== productid);
    await user.save();

    res.status(200).json({ success: true, message: "Product removed from cart", cart: user.cart });
  } catch (error) {
    console.error("❌ Remove from Cart Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
