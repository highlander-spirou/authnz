import { AuthException, AuthExceptionEnum } from "@auth/auth.exceptions"
import { generateTOTP } from "@lib/otp"
import prisma from "@lib/prisma"
import type { Request } from "express"
import QRCode from "qrcode"
import { MFAException, MFAExceptionEnum } from "../mfa.exceptions"
import * as OTPAuth from "otpauth"

import { verifyTOTPDTO } from "../mfa.dto"
import observer from "@/events"

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
    select: { otp_base32: true, otp_enabled: true },
  })

  if (existedQR?.otp_enabled) {
    throw new MFAException(MFAExceptionEnum.TOTPRegistered)
  }

  let userSecretBase32

  if (existedQR?.otp_base32) {
    userSecretBase32 = OTPAuth.Secret.fromBase32(existedQR?.otp_base32)
  } else {
    userSecretBase32 = new OTPAuth.Secret({ size: 20 })
    await prisma.otp.create({
      data: {
        user_id: userId,
        otp_base32: userSecretBase32.base32,
      },
    })
  }

  const totp = generateTOTP({ userSecretBase32, label: user.name || "user" })
  const otpauth_url = totp.toString()

  const qr = await QRCode.toDataURL(otpauth_url)

  return {
    userSecretBase32: userSecretBase32.base32,
    qrCode: qr,
  }
}

export const registerOtp = async (req: Request) => {
  const userId = req.context.userId!
  const { otp } = await verifyTOTPDTO.parseAsync(req.body)

  const [totpData, user] = await prisma.$transaction([
    prisma.otp.findFirst({
      where: { user_id: userId },
      select: { otp_base32: true, id: true, otp_enabled: true },
    }),
    prisma.userInfo.findFirst({
      where: { id: userId },
      select: { name: true },
    }),
  ])

  if (!totpData || !totpData?.otp_base32) {
    throw new MFAException(MFAExceptionEnum.OtpBase32Invalid)
  }
  if (totpData.otp_enabled) {
    throw new MFAException(MFAExceptionEnum.TOTPRegistered)
  }

  const totp = generateTOTP({
    userSecretBase32: OTPAuth.Secret.fromBase32(totpData.otp_base32),
    label: user?.name || "user",
  })

  let delta = totp.validate({ token: otp, window: 1 })

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

export const verifyOtp = async (req: Request) => {
  const userId = req.context.userId!
  const { otp } = await verifyTOTPDTO.parseAsync(req.body)

  const base32Data = await prisma.otp.findFirst({
    where: { user_id: userId },
    select: { otp_base32: true },
  })

  if (!base32Data || !base32Data?.otp_base32) {
    throw new MFAException(MFAExceptionEnum.OtpBase32Invalid)
  }

  const totp = generateTOTP({
    userSecretBase32: OTPAuth.Secret.fromBase32(base32Data.otp_base32),
    label: "user",
  })

  let delta = totp.validate({ token: otp, window: 2 })

  if (delta === null) {
    throw new MFAException(MFAExceptionEnum.TOTPInvalid)
  }

  if (delta < 0) {
    throw new MFAException(MFAExceptionEnum.TOTPTimeout)
  }

  const result = await observer.emitAsync("update_user_verify_tz", { userId })

  return result[0]
}

export const disableOTP = async (req: Request) => {
  const userId = req.context.userId!

  await prisma.otp.delete({
    where: { user_id: userId },
  })
}
