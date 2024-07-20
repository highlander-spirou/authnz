import { redirect, useRouteError } from "react-router-dom"
import { AxiosError } from "axios"
import { formSerialize } from "@/lib/form-serializer"
import RegisterForm from "./components/register-form"
import { registerRequest } from "./query/fetcher"
import ErrorSection from "./components/error-section"

export const action = async ({ request }) => {
	if (request.method !== "POST") {
		throw new Response("", { status: 405 })
	}
	try {
		const registerInfo = await formSerialize(request)
		await registerRequest(registerInfo)
		return redirect("/login")
	} catch (error) {
		if (error instanceof AxiosError) {
			throw new Error(error.response?.data)
		}
	}
}
const Register = () => {
	const errors = useRouteError() as Error

	return (
		<>
			{errors && <ErrorSection errors={errors.message} />}
			<RegisterForm />
		</>
	)
}

export default Register
