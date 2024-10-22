import env from "@/lib/env"
import axios from "axios"

const axiosClient = axios.create({
	baseURL: env.SERVER_URL + "/user",
	withCredentials: true,
	headers: {
		"Content-type": "application/json",
	},
})


export const getInfoRequest = async () => {
	const response = await axiosClient.get("/info")
	return response.data
}

export const getDeviceLocationRequest = async () => {
	const response = await axiosClient.get("/device-info")
	return response.data
}

export const changeInfoRequest = async (changeDataInfo) => {
	const response = await axiosClient.put("/change-info", changeDataInfo)
	return response.data
}

export const changeDeviceRequest = async (payload) => {
	const response = await axiosClient.put("/change-device-location", payload)
	return response.data
}

export const getDeviceSessionRequest = async () => {
	const response = await axiosClient.get("/all-sessions")
	return response.data
}