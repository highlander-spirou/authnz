import { logout } from "@auth/query/fetcher"
import { QueryClient } from "@tanstack/react-query"
import userKeys from "@user/query/queryKeyFactory"

export const loader = (queryClient: QueryClient) => async () => {
	try {
		await logout()
		queryClient.invalidateQueries({ queryKey: userKeys.all })
    location.replace("/login")
		return null
	} catch (error) {
		throw new Error("Network Error")
	}
}

const Logout = () => {
	return <></>
}

export default Logout
