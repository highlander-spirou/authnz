import type { Request, Response } from "express"
import HTTPHandler from "@lib/http/http-handler"
import { changeInfo, getInfo } from "./services/info"
import {
  getAllSessions,
  getDeviceInfo,
  updateDeviceLocation,
} from "./services/device-info"

const UserController = {
  getInfo: async (req: Request, res: Response) => {
    const { data, error } = await HTTPHandler(async () => {
      return await getInfo(req)
    })

    if (error) {
      return res.status(error.status).json({ message: error.message })
    }
    return res.status(200).json({ ...data })
  },
  changeInfo: async (req: Request, res: Response) => {
    const { data, error } = await HTTPHandler(async () => {
      return await changeInfo(req)
    })

    if (error) {
      return res.status(error.status).json({ message: error.message })
    }

    return res.status(200).json({ message: "OKAY" })
  },
  getDeviceInfo: async (req: Request, res: Response) => {
    const { data, error } = await HTTPHandler(async () => {
      return await getDeviceInfo(req)
    })

    if (error) {
      return res.status(error.status).json({ message: error.message })
    }

    return res.status(200).json(data)
  },
  changeDeviceLocation: async (req: Request, res: Response) => {
    const { data, error } = await HTTPHandler(async () => {
      return await updateDeviceLocation(req)
    })

    if (error) {
      return res.status(error.status).json({ message: error.message })
    }

    return res.status(200).json({ message: "OKAY" })
  },
  getAllSessions: async (req: Request, res: Response) => {
    const { data, error } = await HTTPHandler(async () => {
      return await getAllSessions(req)
    })

    if (error) {
      return res.status(error.status).json({ message: error.message })
    }

    return res.status(200).json(data)
  },
}

export default UserController
