import axios from "axios"

if (!import.meta.env.VITE_SERVER_URL) {
  throw new Error("No environment variable: SERVER_URL")
}

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL + "/auth",
  withCredentials: true,
  headers: {
    "Content-type": "application/json",
  },
})

export const loginRequest = async (loginInfo) => {
  const response = await axiosClient.post("/login", loginInfo)
  return response
}

export const logoutRequest = async () => {
  const response = await axiosClient.get("/logout")
  return response
}

export const changePwdRequest = async (payload) => {
  const response = await axiosClient.put("/change-password", payload)
  return response
}

export const logoutSessionRequest = async () => {
  const response = await axiosClient.get("/logout-sessions")
  return response
}
