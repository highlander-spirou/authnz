import type { Request } from "express"
import { AuthException, AuthExceptionEnum } from "@auth/auth.exceptions"
import { inviteUserDTO, registerAdminDTO, registerUserDTO } from "@auth/auth.dto"
import { hashPwd } from "@lib/hash/pwd-hash"
import prisma from "@lib/prisma"
import { signToken, verifyToken } from "@lib/hash/jwt-token"
import env from "@lib/env"
import ms from "ms"
import type { NewUserMagicLinkPayload } from "@auth/types"
import dayjs from "dayjs"
import { sendUserInvite } from "@lib/email/send-user-invite"

export const registerAdmin = async (req: Request) => {
  const { email, password, name } = await registerAdminDTO.parseAsync(req.body)

  const existedEmail = await prisma.userBasicCred.findFirst({
    where: { email: email },
    select: { email: true },
  })
  if (existedEmail) {
    throw new AuthException(AuthExceptionEnum.DuplicateEmail)
  }
  try {
    await prisma.$transaction(async (tx) => {
      const { id: newAccountId } = await tx.userBasicCred.create({
        data: {
          email,
          password: await hashPwd(password),
        },
        select: { id: true },
      })
      const promise_1 = tx.userInfo.create({
        data: {
          id: newAccountId,
          name,
          tier: "ADMIN",
          activated: new Date(),
        },
      })

      const promise_2 = tx.otp.create({
        data: {
          user_id: newAccountId,
        },
      })

      await Promise.all([promise_1, promise_2])
    })
  } catch (error) {
    throw new AuthException(AuthExceptionEnum.UnknownError)
  }
}

export const inviteUser = async (req: Request) => {
  const { email } = await inviteUserDTO.parseAsync(req.body)
  const user = await prisma.userBasicCred.findFirst({
    where: { email: email },
    select: { id: true },
  })

  if (user) {
    throw new AuthException(AuthExceptionEnum.DuplicateEmail)
  }

  const adminId = req.context.userId!

  const inviter = await prisma.userInfo.findFirst({
    where: { id: adminId },
    select: { name: true },
  })

  const token = signToken<NewUserMagicLinkPayload>(
    { email },
    ms(`${env.INVITE_USER_TTL_HOURS} hours`)
  )
  // Magic link
  const composeTime = dayjs()
  await sendUserInvite(email, inviter!.name!, composeTime, token)

  return token
}

export const registerUser = async (req: Request) => {
  const dynamicToken = req.params.token

  const userEmail = verifyToken<NewUserMagicLinkPayload>(dynamicToken)
  if (!userEmail) {
    throw new AuthException(AuthExceptionEnum.VerifyUserTokenExpired)
  }

  const isAccountRegistered = await prisma.userBasicCred.findFirst({
    where: { email: userEmail.email },
    select: { id: true },
  })

  if (isAccountRegistered) {
    throw new AuthException(AuthExceptionEnum.DuplicateEmail)
  }

  const { password, name } = await registerUserDTO.parseAsync(req.body)

  try {
    await prisma.$transaction(async (tx) => {
      const { id: newAccountId } = await tx.userBasicCred.create({
        data: {
          email: userEmail.email,
          password: await hashPwd(password),
        },
        select: { id: true },
      })

      const promise_1 = tx.userInfo.create({
        data: {
          id: newAccountId,
          name,
          tier: "USER",
          activated: new Date(),
        },
      })

      const promise_2 = tx.otp.create({
        data: {
          user_id: newAccountId,
        },
      })

      await Promise.all([promise_1, promise_2])
    })
  } catch (error) {
    throw new AuthException(AuthExceptionEnum.UnknownError)
  }
}
