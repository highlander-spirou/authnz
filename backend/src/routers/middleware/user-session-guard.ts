import type { LoginSignedToken } from "@auth/types"
import { verifyToken } from "@lib/hashes/jwt-token"
import type { Request, Response, NextFunction } from "express"

export const userSessionGuard = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const cookies = req.cookies
	const userSession = cookies["user-session"]
	if (!userSession) {
		return res.status(403).json("Unauthorized")
	}
	const payload = verifyToken<LoginSignedToken>(userSession)
	if (!payload) {
		return res.status(401).json("Unauthorized")
	}
	req.context = { userId: payload.userId }
	next()
}
