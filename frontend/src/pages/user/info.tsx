import CardDivider from "./components/card-divider"
import UpdateName from "./slices/update-name"
import EmailManagement from "./slices/email-management"
import ChangePassword from "./slices/change-password"

const UserInfo = () => {
	return (
		<>
			<main className="max-w-7xl mx-auto sm:py-10 sm:px-6 lg:px-8">
				<EmailManagement />
				<CardDivider />
				<UpdateName />
				<CardDivider />
				<ChangePassword />
			</main>
		</>
	)
}

export default UserInfo
