import { AuthException, AuthExceptionEnum } from "@auth/auth.exceptions"
import type { AccessTokenPayload } from "@auth/types"
import env from "@lib/env"
import { generateRandomToken } from "@lib/hash/gen-token"
import { signToken, verifyToken } from "@lib/hash/jwt-token"
import HTTPHandler from "@lib/http/http-handler"
import { setAccessToken, setRefreshToken } from "@lib/http/set-cookie"
import prisma from "@lib/prisma"
import dayjs from "dayjs"
import type { Request, Response, NextFunction } from "express"
import ms from "ms"

class AccessTokenDecryptFails extends Error { }

const userSessionGuard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { data, error } = await HTTPHandler(async () => {
    const accessToken = req.cookies["access-token"] as string | undefined
    const refreshToken = req.cookies["refresh-token"] as string | undefined

    if (!refreshToken) {
      throw new AuthException(AuthExceptionEnum.RefreshTokenExpired)
    }

    try {
      if (accessToken) {
        const payload = verifyToken<AccessTokenPayload>(accessToken)
        if (!payload) {
          throw new AccessTokenDecryptFails()
        }
        req.context = { userId: payload.id, sessionId: payload.sessionId }
      } else {
        throw new AccessTokenDecryptFails()
      }
    } catch (error) {
      if (error instanceof AccessTokenDecryptFails) {
        const token = await prisma.loginSession.findFirst({
          where: { refresh_token: refreshToken },
          select: {
            user_id: true,
            expired: true,
            id: true,
            refresh_token: true,
          },
        })
        if (!token) {
          throw new AuthException(AuthExceptionEnum.RefreshTokenExpired)
        }
        let temp_refresh_token = token.refresh_token
        /* If refresh token about to expired, swap refresh-token */
        if (dayjs(token.expired).diff(dayjs(), "days") < 30) {
          temp_refresh_token = generateRandomToken()
          setRefreshToken(res, temp_refresh_token)
        }

        /* Update browser activity upon granting new access token */
        await prisma.loginSession.update({
          where: { id: token.id },
          data: {
            refresh_token: temp_refresh_token,
          },
        })

        /* Grant new access-token and continue granting the request */
        const ttl = ms(`${env.ACCESS_TOKEN_TTL_HOUR} minutes`)
        const newAccessToken = signToken<AccessTokenPayload>(
          { id: token.user_id, sessionId: token.id },
          ttl
        )
        setAccessToken(res, newAccessToken)
        req.context = { userId: token.user_id, sessionId: token.id }
      } else {
        throw new AuthException(AuthExceptionEnum.UnknownError)
      }
    }
  })

  if (!error) {
    next()
  } else {
    return res.status(error.status).json({ message: error.message })
  }
}
export default userSessionGuard
