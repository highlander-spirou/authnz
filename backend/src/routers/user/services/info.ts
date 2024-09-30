import prisma from "@lib/prisma"
import { changeUserInfoDTO } from "@user/DTO"
import { UserException, UserExceptionEnum } from "@user/user.exceptions"
import type { Request } from "express"

export const getInfo = async (req: Request) => {
  const userId = req.context.userId!

  const userInfo = await prisma.userInfo.findFirst({
    where: { id: userId },
    select: { name: true },
  })

  if (!userInfo) {
    throw new UserException(UserExceptionEnum.UnknownError)
  }

  return userInfo
}

export const changeInfo = async (req: Request) => {
  const userId = req.context.userId!
  const { name } = await changeUserInfoDTO.parseAsync(req.body)

  await prisma.userInfo.update({
    where: { id: userId },
    data: { name: name },
  })
}
