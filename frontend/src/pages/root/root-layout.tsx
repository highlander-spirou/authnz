import { Outlet, redirect } from "react-router-dom"
import Navbar from "./components/navbar"
import PageIndicator from "./components/page-indicator"
import { QueryClient } from "@tanstack/react-query"
import { getUserOption } from "../user/query/options"
import userKeys from "../user/query/queryKeyFactory"
import { AxiosError } from "axios"

export const loader =
	(queryClient: QueryClient) =>
	async ({ request }): Promise<any> => {
		const user = queryClient.getQueryData(userKeys.all)
		if (user) {
			return user
		}
		try {
			const userInfo = await queryClient.fetchQuery(getUserOption())
			return userInfo
		} catch (error) {
			if (error instanceof AxiosError) {
				const url = new URL(request.url)
				return redirect(`/login?callbackURL=${url.pathname}`)
			} else {
				throw new Error("Unknown error")
			}
		}
	}

const RootLayout = () => {
	return (
		<>
			<div className="min-h-screen bg-gray-100">
				<Navbar />
				<PageIndicator />
				<Outlet />
			</div>
		</>
	)
}

export default RootLayout
