import User from "../model/userModel.js";
import bcrypt from 'bcrypt'
import jsonwebtoken from "jsonwebtoken";
export const test = (req,res) => {
  res.json({message: 'API is working!'});
};

   export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }
    console.log(req.body);
   }

   export const registerUser = async (req,res) => {
     console.log("Incoming body:", req.body); 
        const { name, email, phone ,password} = req.body;
        const user = await User.findOne({ email });
        
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }
/*
            if(!name || !email || !password || !phone || name === '' || email === '' || phone === ''|| password === ''){
                return res.status(400).json({message: 'All fields are required'})
            }*/
        
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
