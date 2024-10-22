import HTTPHandler from "@lib/http/http-handler"
import prisma from "@lib/prisma"
import dayjs from "dayjs"
import type { Request, Response, NextFunction } from "express"
import { z } from "zod"

const mfaGuard = async (req: Request, res: Response, next: NextFunction) => {
  const schema = z.object({
    mfaToken: z
      .string()
      .regex(
        /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/
      ),
  })

  const { data, error } = await HTTPHandler(async () => {
    const { mfaToken } = await schema.parseAsync(req.body)
    const isTokenValid = await prisma.mfaVerifyStatus.findFirst({
      where: { uuid: mfaToken },
      select: { uuid_ttl: true },
    })
    if (isTokenValid && dayjs().isBefore(dayjs(isTokenValid.uuid_ttl))) {
      return true
    } else {
      throw new Error("")
    }
  })

  if (error) {
    return res.status(401).json({ message: "Unauthorized, Multi-factor Authentication requires" })
  }
  next()
}

export default mfaGuard
