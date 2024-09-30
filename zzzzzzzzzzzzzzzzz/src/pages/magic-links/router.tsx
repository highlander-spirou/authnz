import { RouteObject } from "react-router-dom"
import queryClient from "@/query-client"
import VerifyEmail, { action as verifyEmailAction } from "./verify-email"
import ResetPassword, { action as resetPwdAction } from "./reset-password"
import Logout, { loader as logoutLoader } from "./logout"

const router: RouteObject[] = [
	{
		path: "/verify-email/:token",
		element: <VerifyEmail />,
		action: verifyEmailAction(queryClient),
	},
	{
		path: "/reset-password/:token",
		element: <ResetPassword />,
		errorElement: <ResetPassword />,
		action: resetPwdAction,
	},
	{
		path: "/logout",
		element: <Logout />,
		loader: logoutLoader(queryClient),
	},
]
export default router
