import { createBrowserRouter } from "react-router-dom"

import RootLayout, { loader as rootLoader } from "@pages/root/root-layout"
import IndexPage from "@pages/index"
import loginRouter from "@pages/login/router"
import settingsRouter from "@pages/settings/router"
import queryClient from "./query-client"
import TestPage from "@pages/test"
import teamRouter from "@pages/team/router"

const createRouter = () => {
  return createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      loader: rootLoader(queryClient),
      children: [
        { index: true, element: <IndexPage /> },
        settingsRouter,
        {
          path: "/test",
          element: <TestPage />,
        },
        teamRouter,
      ],
    },
    loginRouter,
  ])
}

export default createRouter
