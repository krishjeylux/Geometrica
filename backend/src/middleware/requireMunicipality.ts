import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth";

const requireMunicipality = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.userRole !== "municipality") {
    return res.status(403).json({
      message: "Access denied: Municipality only",
    });
  }

  next();
};

export default requireMunicipality;
