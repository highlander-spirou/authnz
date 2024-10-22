import prisma from "@lib/prisma"
import type { Request } from "express"
import { createTeamDTO } from "./team.dto"

export const createTeam = async (req: Request) => {
  const userId = req.context.userId!
  console.log('ashfj', req.body)
  const { name } = await createTeamDTO.parseAsync(req.body)

  await prisma.team.create({
    data: {
      owner_id: userId,
      name,
    },
  })
}

export const listTeam = async (req: Request) => {
  const userId = req.context.userId!

  return ["A Team", "B Team", "C Team", "D Team"]
}
