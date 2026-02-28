import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  userId: string;
  role: "user" | "municipality" | "admin";
}


export interface AuthRequest extends Request {
  userId?: string;
  role?: "user" | "municipality" | "admin";
}




const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1️⃣ Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // 2️⃣ Verify token
const decoded = jwt.verify(
  token,
  process.env.JWT_SECRET as string
) as JwtPayload;

req.userId = decoded.userId;
req.role = decoded.role; // 👈 ADD THIS
// 👈 ADD THIS


    // 4️⃣ Continue
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default authMiddleware;
