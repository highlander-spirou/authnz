const mfaKeys = {
  otp: {
    status: ["status"] as const,
    OTPData: ["OTPData"] as const,
    verifyOTP: ["verifyOTP"] as const,
  },
  biometric: {
    biometricStatus: ["biometricStatus"] as const,
    biometricRegisterOption: ["biometricRegisterOption"] as const,
    biometricAuthOption: ["biometricAuthOption"] as const,
    biometricCancel: ["biometricCancel"] as const,
    biometricVerifyDeviceData: ["biometricVerifyDeviceData"] as const,
    biometricVerifyAuth: ["biometricVerifyAuth"] as const,
  },
  mfaVerifyStatus: ["getMfaVerifyStatus"] as const,
}

export default mfaKeys
