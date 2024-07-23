import { env } from "@lib/env"
import type { Response } from "express"
import ms from "ms"

export const setRefreshToken = (res: Response, refreshToken: string) => {
  res.cookie("refresh-token", refreshToken, {
    maxAge: ms(`${env.REFRESH_TOKEN_TTL_DAY} days`),
    httpOnly: true,
  })
}

export const setAccessToken = (res: Response, accessToken: string) => {
  res.cookie("access-token", accessToken, {
    maxAge: ms(`${env.ACCESS_TOKEN_TTL_MINUTE} minutes`),
    httpOnly: true,
  })
}

export const setSessionLogout = (res: Response) => {
  res.cookie("access-token", "", {
    maxAge: 0,
    httpOnly: true,
  })
  res.cookie("refresh-token", "", {
    maxAge: 0,
    httpOnly: true,
  })
}

export const setBrowserToken = (res: Response, browserToken: string) => {
  res.cookie("browser-token", browserToken)
}
