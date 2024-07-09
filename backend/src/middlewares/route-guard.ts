import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../lib/jwt-token";

export const routeGuard = (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const payload = verifyToken(authorization);
  if (!payload) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (payload.role !== "vào!") {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};
