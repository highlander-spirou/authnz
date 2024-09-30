import { AuthException, AuthExceptionEnum } from "@auth/auth.exceptions"
import { changePasswordDTO, forgotPasswordDTO, resetPwdDTO } from "@auth/DTO"
import type { ForgotPasswordPayload } from "@auth/types"
import { sendForgotPwd } from "@lib/email/send-forgot-pwd"
import env from "@lib/env"
import { signToken, verifyToken } from "@lib/hash/jwt-token"
import { comparePwd, hashPwd } from "@lib/hash/pwd-hash"
import prisma from "@lib/prisma"
import dayjs from "dayjs"
import type { Request } from "express"
import ms from "ms"

export const changePassword = async (req: Request) => {
  const id = req.context.userId!

  const existedUser = await prisma.userBasicCred.findFirst({
    where: { id: id },
    select: { password: true },
  })

  if (!existedUser) {
    throw new AuthException(AuthExceptionEnum.AccessTokenInvalid)
  }

  const { oldPassword, newPassword } = await changePasswordDTO.parseAsync(
    req.body
  )

  const isPwdMatched = await comparePwd(oldPassword, existedUser.password)
  if (!isPwdMatched) {
    throw new AuthException(AuthExceptionEnum.PasswordNotMatch)
  }

  await prisma.userBasicCred.update({
    where: { id: id },
    data: {
      password: await hashPwd(newPassword),
    },
  })
}

export const forgotPassword = async (req: Request) => {
  const { email } = await forgotPasswordDTO.parseAsync(req.body)
  const token = signToken<ForgotPasswordPayload>(
    { email },
    ms(`${env.RESET_PASSWORD_TTL_HOURS} hours`)
  )
  const composerTz = dayjs()
  sendForgotPwd(email, composerTz, token)
}

export const resetPassword = async (req: Request) => {
  const token = req.params.token

  const payload = verifyToken<ForgotPasswordPayload>(token)
  if (!payload) {
    throw new AuthException(AuthExceptionEnum.ResetPasswordTokenInvalid)
  }
  const { password } = await resetPwdDTO.parseAsync(req.body)

  await prisma.userBasicCred.update({
    where: { email: payload.email },
    data: { password: await hashPwd(password) },
  })
}
