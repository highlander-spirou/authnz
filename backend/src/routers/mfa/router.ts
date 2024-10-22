import { Router } from "express"
import userSessionGuard from "@middleware/user-session-guard"
import MfaController from "./mfa.controller"

const mfaRouter = Router()
mfaRouter.use(userSessionGuard)

// #region otp
mfaRouter.get("/otp/status", MfaController.totpStatus)
mfaRouter.get("/otp/generate", MfaController.generateOTP)
mfaRouter.post("/otp/register", MfaController.registerOtp)
mfaRouter.post("/otp/verify", MfaController.verifyOtp)
mfaRouter.delete("/otp/disable", MfaController.disableTOTP)
// #endregion

// #region biometrics
mfaRouter.get("/biometrics/status", MfaController.biometricStatus)
mfaRouter.get("/biometrics/register-option", MfaController.createRegisterOption)
mfaRouter.delete("/biometrics/cancel-challenge", MfaController.cancelChallenge)
mfaRouter.post("/biometrics/verify-reg-device", MfaController.verifyRegDevice)

mfaRouter.get("/biometrics/auth-option", MfaController.createAuthOption)
mfaRouter.post("/biometrics/verify-auth", MfaController.verifyBiometricAuth)
// #endregion

mfaRouter.post("/verify-tz", MfaController.getVerifyTz)



export default mfaRouter
