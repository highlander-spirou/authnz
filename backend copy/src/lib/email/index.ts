import { env } from "@lib/env"
import nodemailer from "nodemailer"

export const transporter = nodemailer.createTransport({
	host: "sandbox.smtp.mailtrap.io",
	port: 2525,
	auth: {
		user: env.MAILTRAP_USER,
		pass: env.MAILTRAP_PWD,
	},
})
