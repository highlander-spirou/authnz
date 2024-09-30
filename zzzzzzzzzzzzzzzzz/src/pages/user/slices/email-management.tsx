import { useQuery } from "@tanstack/react-query"
import { UserInterface } from "../types"
import { getUserOption } from "@user/query/options"

import { CardLayout, CardName } from "@user/layouts"
import SendVerifyEmail from "./verify-email"
import UpdateEmail from "./update-email"

const EmailManagement = () => {
	const { data: user } = useQuery<UserInterface>(getUserOption())
	return (
		<>
			<CardLayout>
				<CardName
					title="Email Management"
					description="Verify your email address. Update email address"
				/>
				{!user!.email_verified_at ? (
					<SendVerifyEmail />
				) : (
					<UpdateEmail user={user!} />
				)}
			</CardLayout>
		</>
	)
}

export default EmailManagement
