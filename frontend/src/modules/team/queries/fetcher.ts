import env from "@/lib/env"
import axios from "axios"

const axiosClient = axios.create({
	baseURL: env.SERVER_URL + "/team",
	withCredentials: true,
	headers: {
		"Content-type": "application/json",
	},
})


export const createTeamRequest = async (payload) => {
	const response = await axiosClient.post("/create-team", payload)
	return response.data
}
