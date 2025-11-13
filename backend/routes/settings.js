import express from "express";
import bcrypt from "bcryptjs";
import User from "../model/userModel.js"; // adjust path if needed
import { authMiddleware } from "../middleware/auth.js"; // your auth middleware

const router = express.Router();

// GET current user profile
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const { name, email, phone, walletAddress, emailNotif, smsNotif } = req.user;
    res.json({ name, email, phone, walletAddress, emailNotif, smsNotif });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE profile info
router.put("/update-profile", authMiddleware, async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    if (name) req.user.name = name;
    if (email) req.user.email = email;
    if (phone) req.user.phone = phone;

    await req.user.save();
    res.json({ message: "Profile updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE password
router.put("/update-password", authMiddleware, async (req, res) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword) return res.status(400).json({ message: "Password required" });

    const salt = await bcrypt.genSalt(10);
    req.user.password = await bcrypt.hash(newPassword, salt);

    await req.user.save();
    res.json({ message: "Password updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE notification preferences
router.put("/update-notifications", authMiddleware, async (req, res) => {
  try {
    const { emailNotif, smsNotif } = req.body;
    if (typeof emailNotif === "boolean") req.user.emailNotif = emailNotif;
    if (typeof smsNotif === "boolean") req.user.smsNotif = smsNotif;

    await req.user.save();
    res.json({ message: "Notification preferences updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
