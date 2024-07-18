import { Router } from "express";
import userController from "./user.controllers";
import { userSessionGuard } from "../../middlewares/user-session-guard";

const userRouter = Router();

userRouter.use(userSessionGuard);

userRouter.get("/info", userController.getInfo);
userRouter.put("/info", userController.changeInfo);
userRouter.put("/info/email", userController.changeEmail);

export default userRouter;
