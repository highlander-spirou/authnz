import { Router } from "express"
import userSessionGuard from "@middleware/user-session-guard"
import UserController from "./user.controller"

const userRouter = Router()
userRouter.use(userSessionGuard)

userRouter.get("/info", UserController.getInfo)
userRouter.put("/change-info", UserController.changeInfo)

userRouter.get("/device-info", UserController.getDeviceInfo)
userRouter.put("/change-device-location", UserController.changeDeviceLocation)

userRouter.get("/all-sessions", UserController.getAllSessions)

export default userRouter
