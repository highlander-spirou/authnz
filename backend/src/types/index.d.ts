import * as express from "express"

interface ContextProps extends Record {
	userId?: number
}

declare global {
	namespace Express {
		interface Request {
			context: ContextProps
		}
	}
}
