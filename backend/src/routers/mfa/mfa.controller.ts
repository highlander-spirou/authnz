import type { Request, Response } from "express"
import HTTPHandler from "@lib/http/http-handler"
import * as OtpServices from "./services/otp"
import * as BiometricServices from "./services/biometric"
import throttleResponse from "@lib/http/throttle"
import { getVerifyTz } from "./services"

const MfaController = {
  // #region OTP
  totpStatus: async (req: Request, res: Response) => {
    const { data, error } = await HTTPHandler(async () => {
      return await OtpServices.totpStatus(req)
    })

    if (error) {
      return res.status(error.status).json({ message: error.message })
    }
    return res.status(200).json({ status: data })
  },
  generateOTP: async (req: Request, res: Response) => {
    const { data, error } = await HTTPHandler(async () => {
      return await OtpServices.generateOTP(req)
    })

    if (error) {
      return res.status(error.status).json({ message: error.message })
    }
    return throttleResponse({
      res,
      status: 200,
      payload: { ...data },
      delay: 3000,
    })
  },
  registerOtp: async (req: Request, res: Response) => {
    const { data, error } = await HTTPHandler(async () => {
      return await OtpServices.registerOtp(req)
    })

    if (error) {
      return res.status(error.status).json({ message: error.message })
    }
    return res.status(200).json({ status: "OKAY" })
  },
  verifyOtp: async (req: Request, res: Response) => {
    const { data, error } = await HTTPHandler(async () => {
      return await OtpServices.verifyOtp(req)
    })

    if (error) {
      return res.status(error.status).json({ message: error.message })
    }
    return throttleResponse({ res, status: 200, payload: { token: data } })
  },
  disableTOTP: async (req: Request, res: Response) => {
    const { data, error } = await HTTPHandler(async () => {
      return await OtpServices.disableOTP(req)
    })

    if (error) {
      return res.status(error.status).json({ message: error.message })
    }
    return res.status(200).json({ status: "OKAY" })
  },
  // #endregion
  // #region biometrics
  getBiometricStatus: async (req: Request, res: Response) => {
    const { data, error } = await HTTPHandler(async () => {
      return await BiometricServices.getBiometricStatus(req)
    })

    if (error) {
      return res.status(error.status).json({ message: error.message })
    }
    return res.status(200).json({ status: data })
  },
  createRegisterOption: async (req: Request, res: Response) => {
    const { data, error } = await HTTPHandler(async () => {
      return await BiometricServices.createRegisterOption(req)
    })

    if (error) {
      return res.status(error.status).json({ message: error.message })
    }
    return throttleResponse({ res, status: 200, payload: { ...data } })
  },
  cancelChallenge: async (req: Request, res: Response) => {
    const { data, error } = await HTTPHandler(async () => {
      return await BiometricServices.cancelChallenge(req)
    })

    if (error) {
      return res.status(error.status).json({ message: error.message })
    }
    setTimeout(() => {
      return res.status(200).json({ message: "OKAY" })
    }, 2000)
  },
  verifyRegDevice: async (req: Request, res: Response) => {
    const { data, error } = await HTTPHandler(async () => {
      return await BiometricServices.verifyRegDevice(req)
    })

    if (error) {
      return res.status(error.status).json({ message: error.message })
    }
    return res.status(200).json({ message: "OKAY" })
  },
  createAuthOption: async (req: Request, res: Response) => {
    const { data, error } = await HTTPHandler(async () => {
      return await BiometricServices.createAuthOption(req)
    })

    if (error) {
      return res.status(error.status).json({ message: error.message })
    }
    return throttleResponse({
      res,
      status: 200,
      payload: { ...data },
      delay: 10,
    })
  },
  verifyBiometricAuth: async (req: Request, res: Response) => {
    const { data, error } = await HTTPHandler(async () => {
      return await BiometricServices.verifyBiometricAuth(req)
    })

    if (error) {
      return res.status(error.status).json({ message: error.message })
    }
    return throttleResponse({ res, status: 200, payload: { token: data } })
  },
  // #endregion
  getVerifyTz: async (req: Request, res: Response) => {
    const { data, error } = await HTTPHandler(async () => {
      return await getVerifyTz(req)
    })

    if (error) {
      return res.status(error.status).json({ message: error.message })
    }
    return throttleResponse({ res, status: 200, payload: data })
  },
}

export default MfaController
