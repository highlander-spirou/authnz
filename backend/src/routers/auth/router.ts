import { Router } from "express";
import authController from "./auth.controllers";
import { userSessionGuard } from "../../middlewares/user-session-guard";

const authRouter = Router();

authRouter.post("/login", authController.login);
authRouter.post("/register", authController.register);
authRouter.get("/send-email-verify", userSessionGuard, authController.sendEmailVerify);
authRouter.get("/verify-email/:token", authController.verifyEmail);

export default authRouter;
