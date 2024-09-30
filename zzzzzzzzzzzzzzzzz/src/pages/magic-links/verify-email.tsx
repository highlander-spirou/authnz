import { verifyEmail } from "@auth/query/fetcher"
import { QueryClient } from "@tanstack/react-query"
import userKeys from "@user/query/queryKeyFactory"
import { AxiosError } from "axios"
import { Form, Link, redirect } from "react-router-dom"

export const action =
	(queryClient: QueryClient) =>
	async ({ params }) => {
		const { token } = params
		try {
			await verifyEmail(token)
			queryClient.invalidateQueries({ queryKey: userKeys.all })
			return redirect("/user/profile")
		} catch (error) {
			if (error instanceof AxiosError) {
				throw new Error(error.response?.data.message)
			}
		}
	}

const VerifyEmail = () => {
	return (
		<>
			<div className="w-full h-screen bg-gray-100">
				<nav className="nav-bar">
					<div className="nav-bar-restrict-grow">
						<Link to="/" className="logo-wrapper h-16">
							<svg
								viewBox="0 0 48 48"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								className="block h-9 w-auto"
							>
								<path
									d="M11.395 44.428C4.557 40.198 0 32.632 0 24 0 10.745 10.745 0 24 0a23.891 23.891 0 0113.997 4.502c-.2 17.907-11.097 33.245-26.602 39.926z"
									fill="#6875F5"
								></path>
								<path
									d="M14.134 45.885A23.914 23.914 0 0024 48c13.255 0 24-10.745 24-24 0-3.516-.756-6.856-2.115-9.866-4.659 15.143-16.608 27.092-31.75 31.751z"
									fill="#6875F5"
								></path>
							</svg>
						</Link>
					</div>
				</nav>
				<div className="w-full mt-40 flex flex-col justify-center items-center gap-5">
					<h1 className="font-semibold text-3xl text-center">
						This is the email verification page
					</h1>
					<Form method="POST" action="">
						<button
							type="submit"
							className="w-44 h-16 bg-sky-600 font-bold text-white rounded-lg"
						>
							Click here to verify
						</button>
					</Form>
				</div>
			</div>
		</>
	)
}

export default VerifyEmail
