import User from "../model/userModel.js";
import bcrypt from 'bcrypt'
import jsonwebtoken from "jsonwebtoken";
export const test = (req,res) => {
  res.json({message: 'API is working!'});
};


