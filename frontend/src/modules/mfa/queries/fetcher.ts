import axios from "axios"

if (!import.meta.env.VITE_SERVER_URL) {
  throw new Error("No environment variable: SERVER_URL")
}

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL + "/mfa",
  withCredentials: true,
  headers: {
    "Content-type": "application/json",
  },
})

export const getOTPStatusRequest = async () => {
  const response = await axiosClient.get("/otp/totp-status")
  return response.data
}

export const generateOTPRequest = async () => {
  const response = await axiosClient.get("/otp/generate")
  return response.data
}

export const verifyOTPRequest = async (payload) => {
  const response = await axiosClient.post("/otp/verify", payload)
  return response.data
}
