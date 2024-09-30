import prisma from "@lib/prisma"
import { AuthException, AuthExceptionEnum } from "./auth.exceptions"
import { comparePwd, hashPwd } from "@lib/hashes/pwd-hash"
import { signToken } from "@lib/hashes/jwt-token"
import type { LoginSignedToken } from "./types"
import { generateToken } from "@lib/hashes/token-gen"
import { addTime } from "@lib/datetime"
import dayjs from "dayjs"
import { loginDTO, type loginDTOProps } from "./dto/loginDTO"
import redis from "@lib/redis"
import type { Request } from "express"

const service = {
  login: async (req: Request) => {
    const { email, password } = await loginDTO.parseAsync(req.body)

    const existedEmail = await prisma.user.findFirst({
      where: { email: email },
      select: { password: true, id: true },
    })
    if (!existedEmail) {
      throw new AuthException(AuthExceptionEnum.EmailNotFoundException)
    }
    const isPwdMatched = await comparePwd(password, existedEmail.password)
    if (!isPwdMatched) {
      throw new AuthException(AuthExceptionEnum.PasswordNotMatchException)
    }
    const accessToken = signToken<LoginSignedToken>({
      userId: existedEmail.id,
    })
    const refreshToken = generateToken()

    const browserToken = req.cookies["browser-token"]
      ? (req.cookies["browser-token"] as string)
      : generateToken()

    prisma.browserSessions.upsert({
      where: {
        browser_token: browserToken,
      },
      update: {
        session_token: refreshToken,
        last_login: dayjs().unix(),
      },
      create: {
        browser_token: browserToken,
        session_token: refreshToken,
        user_agent: req.get("User-Agent") ? req.get("User-Agent")! : "",
        last_login: dayjs().unix(),
        userId: existedEmail.id,
      },
    })

    redis.set(refreshToken, "" + existedEmail.id)

    return { accessToken, refreshToken }
  },
  register: async (email: string, password: string, username?: string) => {
    const existedEmail = await prisma.user.findFirst({
      where: { email: email },
      select: { id: true },
    })
    if (existedEmail) {
      throw new AuthException(AuthExceptionEnum.DuplicateRegisterEmailException)
    }
    await prisma.user.create({
      data: {
        email,
        password: await hashPwd(password),
        name: !username ? null : username,
      },
    })
  },
  sendEmailVerify: async (userId: number) => {
    const data = await prisma.user.findFirst({
      where: { id: userId },
      select: {
        email_verified_at: true,
        email: true,

        email_verification: {
          select: { expired_at: true, request_penalty: true, retries: true },
        },
      },
    })

    if (!data || data.email_verified_at !== null) {
      throw new AuthException(AuthExceptionEnum.EmailAlreadyVerifiedException)
    }

    if (!data.email_verification) {
      const token = generateToken()
      const expiredAt = addTime(
        +process.env.EMAIL_VERIFY_EXPIRED_HOUR!,
        "hours"
      )
      await prisma.emailVerification.create({
        data: {
          userId,
          token,
          expired_at: expiredAt.toDate(),
          retries: 0,
        },
      })
      return { token, clientEmail: data.email }
    } else {
      const { request_penalty, retries } = data.email_verification
      if (request_penalty && dayjs().isBefore(request_penalty)) {
        throw new AuthException(
          AuthExceptionEnum.EmailVerificationRequestMaxException
        )
      }
      if (retries === +process.env.MAX_VERIFY_EMAIL_RETRIES!) {
        await prisma.emailVerification.update({
          where: { userId: userId },
          data: {
            request_penalty: addTime(
              +process.env.MAX_VERIFY_EMAIL_PENALTY_HOUR!,
              "hours"
            ).toDate(),
            retries: 0,
          },
        })
        throw new AuthException(
          AuthExceptionEnum.EmailVerificationRequestMaxException
        )
      } else {
        const token = generateToken()
        const expiredAt = addTime(
          +process.env.EMAIL_VERIFY_EXPIRED_HOUR!,
          "hours"
        )
        await prisma.emailVerification.update({
          where: { userId: userId },
          data: {
            retries: { increment: 1 },
            expired_at: expiredAt.toDate(),
            token,
          },
        })
        return { token, clientEmail: data.email }
      }
    }
  },
  verifyEmail: async (token: string) => {
    const data = await prisma.emailVerification.findFirst({
      where: { token: token },
      select: { id: true, expired_at: true, userId: true },
    })

    if (!data) {
      throw new AuthException(
        AuthExceptionEnum.EmailVerificationNotFoundException
      )
    }

    const { id, expired_at, userId } = data

    if (dayjs().isAfter(expired_at)) {
      throw new AuthException(
        AuthExceptionEnum.EmailVerificationExpiredException
      )
    }
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { email_verified_at: dayjs().toDate() },
      }),
      prisma.emailVerification.delete({ where: { id: id } }),
    ])
  },
  sendResetPwd: async (email: string) => {
    const data = await prisma.user.findFirst({
      where: { email: email },
      select: { id: true, email_verified_at: true, password_reset_token: true },
    })

    if (!data) {
      throw new AuthException(AuthExceptionEnum.EmailNotFoundException)
    }

    if (!data.email_verified_at) {
      throw new AuthException(AuthExceptionEnum.UserEmailNotVerifiedException)
    }

    if (!data.password_reset_token) {
      const token = generateToken()
      const expiredAt = addTime(
        +process.env.PASSWORD_RESET_EXPIRED_HOUR!,
        "hours"
      )
      await prisma.passwordResetToken.create({
        data: {
          token,
          retries: 0,
          expired_at: expiredAt.toDate(),
          userId: data.id,
        },
      })
      return token
    } else {
      const { request_penalty, retries } = data.password_reset_token
      if (request_penalty && dayjs().isBefore(request_penalty)) {
        throw new AuthException(AuthExceptionEnum.PasswordRequestMaxException)
      }
      if (retries === +process.env.MAX_PASSWORD_RETRIES!) {
        await prisma.passwordResetToken.update({
          where: { id: data.password_reset_token.id },
          data: {
            request_penalty: addTime(
              +process.env.MAX_PASSWORD_RETRIES_PENALTY_HOUR!,
              "hours"
            ).toDate(),
            retries: 0,
          },
        })
        throw new AuthException(AuthExceptionEnum.PasswordRequestMaxException)
      } else {
        const token = generateToken()
        const expiredAt = addTime(
          +process.env.PASSWORD_RESET_EXPIRED_HOUR!,
          "hours"
        )
        await prisma.passwordResetToken.update({
          where: { id: data.password_reset_token.id },
          data: {
            retries: { increment: 1 },
            expired_at: expiredAt.toDate(),
            token,
          },
        })
        return token
      }
    }
  },
  resetPassword: async (token: string, newPassword: string) => {
    const data = await prisma.passwordResetToken.findFirst({
      where: { token: token },
      select: { id: true, expired_at: true, userId: true },
    })
    if (!data) {
      throw new AuthException(
        AuthExceptionEnum.PasswordRequestNotFoundException
      )
    }
    const { id, expired_at, userId } = data
    if (dayjs().isAfter(expired_at)) {
      throw new AuthException(AuthExceptionEnum.PasswordRequestExpiredException)
    }
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { password: await hashPwd(newPassword) },
      }),
      prisma.passwordResetToken.delete({ where: { id: id } }),
    ])
  },
}

export default service
