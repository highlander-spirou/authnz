import type { Request, Response } from "express"
import prisma from "@lib/prisma"
import { comparePwd } from "@lib/hash/pwd-hash"
import { generateRandomToken } from "@lib/hash/gen-token"
import redis from "@lib/redis"
import env from "@lib/env"
import {
  invalidateToken,
  setAccessToken,
  setRefreshToken,
} from "@lib/http/set-cookie"
import { loginDTO } from "@auth/DTO"
import { AuthException, AuthExceptionEnum } from "@auth/auth.exceptions"
import { getBrowserInfo } from "@lib/http/browser-info"
import ms from "ms"
import { signToken } from "@lib/hash/jwt-token"
import type { AccessTokenPayload } from "@auth/types"
import dayjs from "dayjs"

export const login = async (req: Request, res: Response) => {
  const refreshToken = req.cookies["refresh-token"] as string | undefined
  if (refreshToken) {
    const token = await prisma.loginSession.findFirst({
      where: { refresh_token: refreshToken },
      select: { id: true },
    })
    if (token) {
      return "EXISTED"
    } else {
      invalidateToken(res, "refresh")
      invalidateToken(res, "access")
      throw new AuthException(AuthExceptionEnum.RefreshTokenExpired)
    }
  }

  const { email, password } = await loginDTO.parseAsync(req.body)

  const existedEmail = await prisma.userBasicCred.findUnique({
    where: { email: email },
    select: { id: true, email: true, password: true },
  })

  if (!existedEmail) {
    throw new AuthException(AuthExceptionEnum.EmailNotFound)
  }
  const isPwdMatched = await comparePwd(password, existedEmail.password)

  if (!isPwdMatched) {
    throw new AuthException(AuthExceptionEnum.PasswordNotMatch)
  }

  /* Create Refresh token */
  const newRefreshToken = generateRandomToken()
  await prisma.loginSession.create({
    data: {
      refresh_token: newRefreshToken,
      user_id: existedEmail.id,
      browser_info: getBrowserInfo(req),
      expired: dayjs().add(env.REFRESH_TOKEN_TTL_DAY, "days").toDate(),
    },
  })
  setRefreshToken(res, newRefreshToken)

  /* Create access token */
  const ttl = ms(`${env.ACCESS_TOKEN_TTL_HOUR} hours`)
  const accessToken = signToken<AccessTokenPayload>(
    { id: existedEmail.id },
    ttl
  )
  setAccessToken(res, accessToken)

  return "OKAY"
}

export const logout = async (req: Request, res: Response) => {
  const refreshToken = req.cookies["refresh-token"] as string | undefined

  if (!refreshToken) {
    throw new AuthException(AuthExceptionEnum.RefreshTokenExpired)
  }

  await prisma.loginSession.delete({ where: { refresh_token: refreshToken } })
  invalidateToken(res, "refresh")
  invalidateToken(res, "access")
}

export const logoutSessions = async (req: Request) => {
  const refreshToken = req.cookies["refresh-token"] as string | undefined

  if (!refreshToken) {
    throw new AuthException(AuthExceptionEnum.RefreshTokenExpired)
  }

  const { userId } = req.context

  const allTokens = await prisma.loginSession.findMany({
    where: {
      AND: [{ refresh_token: { not: refreshToken } }, { user_id: userId }],
    },
    select: { id: true },
  })

  await prisma.loginSession.deleteMany({
    where: { id: { in: allTokens.map((x) => x.id) } },
  })
}
