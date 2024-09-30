import { randomBytes } from "crypto"

export const generateRandomToken = () => {
  return randomBytes(16).toString("hex")
}