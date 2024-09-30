import axios from "axios"

if (!import.meta.env.VITE_SERVER_URL) {
	throw new Error("No environment variable: SERVER_URL")
}

const axiosClient = axios.create({
	baseURL: import.meta.env.VITE_SERVER_URL + "/user",
	withCredentials: true,
	headers: {
		"Content-type": "application/json",
	},
})

export const fetchUserInfo = async () => {
	const response = await axiosClient.get("/info")
	return response.data
}

export const changeUserInfo = async (payload) => {
	const response = await axiosClient.put("/info", payload)
	return response.data
}

export const changeUserEmail = async (payload) => {
	const response = await axiosClient.put("/info/email", payload)
	return response.data
}

export const changeUserPwd = async (payload) => {
	const response = await axiosClient.put("/info/password", payload)
	return response.data
}
