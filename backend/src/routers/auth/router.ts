import { Router } from "express"
import AuthControllers from "./auth.controller"
import env from "@lib/env"
import userSessionGuard from "@middleware/user-session-guard"
import adminGuard from "@middleware/admin-guard"

const authRouter = Router()

authRouter.post(`/register-admin/${env.SIGNUP_HASH}`, AuthControllers.registerAdmin)
authRouter.post(
  "/invite-user",
  userSessionGuard,
  adminGuard,
  AuthControllers.inviteUser
)
authRouter.post("/register-user/:token", AuthControllers.registerUser)
authRouter.post("/login", AuthControllers.login)
authRouter.put(
  "/change-password",
  userSessionGuard,
  AuthControllers.changePassword
)
authRouter.post("/forgot-password", AuthControllers.forgotPassword)
authRouter.post("/reset-password/:token", AuthControllers.resetPassword)
authRouter.get("/logout", AuthControllers.logout)
authRouter.get("/logout-sessions", userSessionGuard, AuthControllers.logoutSession)

export default authRouter
