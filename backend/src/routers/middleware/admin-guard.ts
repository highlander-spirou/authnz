import prisma, { RoleEnum } from "@lib/prisma"
import type { Request, Response, NextFunction } from "express"

const adminGuard = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.context.userId
  const isAdmin = await prisma.userInfo.findFirst({
    where: { id: id },
    select: { tier: true },
  })

  if (isAdmin && isAdmin.tier === RoleEnum.ADMIN) {
    next()
  } else {
    return res.status(401).json({ message: "Unauthorized" })
  }
}

export default adminGuard
