import { formSerialize } from "@/lib/form-serializer"
import { loginRequest } from "./query/fetcher"
import { Link, redirect, useActionData } from "react-router-dom"
import LoginForm from "./components/login-form"
import { AxiosError } from "axios"
import ErrorSection from "./components/error-section"
import { QueryClient } from "@tanstack/react-query"
import { getUserOption } from "@user/query/options"
import userKeys from "@user/query/queryKeyFactory"

export const action =
	(queryClient: QueryClient) =>
	async ({ request }) => {
		if (request.method !== "POST") {
			throw new Response("", { status: 405 })
		}
		try {
			const loginInfo = await formSerialize(request)
			await loginRequest(loginInfo)
			const callbackURL = new URLSearchParams(new URL(request.url).search).get(
				"callbackURL"
			)
			queryClient.invalidateQueries({ queryKey: userKeys.all })
			// location.replace(callbackURL ? callbackURL : "/")
			return false
		} catch (error) {
			if (error instanceof AxiosError) {
				return error.response?.data
			} else {
				return "Unknown error"
			}
		}
	}

export const loader = (queryClient: QueryClient) => async (): Promise<any> => {
	// try {
	// 	const user = await queryClient.ensureQueryData(getUserOption())
	// 	if (user) {
	// 		return redirect("/")
	// 	}
	// } catch (error) {
	// 	if (error instanceof AxiosError) {
	// 		return null
	// 	}
	// 	throw new Error()
	// }
	return null
}

const Login = () => {
	const actionData = useActionData() as string | undefined

	return (
		<>
			<div className="grid sm:grid-cols-2">
				<div className="splash-art hidden sm:inline-flex justify-end">
					<img
						src="/wallpaper.jpg"
						alt="image"
						className="w-full max-w-[800px] h-screen"
					/>
				</div>
				<div className="h-screen flex justify-center items-center">
					<div className="form-wrapper w-[350px]">
						<h1 className="font-titillium text-3xl font-bold text-gray-700 mb-5">
							Login
						</h1>
						<button
							type="button"
							className="py-2.5 px-3 w-full inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
						>
							<svg
								className="shrink-0 size-4"
								viewBox="0 0 33 32"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<g clipPath="url(#clip0_4132_5805adfqfqdq121)">
									<path
										d="M32.2566 16.36C32.2566 15.04 32.1567 14.08 31.9171 13.08H16.9166V19.02H25.7251C25.5454 20.5 24.5866 22.72 22.4494 24.22L22.4294 24.42L27.1633 28.1L27.4828 28.14C30.5189 25.34 32.2566 21.22 32.2566 16.36Z"
										fill="#4285F4"
									></path>
									<path
										d="M16.9166 32C21.231 32 24.8463 30.58 27.5028 28.12L22.4694 24.2C21.1111 25.14 19.3135 25.8 16.9366 25.8C12.7021 25.8 9.12677 23 7.84844 19.16L7.66867 19.18L2.71513 23L2.65521 23.18C5.2718 28.4 10.6648 32 16.9166 32Z"
										fill="#34A853"
									></path>
									<path
										d="M7.82845 19.16C7.48889 18.16 7.28915 17.1 7.28915 16C7.28915 14.9 7.48889 13.84 7.80848 12.84V12.62L2.81499 8.73999L2.6552 8.81999C1.55663 10.98 0.937439 13.42 0.937439 16C0.937439 18.58 1.55663 21.02 2.63522 23.18L7.82845 19.16Z"
										fill="#FBBC05"
									></path>
									<path
										d="M16.9166 6.18C19.9127 6.18 21.9501 7.48 23.0886 8.56L27.6027 4.16C24.8263 1.58 21.231 0 16.9166 0C10.6648 0 5.27181 3.6 2.63525 8.82L7.80851 12.84C9.10681 8.98 12.6821 6.18 16.9166 6.18Z"
										fill="#EB4335"
									></path>
								</g>
								<defs>
									<clipPath id="clip0_4132_5805adfqfqdq121">
										<rect
											width="32"
											height="32"
											fill="white"
											transform="translate(0.937439)"
										></rect>
									</clipPath>
								</defs>
							</svg>
							Sign in with Google
						</button>
						<div className="py-5 flex items-center text-sm text-gray-600 font-medium before:flex-1 before:border-t-[1.5px] before:border-gray-200 before:me-5 after:flex-1 after:border-t-[1.5px] after:border-gray-200 after:ms-5">
							or Login with email
						</div>
						{actionData && <ErrorSection errors={actionData} />}
						<LoginForm />
						<p className="mt-4 text-sm text-gray-600">
							Don't have an account?{" "}
							<Link to="/register" className="btn-link font-semibold ms-1">
								Register here
							</Link>
						</p>
					</div>
				</div>
			</div>
		</>
	)
}

export default Login
