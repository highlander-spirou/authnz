import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../lib/hashes/jwt-token";
import { LoginSignedToken } from "../routers/auth/types";

export const userSessionGuard = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const cookies = req.cookies;
  const userSession = cookies["user-session"];
  if (!userSession) {
    return res.status(403).json({ message: "Unauthorized" });
  }
  const payload = verifyToken<LoginSignedToken>(userSession);
  if (!payload) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  req.context = { userId: payload.userId };
  next();
};
