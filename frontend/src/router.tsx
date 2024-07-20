import { createBrowserRouter } from "react-router-dom"
import ErrorPage from "./pages/root/error-page"
import loginRouter from "./pages/auth/router"
import dashboardRouter from "./pages/dashboard/router"
import RootLayout, { loader as rootLoader } from "./pages/root/root-layout"
import userRouter from "./pages/user/router"
import queryClient from "./query-client"
import magicLinksRouter from "./pages/magic-links/router"

const createRouter = (): any => {
	return createBrowserRouter([
		{
			path: "/",
			errorElement: <ErrorPage />,
			element: <RootLayout />,
			loader: rootLoader(queryClient),
			children: [dashboardRouter, userRouter],
		},
		...loginRouter,
		...magicLinksRouter,
	])
}

export default createRouter
