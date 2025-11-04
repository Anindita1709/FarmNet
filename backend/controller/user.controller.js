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