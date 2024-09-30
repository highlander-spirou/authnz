import prisma from "@lib/prisma"
import type { Request } from "express"

export const createTeam = async (req: Request) => {
  const userId = req.context.userId!

  await prisma.team.create({
    data: {
      owner_id: userId,
    },
  })
}
