import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth";

const allowRoles = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.role) {
      return res.status(403).json({ message: "Role not found" });
    }

    if (!allowedRoles.includes(req.role)) {
      return res.status(403).json({
        message: "Access denied for this role",
      });
    }

    next();
  };
};

export default allowRoles;
