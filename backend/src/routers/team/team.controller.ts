import type { Request, Response } from "express"
import HTTPHandler from "@lib/http/http-handler"
import { createTeam } from "./team.service"

const TeamController = {
  createTeam: async (req: Request, res: Response) => {
    const { data, error } = await HTTPHandler(async () => {
      return await createTeam(req)
    })

    if (error) {
      return res.status(error.status).json({ message: error.message })
    }
    return res.status(201).json({ message: "OKAY" })
  },
}

export default TeamController
