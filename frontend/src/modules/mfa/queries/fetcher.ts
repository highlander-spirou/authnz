import env from "@/lib/env"
import axios from "axios"


const axiosClient = axios.create({
  baseURL: env.SERVER_URL + "/mfa",
  withCredentials: true,
  headers: {
    "Content-type": "application/json",
  },
})

// #region OTP
export const getOTPStatusRequest = async () => {
  const response = await axiosClient.get("/otp/status")
  return response.data
}

export const generateOTPRequest = async () => {
  const response = await axiosClient.get("/otp/generate")
  return response.data
}

export const registerOTPRequest = async (payload) => {
  const response = await axiosClient.post("/otp/register", payload)
  return response.data
}

export const verifyOTPRequest = async (payload) => {
  const response = await axiosClient.post("/otp/verify", payload)
  return response.data
}

export const disableOTPRequest = async () => {
  const response = await axiosClient.delete("/otp/disable")
  return response.data
}
// #endregion

// #region Biometrics
export const getBiometricStatusRequest = async () => {
  const response = await axiosClient.get("/biometrics/status")
  return response.data
}

export const getBiometricRegisterOptionRequest = async () => {
  const response = await axiosClient.get("/biometrics/register-option")
  return response.data
}

export const cancelChallengeRequest = async () => {
  const response = await axiosClient.delete("/biometrics/cancel-challenge")
  return response.data
}

export const verifyReqDeviceRequest = async (payload) => {
  const response = await axiosClient.post("/biometrics/verify-reg-device", {
    payload: payload,
  })
  return response.data
}

export const getBiometricAuthOptionRequest = async () => {
  const response = await axiosClient.get("/biometrics/auth-option")
  return response.data
}

export const verifyBiometricAuthRequest = async (payoad) => {
  const response = await axiosClient.post("/biometrics/verify-auth", payoad)
  return response.data
}
// #endregion

export const getMfaVerifyStatus = async (token: string) => {
  const response = await axiosClient.post("/verify-tz", { token: token })
  return response.data
}
