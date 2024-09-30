import env from "@lib/env"
import type { Response } from "express"
import ms from "ms"

export const setRefreshToken = (res: Response, refreshToken: string) => {
  res.cookie("refresh-token", refreshToken, {
    maxAge: ms(`50 years`), // Simulate a very very long time in the future
    httpOnly: true,
  })
}

export const setAccessToken = (res: Response, accessToken: string) => {
  res.cookie("access-token", accessToken, {
    maxAge: ms(`${env.ACCESS_TOKEN_TTL_HOUR} hours`),
    httpOnly: true,
  })
}

export const invalidateToken = (
  res: Response,
  tokenType: "refresh" | "access"
) => {
  if (tokenType === "access") {
    res.cookie("access-token", "", {
      maxAge: 0,
      httpOnly: true,
    })
  } else {
    res.cookie("refresh-token", "", {
      maxAge: 0,
      httpOnly: true,
    })
  }
}
