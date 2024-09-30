import { transporter } from "."

function appendLinkToContent(link: string) {
	const htmlContent = `
<h3>This is your password reset link</h3>
<p style="color: rgb(239 68 68);">Do not share this link with anyone!</p>
`
	const anchorTag = `<a href="${link}">Click here to redirect to the password reset page</a>`

	return htmlContent + anchorTag
}

export const sendResetPwd = async (clientEmail: string, token: string) => {
	const link = `${process.env.HTTP_SCHEME!}://${process.env
		.APP_DOMAIN!}/reset-password/${token}`
	const content = appendLinkToContent(link)
	await transporter.sendMail({
		from: `"Authnz App 🔒" <${process.env.APP_EMAIL!}>`, // sender address
		to: clientEmail,
		subject: "Password Reset Link", // Subject line
		html: content,
	})
}
