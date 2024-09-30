import { AuthException, AuthExceptionEnum } from "@auth/auth.exceptions"
import { generateTOTP } from "@lib/otp"
import prisma from "@lib/prisma"
import type { Request } from "express"
import QRCode from "qrcode"
import { MFAException, MFAExceptionEnum } from "../mfa.exceptions"
import * as OTPAuth from "otpauth"

import { verifyTOTPDTO } from "../DTO"

export const generateOTP = async (req: Request) => {
  const userId = req.context.userId!

  const user = await prisma.userInfo.findFirst({
    where: { id: userId },
    select: { name: true },
  })

  if (!user) {
    throw new AuthException(AuthExceptionEnum.AccessTokenInvalid)
  }

  const existedQR = await prisma.otp.findFirst({
    where: { user_id: userId },
    select: { otp_base32: true },
  })

  const userSecretBase32 = existedQR?.otp_base32
    ? OTPAuth.Secret.fromBase32(existedQR?.otp_base32)
    : new OTPAuth.Secret({ size: 20 })

  const totp = generateTOTP({ userSecretBase32, label: user.name || "user" })

  const otpauth_url = totp.toString()

  await prisma.otp.update({
    where: { user_id: userId },
    data: {
      otp_base32: userSecretBase32.base32,
    },
  })

  const qr = await QRCode.toDataURL(otpauth_url)
  return {
    userSecretBase32: userSecretBase32.base32,
    qrCode: qr,
  }
}

export const totpStatus = async (req: Request) => {
  const userId = req.context.userId!

  const data = await prisma.otp.findFirst({
    where: { user_id: userId },
    select: { otp_enabled: true },
  })

  if (data) {
    return data.otp_enabled
  }
  return false
}

export const verifyTOTP = async (req: Request) => {
  const userId = req.context.userId!
  const { otp } = await verifyTOTPDTO.parseAsync(req.body)

  const promise_1 = prisma.otp.findFirst({
    where: { user_id: userId },
    select: { otp_base32: true, id: true, otp_enabled: true },
  })

  const promise_2 = prisma.userInfo.findFirst({
    where: { id: userId },
    select: { name: true },
  })

  const [totpData, user] = await Promise.all([promise_1, promise_2])

  if (!totpData || !totpData?.otp_base32) {
    throw new MFAException(MFAExceptionEnum.TOTPInvalid)
  }
  if (totpData.otp_enabled) {
    throw new MFAException(MFAExceptionEnum.TOTPRegistered)
  }

  const totp = generateTOTP({
    userSecretBase32: OTPAuth.Secret.fromBase32(totpData.otp_base32),
    label: user?.name || "user",
  })

  let delta = totp.validate({ token: otp, window: 1 })
  console.log("code", totp.generate())
  console.log("otp", otp)
  console.log("delta", delta)

  if (delta === null) {
    throw new MFAException(MFAExceptionEnum.TOTPInvalid)
  }

  if (delta < 0) {
    throw new MFAException(MFAExceptionEnum.TOTPTimeout)
  }

  await prisma.otp.update({
    where: { id: totpData.id },
    data: {
      otp_enabled: true,
    },
  })
}
