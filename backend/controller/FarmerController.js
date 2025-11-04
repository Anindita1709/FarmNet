import Farmer from "../model/FarmerSchema.js";
import bcrypt from "bcrypt";

export const registerFarmer = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const farmer = await Farmer.findOne({ email });
    if (farmer) {
      return res.json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newFarmer = new Farmer({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    await newFarmer.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginFarmer = async (req, res) => {
  try {
    const { email, password } = req.body;

    const farmer = await Farmer.findOne({ email });
    if (!farmer) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, farmer.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    res.status(200).json({ message: "Login successful", farmer });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
export const getFarmerById = async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.params.id).select("name email");
    if (!farmer) {
      return res.status(404).json({ message: "Farmer not found" });
    }
    res.status(200).json({ farmer });
  } catch (error) {
    console.error("Error fetching farmer:", error);
    res.status(500).json({ message: "Server error" });
  }
};