import type { Request, Response } from "express"
import userService from "./users.service"
import { putEmailDTO, putInfoDTO, putPasswordDTO } from "./dto"
import HTTPHandler from "../../http-handler"

const userController = {
	getInfo: async (req: Request, res: Response) => {
		const { data, error } = await HTTPHandler(async () => {
			const { userId } = req.context
			const userInfo = await userService.getInfo(userId)
			return userInfo
		})
		if (error) {
			return res.status(error.status).json(error.message)
		}
		return res.json(data)
	},
	changeInfo: async (req: Request, res: Response) => {
		const { data, error } = await HTTPHandler(async () => {
			const { userId } = req.context
			const payload = await putInfoDTO.parseAsync(req.body)
			await userService.changeProfile(userId, payload)
		})
		if (error) {
			return res.status(error.status).json(error.message)
		}
		return res.status(200).json({ message: "OK" })
	},
	changeEmail: async (req: Request, res: Response) => {
		const { data, error } = await HTTPHandler(async () => {
			const { userId } = req.context
			const payload = await putEmailDTO.parseAsync(req.body)
			await userService.changeEmail(userId, payload)
		})
		if (error) {
			return res.status(error.status).json(error.message)
		}
		return res.status(200).json({ message: "OK" })
	},
	changePassword: async (req: Request, res: Response) => {
		const { data, error } = await HTTPHandler(async () => {
			const { userId } = req.context
			const payload = await putPasswordDTO.parseAsync(req.body)
			await userService.changePassword(userId, payload)
		})
		if (error) {
			return res.status(error.status).json(error.message)
		}
		return res.status(200).json({ message: "OK" })
	},
}

export default userController
