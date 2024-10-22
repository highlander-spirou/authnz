import observer from "@/events"
import { AuthException, AuthExceptionEnum } from "@auth/auth.exceptions"
import env from "@lib/env"
import prisma from "@lib/prisma"
import { MFAException, MFAExceptionEnum } from "@mfa/mfa.exceptions"
import type { Prisma } from "@prisma/client"
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from "@simplewebauthn/server"
import type { Request } from "express"

export const getBiometricStatus = async (req: Request) => {
  const userId = req.context.userId!
  const sessionId = req.context.sessionId!
  const data = await prisma.biometric.count({
    where: {
      AND: [
        { user_id: userId },
        {
          authenticator: {
            path: "$[*]",
            array_contains: { sessionId: sessionId },
          },
        },
      ],
    },
  })
  return data > 0
}

export const createRegisterOption = async (req: Request) => {
  const userId = req.context.userId!
  const sessionId = req.context.sessionId!

  const [userEmail, userName] = await prisma.$transaction([
    prisma.userBasicCred.findFirst({
      where: { id: userId },
      select: { email: true },
    }),
    prisma.userInfo.findFirst({
      where: { id: userId },
      select: { name: true },
    }),
  ])

  if (!userEmail || !userName) {
    throw new AuthException(AuthExceptionEnum.EmailNotFound)
  }

  const [usedChallengeCount, registeredBiometric] = await prisma.$transaction([
    // Filter for existing current challenge
    prisma.biometric.count({
      where: {
        AND: [{ user_id: userId }, { current_challenge: { not: null } }],
      },
    }),
    // Filter for past registration biometrics
    prisma.biometric.count({
      where: {
        AND: [
          { user_id: userId },
          {
            authenticator: {
              path: "$[*]",
              array_contains: { sessionId: sessionId },
            },
          },
        ],
      },
    }),
  ])

  if (usedChallengeCount > 0) {
    throw new MFAException(MFAExceptionEnum.ChallengeConflicted)
  }

  if (registeredBiometric > 0) {
    throw new MFAException(MFAExceptionEnum.SessionRegistered)
  }

  const option = await generateRegistrationOptions({
    rpName: env.APP_NAME,
    rpID: `${env.ENVIRONMENT === "dev" ? "localhost" : env.APP_DOMAIN}`,
    userID: new Uint8Array(userId),
    userName: userEmail.email,
    userDisplayName: userName.name || "Unnamed User",
    timeout: 1000 * 60 * 2,
    attestationType: "none",
    excludeCredentials: undefined,
  })

  await prisma.biometric.upsert({
    where: { user_id: userId },
    update: { current_challenge: option.challenge },
    create: {
      user_id: userId,
      current_challenge: option.challenge,
    },
  })

  return option
}

export const cancelChallenge = async (req: Request) => {
  const userId = req.context.userId!

  await prisma.biometric.update({
    where: { user_id: userId },
    data: { current_challenge: null },
  })
}

export const verifyRegDevice = async (req: Request) => {
  const { payload } = req.body
  const userId = req.context.userId!
  const sessionId = req.context.sessionId!

  const currentChallenge = await prisma.biometric.findFirst({
    where: { user_id: userId },
    select: { current_challenge: true, id: true, authenticator: true },
  })

  if (!currentChallenge || !currentChallenge.current_challenge) {
    throw new MFAException(MFAExceptionEnum.ChallengeConflicted)
  }

  const verificationResult = await verifyRegistrationResponse({
    response: payload,
    expectedChallenge: currentChallenge?.current_challenge,
    expectedOrigin: `${env.ENVIRONMENT === "dev" ? "http" : "htpps"}://${
      env.APP_DOMAIN
    }`,
    expectedRPID: `${env.ENVIRONMENT === "dev" ? "localhost" : env.APP_DOMAIN}`,
  })

  if (!verificationResult.verified || !verificationResult.registrationInfo) {
    await prisma.biometric.update({
      where: { user_id: userId },
      data: { current_challenge: null },
    })
    throw new MFAException(MFAExceptionEnum.RegisterBiometricFails)
  }

  const { counter, credentialID, credentialPublicKey } =
    verificationResult.registrationInfo

  const biometricData = {
    sessionId,
    counter,
    credentialID,
    credentialPublicKey: Array.from(credentialPublicKey),
  } as Prisma.JsonObject

  const authenticators = currentChallenge.authenticator as Prisma.JsonArray

  const authenticatorData = currentChallenge.authenticator
    ? [...authenticators, biometricData]
    : [biometricData]

  await prisma.biometric.update({
    where: { id: currentChallenge.id },
    data: {
      current_challenge: null,
      authenticator: authenticatorData,
    },
  })
}

export const createAuthOption = async (req: Request) => {
  const userId = req.context.userId!

  const data = await prisma.biometric.findFirst({
    where: { user_id: userId },
    select: { authenticator: true },
  })

  if (!data || !data.authenticator) {
    throw new MFAException(MFAExceptionEnum.ProvideChallengeFail)
  }

  const authenticators = data.authenticator as Prisma.JsonArray

  const option = await generateAuthenticationOptions({
    rpID: `${env.ENVIRONMENT === "dev" ? "localhost" : env.APP_DOMAIN}`,
    userVerification: "preferred",
    timeout: 60 * 1000 * 5,
    allowCredentials: authenticators.map((x) => ({
      type: "public-key",
      id: x!["credentialID"],
    })),
  })

  await prisma.biometric.update({
    where: { user_id: userId },
    data: { current_challenge: option.challenge },
  })

  return option
}

export const verifyBiometricAuth = async (req: Request) => {
  const userId = req.context.userId!
  const { payload } = req.body

  const authenticator = await prisma.biometric.findFirst({
    where: {
      AND: [
        { user_id: userId },
        {
          authenticator: {
            path: "$[*]",
            array_contains: { credentialID: payload.id },
          },
        },
      ],
    },
  })

  if (!authenticator || !authenticator.current_challenge) {
    throw new MFAException(MFAExceptionEnum.BiometricAuthFail)
  }

  const authenticatorDTO = authenticator.authenticator as Prisma.JsonArray
  const matchedAuthenticator = authenticatorDTO.find(
    (x) => x!["credentialID"] === payload.id
  ) as any

  const assertionResult = await verifyAuthenticationResponse({
    response: payload,
    expectedChallenge: authenticator.current_challenge,
    expectedOrigin: `${env.ENVIRONMENT === "dev" ? "http" : "htpps"}://${
      env.APP_DOMAIN
    }`,
    expectedRPID: `${env.ENVIRONMENT === "dev" ? "localhost" : env.APP_DOMAIN}`,
    authenticator: matchedAuthenticator,
  })

  if (!assertionResult.verified) {
    throw new MFAException(MFAExceptionEnum.BiometricAuthFail)
  }

  const result = await observer.emitAsync("update_user_verify_tz", { userId })

  return result[0]
}
