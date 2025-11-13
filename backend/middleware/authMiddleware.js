import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ success: false, message: "User not logged in" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.SIGN_JWT, (err, decoded) => {
    if (err) {
      return res.status(403).json({ success: false, message: "Invalid or expired token" });
    }

    req.user = decoded; // decoded = { _id: ..., iat: ..., exp: ... }
    next();
  });
};
