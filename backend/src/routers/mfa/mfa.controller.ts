import type { Request, Response } from "express"
import HTTPHandler from "@lib/http/http-handler"
import { generateOTP, totpStatus, verifyTOTP } from "./services/otp"
import { createChallengeOption } from "./services/biometric"

const MfaController = {
  // #region OTP
  generateOTP: async (req: Request, res: Response) => {
    const { data, error } = await HTTPHandler(async () => {
      return await generateOTP(req)
    })

    if (error) {
      return res.status(error.status).json({ message: error.message })
    }
    return res.status(200).json({ ...data })
  },
  totpStatus: async (req: Request, res: Response) => {
    const { data, error } = await HTTPHandler(async () => {
      return await totpStatus(req)
    })

    if (error) {
      return res.status(error.status).json({ message: error.message })
    }
    return res.status(200).json({ status: data })
  },
  verifyTOTP: async (req: Request, res: Response) => {
    const { data, error } = await HTTPHandler(async () => {
      return await verifyTOTP(req)
    })

    if (error) {
      return res.status(error.status).json({ message: error.message })
    }
    return res.status(200).json({ status: "OKAY" })
  },
  // #endregion
  // #region biometrics
  createChallengeOption: async (req: Request, res: Response) => {
    const { data, error } = await HTTPHandler(async () => {
      return await createChallengeOption(req)
    })

    if (error) {
      return res.status(error.status).json({ message: error.message })
    }
    return res.status(200).json({ ...data })
  },
  // #endregion
}

export default MfaController
