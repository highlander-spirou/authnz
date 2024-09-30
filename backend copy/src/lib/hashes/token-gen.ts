import * as crypto from "node:crypto"

export const generateToken = () => {
	return crypto.randomBytes(16).toString("hex")
}
