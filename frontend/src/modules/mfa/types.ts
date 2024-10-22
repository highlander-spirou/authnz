export type OTPStatus = {
  status: boolean
}

export type OTPData = {
  qrCode: string
  userSecretBase32: string
}

export type BiometricStatus = {
  status: boolean
}