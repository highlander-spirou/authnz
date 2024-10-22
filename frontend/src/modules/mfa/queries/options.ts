import mfaKeys from "./queryKeyFactories"
import * as Fetcher from "./fetcher"
import queryClient from "@/query-client"
import env from "@/lib/env"

// #region OTP
export const getOTPStatusOptions = {
  key: mfaKeys.otp.status,
  fn: Fetcher.getOTPStatusRequest,
  staleTime: env.REACT_ROUTER_STALE_TIME,
}

export const generateOTPOptions = {
  key: mfaKeys.otp.qrCode,
  fn: Fetcher.generateOTPRequest,
  staleTime: env.REACT_ROUTER_STALE_TIME,
}

export const registerOTPOption = {
  fn: Fetcher.registerOTPRequest,
  invalidates: () => {
    queryClient.invalidateQueries({ queryKey: mfaKeys.otp.status })
  },
}

export const verifyOTPOption = {
  fn: Fetcher.verifyOTPRequest,
  invalidates: () => {
    queryClient.invalidateQueries({ queryKey: mfaKeys.mfaVerifyStatus })
  },
}

export const deleteOTPOption = {
  fn: Fetcher.disableOTPRequest,
  invalidates: () => {
    queryClient.invalidateQueries({ queryKey: mfaKeys.otp.status })
  },
}
// #endregion

// #region Biometrics
export const getBiometricStatusOption = {
  key: mfaKeys.biometric.status,
  fn: Fetcher.getBiometricStatusRequest,
  staleTime: env.REACT_ROUTER_STALE_TIME,
}

export const getBiometricRegOptOption = {
  key: mfaKeys.biometric.biometricRegisterOption,
  fn: Fetcher.getBiometricRegisterOptionRequest,
  staleTime: env.REACT_ROUTER_STALE_TIME,
}

export const cancelChallengeOption = {
  key: mfaKeys.biometric.biometricCancel,
  fn: Fetcher.cancelChallengeRequest,
  staleTime: env.REACT_ROUTER_STALE_TIME,
}

export const verifyRegDeviceOption = {
  fn: Fetcher.verifyReqDeviceRequest,
}

export const getBiometricAuthOptOption = {
  fn: Fetcher.getBiometricAuthOptionRequest,
}

export const verifyBiometricAuthOption = {
  fn: Fetcher.verifyBiometricAuthRequest,
  invalidates: () => {
    queryClient.invalidateQueries({ queryKey: mfaKeys.mfaVerifyStatus })
  },
}

// #endregion

export const mfaVerifyStatusOption = {
  key: mfaKeys.mfaVerifyStatus,
  fn: Fetcher.getMfaVerifyStatus,
  staleTime: env.MFA_TOKEN_STALE_TIME,
}
