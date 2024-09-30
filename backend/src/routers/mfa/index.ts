import { Router } from "express"
import userSessionGuard from "@middleware/user-session-guard"
import MfaController from "./mfa.controller"

const mfaRouter = Router()
mfaRouter.use(userSessionGuard)

mfaRouter.get("/otp/generate", MfaController.generateOTP)
mfaRouter.post("/otp/verify", MfaController.verifyTOTP)
mfaRouter.get("/otp/totp-status", MfaController.totpStatus)

mfaRouter.get("/biometrics/get-challenge-option", MfaController.createChallengeOption)


export default mfaRouter
