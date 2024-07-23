import type { LoginSignedToken } from "@auth/types"
import { signToken, verifyToken } from "@lib/hashes/jwt-token"
import { setAccessToken } from "@lib/http/set-cookie"
import redis from "@lib/redis"
import type { Request, Response, NextFunction } from "express"

class NeedNewAccessTokenException extends Error {}

export const userSessionGuard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const cookies = req.cookies
  const refreshToken = cookies["refresh-token"] as string | undefined
  if (!refreshToken) {
    return res.status(401).json("Unauthorized")
  }
  try {
    const accessToken = cookies["access-token"] as string | undefined
    if (!accessToken) {
      throw new NeedNewAccessTokenException()
    }
    const payload = verifyToken<LoginSignedToken>(accessToken)
    if (!payload) {
      throw new NeedNewAccessTokenException()
    }
    req.context = { userId: payload.userId }
    next()
  } catch (error) {
    if (error instanceof NeedNewAccessTokenException) {
      const userId = await redis.get(refreshToken)
      if (!userId) {
        return res.status(401).json("Unauthorized")
      }
      const newAccessToken = signToken<LoginSignedToken>({ userId: +userId })
      setAccessToken(res, newAccessToken)
      req.context = { userId: +userId }
      next()
    } else {
      return res.status(500).end()
    }
  }
}
