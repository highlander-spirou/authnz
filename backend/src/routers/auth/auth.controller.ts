import type { Request, Response } from "express"
import HTTPHandler from "@lib/http/http-handler"
import { inviteUser, registerAdmin, registerUser } from "./services/new-account"
import { login, logout, logoutSessions } from "./services/login"
import {
  changePassword,
  forgotPassword,
  resetPassword,
} from "./services/password"

const AuthControllers = {
  login: async (req: Request, res: Response) => {
    const { data, error } = await HTTPHandler(async () => {
      return await login(req, res)
    })

    if (error) {
      return res.status(error.status).json({ message: error.message })
    }

    return res.status(200).json({
      message:
        data === "OKAY"
          ? data
          : "Login session existed, this request does nothing",
    })
  },
  registerAdmin: async (req: Request, res: Response) => {
    const { error } = await HTTPHandler(async () => {
      await registerAdmin(req)
    })

    if (error) {
      return res.status(error.status).json({ message: error.message })
    }

    return res.status(201).json({ message: "Admin registered successfully." })
  },
  logout: async (req: Request, res: Response) => {
    const { data, error } = await HTTPHandler(async () => {
      await logout(req, res)
    })

    if (error) {
      return res.status(error.status).json({ message: error.message })
    }

    return res.status(200).json({ message: "Log out" })
  },
  logoutSession: async (req: Request, res: Response) => {
    const { data, error } = await HTTPHandler(async () => {
      await logoutSessions(req)
    })

    if (error) {
      return res.status(error.status).json({ message: error.message })
    }

    return res
      .status(200)
      .json({ message: "All sessions (except this browser) has been log out" })
  },
  inviteUser: async (req: Request, res: Response) => {
    const { data, error } = await HTTPHandler(async () => {
      return await inviteUser(req)
    })

    if (error) {
      return res.status(error.status).json({ message: error.message })
    }

    return res.status(200).json({ message: data })
  },
  registerUser: async (req: Request, res: Response) => {
    const { data, error } = await HTTPHandler(async () => {
      return await registerUser(req)
    })

    if (error) {
      return res.status(error.status).json({ message: error.message })
    }

    return res.status(201).json({ message: "OKAY" })
  },
  changePassword: async (req: Request, res: Response) => {
    const { data, error } = await HTTPHandler(async () => {
      return await changePassword(req)
    })

    if (error) {
      return res.status(error.status).json({ message: error.message })
    }

    return res.status(200).json({ message: "OKAY" })
  },
  forgotPassword: async (req: Request, res: Response) => {
    const { data, error } = await HTTPHandler(async () => {
      return await forgotPassword(req)
    })

    if (error) {
      return res.status(error.status).json({ message: error.message })
    }

    return res.status(200).json({ message: "OKAY" })
  },
  resetPassword: async (req: Request, res: Response) => {
    const { data, error } = await HTTPHandler(async () => {
      return await resetPassword(req)
    })

    if (error) {
      return res.status(error.status).json({ message: error.message })
    }

    return res.status(200).json({ message: "OKAY" })
  },
}

export default AuthControllers
