import jwt from "jsonwebtoken"

export const signToken = <T extends Record<string, any>>(payload: T) => {
	const ttl = +process.env.DEFAULT_TTL! as number
	const token = jwt.sign(payload, process.env.JWT_SECRET_KEY!, {
		expiresIn: `${ttl}h`,
	})
	return token
}

export const verifyToken = <T extends Record<any, any>>(
	token: string
): T | null => {
	try {
		const payload = jwt.verify(token, process.env.JWT_SECRET_KEY!) as T
		return payload
	} catch (error) {
		return null
	}
}
