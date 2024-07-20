import queryClient from "@/query-client"
import { sendVerifyEmail } from "./fetcher"
import userKeys from "@user/query/queryKeyFactory"

export const sendVerifyEmailOption = () => ({
	mutationFn: () => sendVerifyEmail(),
	onSuccess: () => {
		queryClient.invalidateQueries({ queryKey: userKeys.all })
		return true
	},
})
