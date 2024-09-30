import { createBrowserRouter } from "react-router-dom"
import App from "./App"
// import RootLayout, { loader as rootLoader } from "@pages/root/root-layout"
import loginRouter from "@pages/login/router"
import RootLayout, { loader as rootLoader } from "@pages/root/root-layout"

// import userRouter from "@user/router"

const createRouter = (): any => {
  return createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      loader: rootLoader(),
      children: [
        { index: true, element: <App /> },
        // , ...userRouter
      ],
    },
    ...loginRouter,

    // ...magicLinksRouter,
  ])
}

export default createRouter
