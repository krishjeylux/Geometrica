import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth";

export const userOnly = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.userRole !== "user") {
    return res.status(403).json({ message: "User access only" });
  }
  next();
};

export const municipalityOnly = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.userRole !== "municipality") {
    return res.status(403).json({ message: "Municipality access only" });
  }
  next();
};

export const companyOnly = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.userRole !== "company") {
    return res.status(403).json({ message: "Company access only" });
  }
  next();
};
