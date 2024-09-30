import env from "@lib/env"
import jwt from "jsonwebtoken"

/**
   * Sign JWT token with TTL in milliseconds
   *
   * @param ttl - Time-to-live in milliseconds.
   */
export const signToken = <T extends Record<string, any>>(payload: T, ttl: number) => {
  const token = jwt.sign(payload, env.JWT_SECRET_KEY, {
    expiresIn: `${ttl}ms`,
  })
  return token
}

export const verifyToken = <T extends Record<string, any>>(
  token: string
): T | null => {
  try {
    const payload = jwt.verify(token, env.JWT_SECRET_KEY) as T
    return payload
  } catch (error) {
    return null
  }
}
