const mfaKeys = {
  otp: {
    status: ["status"] as const,
    qrCode: ["qrCode"] as const,
    verifyOTP: ["verifyOTP"] as const,
  },
  biometric: {
    status: ["status"] as const,
    biometricRegisterOption: ["biometricRegisterOption"] as const,
    biometricCancel: ["biometricCancel"] as const,
  },
  mfaVerifyStatus: ["getMfaVerifyStatus"] as const,
}

export default mfaKeys
