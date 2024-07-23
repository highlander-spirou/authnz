import type { Request, Response } from "express"
import HTTPHandler from "@lib/http/http-handler"
import { loginDTO, registerDTO, resetPwdDTO, sendResetPwdDTO } from "./dto"
import authService from "./auth.service"
import { sendVerifyEmail } from "@lib/email/send-verify-email"
import { sendResetPwd } from "@lib/email/send-reset-pwd"
import {
  setAccessToken,
  setBrowserToken,
  setRefreshToken,
  setSessionLogout,
} from "@lib/http/set-cookie"
import { generateToken } from "@lib/hashes/token-gen"

const authController = {
  login: async (req: Request, res: Response) => {
    const { data, error } = await HTTPHandler(async () => {
      const payload = await loginDTO.parseAsync(req.body)
      const tokens = await authService.login(payload)

      const cookie = req.cookies["browser-token"]
      if (!cookie) {
        const aj = req.get("User-Agent")
        const browserToken = generateToken()
        setBrowserToken(res, browserToken)
      }

      return tokens
    })

    if (error) {
      return res.status(error.status).json(error.message)
    }
    setRefreshToken(res, data?.refreshToken!)
    setAccessToken(res, data?.accessToken!)
    return res.status(200).json({ message: "OK" })
  },
  register: async (req: Request, res: Response) => {
    const { data, error } = await HTTPHandler(async () => {
      const { email, password, name } = await registerDTO.parseAsync(req.body)
      await authService.register(email, password, name)
    })

    if (error) {
      return res.status(error.status).json(error.message)
    }
    return res.status(200).json({ message: "OK" })
  },
  sendEmailVerify: async (req: Request, res: Response) => {
    const { data, error } = await HTTPHandler(async () => {
      const { userId } = req.context
      const { token, clientEmail } = await authService.sendEmailVerify(userId!)
      await sendVerifyEmail(clientEmail, token)
    })

    if (error) {
      return res.status(error.status).json(error.message)
    }
    return res.status(200).json({ message: "OK" })
  },
  verifyEmail: async (req: Request, res: Response) => {
    const { data, error } = await HTTPHandler(async () => {
      const { token } = req.params
      await authService.verifyEmail(token)
    })

    if (error) {
      return res.status(error.status).json(error.message)
    }
    return res.status(200).json({ message: "OK" })
  },
  sendResetPwd: async (req: Request, res: Response) => {
    const { data, error } = await HTTPHandler(async () => {
      const { email } = await sendResetPwdDTO.parseAsync(req.body)
      const token = await authService.sendResetPwd(email)
      await sendResetPwd(email, token)
    })

    if (error) {
      return res.status(error.status).json(error.message)
    }
    return res.status(200).json({ message: "OK" })
  },
  resetPwd: async (req: Request, res: Response) => {
    const { data, error } = await HTTPHandler(async () => {
      const { token } = req.params
      const { password } = await resetPwdDTO.parseAsync(req.body)
      await authService.resetPassword(token, password)
    })
    if (error) {
      return res.status(error.status).json(error.message)
    }
    return res.status(200).json({ message: "OK" })
  },
  logout: async (_req: Request, res: Response) => {
    setSessionLogout(res)
    return res.status(200).json("Logout!")
  },
}

export default authController
