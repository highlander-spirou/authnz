import type { Request, Response } from "express"
import HTTPHandler from "@lib/http/http-handler"
import * as TeamServices from "./team.service"
import throttleResponse from "@lib/http/throttle"

const TeamController = {
  createTeam: async (req: Request, res: Response) => {
    const { data, error } = await HTTPHandler(async () => {
      return await TeamServices.createTeam(req)
    })

    if (error) {
      return res.status(error.status).json({ message: error.message })
    }
    return throttleResponse({ res, status: 201, payload: { message: "OKAY" }, delay: 3000 })
  },
  listTeam: async (req: Request, res: Response) => {
    const { data, error } = await HTTPHandler(async () => {
      return await TeamServices.listTeam(req)
    })

    if (error) {
      return res.status(error.status).json({ message: error.message })
    }
    return res.status(201).json(data)
  },
}

export default TeamController
