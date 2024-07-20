import { comparePwd, hashPwd } from "../../lib/hashes/pwd-hash"
import prisma from "../../lib/prisma"
import { putEmailProps } from "./dto/putEmail.DTO"
import { putInfoProps } from "./dto/putInfoDTO"
import { putPasswordProps } from "./dto/putPassword.DTO"
import { UserException, UserExceptionEnum } from "./user.exceptions"

const service = {
	getInfo: async (id: number) => {
		const user = await prisma.user.findFirst({
			where: { id: id },
			select: { email_verified_at: true, name: true, email: true },
		})
		if (!user) {
			throw new UserException(UserExceptionEnum.UserNotFoundException)
		}
		return {
			...user,
			name: !user.name ? "Anonymous" : user.name,
		}
	},
	changeProfile: async (userId: number, payload: putInfoProps) => {
		await prisma.user.update({ where: { id: userId }, data: payload })
	},
	changeEmail: async (userId: number, payload: putEmailProps) => {
		const existedUser = await prisma.user.findFirst({
			where: { id: userId },
			select: { email_verified_at: true },
		})
		if (!existedUser) {
			throw new UserException(UserExceptionEnum.UserNotFoundException)
		}
		if (!existedUser.email_verified_at) {
			throw new UserException(UserExceptionEnum.UserEmailNotVerifiedException)
		}
		await prisma.user.update({
			where: { id: userId },
			data: {
				email: payload.email,
				email_verified_at: null,
			},
		})
	},
	changePassword: async (userId: number, payload: putPasswordProps) => {
		const user = await prisma.user.findFirst({
			where: { id: userId },
			select: { password: true },
		})
		if (!user) {
			throw new UserException(UserExceptionEnum.UserNotFoundException)
		}
		if (!(await comparePwd(payload.currentPassword, user.password))) {
			throw new UserException(UserExceptionEnum.UserPwdNotMatchException)
		}
		await prisma.user.update({
			where: { id: userId },
			data: {
				password: await hashPwd(payload.newPassword),
			},
		})
	},
}

export default service
