import { Router } from "express";
import authController from "./auth.controllers";

const authRouter = Router();

authRouter.post("/login", authController.login);

export default authRouter;
