import { env } from "@lib/env"
import jwt from "jsonwebtoken"

export const signToken = <T extends Record<string, any>>(payload: T) => {
	const ttl = env.ACCESS_TOKEN_TTL_MINUTE
	const token = jwt.sign(payload, env.JWT_SECRET_KEY, {
		expiresIn: `${ttl}m`,
	})
	return token
}

export const verifyToken = <T extends Record<any, any>>(
	token: string
): T | null => {
	try {
		const payload = jwt.verify(token, env.JWT_SECRET_KEY) as T
		return payload
	} catch (error) {
		return null
	}
}
