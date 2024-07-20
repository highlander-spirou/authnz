import { Outlet } from "react-router-dom"

const AuthLayout = () => {
	return (
		<>
			<div className="font-sans text-gray-900 antialiased">
				<div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100">
					<div className="Login-logo"></div>
					<div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg">
						<Outlet />
					</div>
				</div>
			</div>
		</>
	)
}

export default AuthLayout
