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

export const registerRequest = async (registerInfo) => {
	const response = await axiosClient.post("/register", registerInfo)
	return response
}

export const sendVerifyEmail = async () => {
	const response = await axiosClient.get("/send-email-verify")
	return response
}

export const verifyEmail = async (token: string) => {
	const response = await axiosClient.get("/verify-email/" + token)
	return response
}

export const sendResetPwd = async (payload) => {
	const response = await axiosClient.post("/send-password-reset", payload)
	return response
}

export const resetPassword = async (token: string, payload) => {
	const response = await axiosClient.post("/reset-password/" + token, payload)
	return response
}
