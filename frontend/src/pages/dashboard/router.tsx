import { RouteObject } from "react-router-dom"
import App from "."

const router: RouteObject = {
	path: "/",
	children: [{ index: true, element: <App /> }],
}
export default router
