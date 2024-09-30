import { RouteObject } from "react-router-dom"
import Login, { action, loader } from "."
import queryClient from "@/query-client"

const loginRouter: RouteObject = {
  path: "login",
  loader: loader(queryClient),
  action: action(queryClient),
  element: <Login />,
}

export default loginRouter
