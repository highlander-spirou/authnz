import { AuthException, AuthExceptionEnum } from "@auth/auth.exceptions"
import env from "@lib/env"
import prisma from "@lib/prisma"
import { generateRegistrationOptions } from "@simplewebauthn/server"
import type { Request } from "express"

export const createChallengeOption = async (req: Request) => {
  const userId = req.context.userId!

  const promise_1 = prisma.userBasicCred.findFirst({
    where: { id: userId },
    select: { email: true },
  })

  const promise_2 = prisma.userInfo.findFirst({
    where: { id: userId },
    select: { name: true },
  })

  const [userEmail, userName] = await Promise.all([promise_1, promise_2])

  if (!userEmail || !userName) {
    throw new AuthException(AuthExceptionEnum.EmailNotFound)
  }

  const option = await generateRegistrationOptions({
    rpName: env.APP_NAME,
    rpID: `${env.ENVIRONMENT === "dev" ? "http" : "https"}://${env.APP_DOMAIN}`,
    userID: new Uint8Array(userId),
    userName: userEmail.email,
    userDisplayName: userName.name || "Unnamed User",
    timeout: 1000 * 60 * 2,
    attestationType: "none",
    excludeCredentials: undefined,
  })

  return option
}

export const saveBiometricCred = async (req: Request) => {
  
}