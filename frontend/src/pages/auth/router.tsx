import queryClient from "@/query-client";
import AuthLayout from "./layout";
import Login, { action as loginAction, loader as loginLoader } from "./login";
import Register, { action as registerAction } from "./register";
import { RouteObject } from "react-router-dom";
import ForgotPwd, { action as forgotPwdAction } from "./forgot-pwd";

const router: RouteObject[] = [
  {
    path: "/login",
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <Login />,
        loader: loginLoader(queryClient),
        action: loginAction(queryClient),
      },
    ],
  },
  {
    path: "/register",
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <Register />,
        errorElement: <Register />,
        action: registerAction,
      },
    ],
  },
  {
    path: "/forgot-password",
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <ForgotPwd />,
        errorElement: <ForgotPwd />,
        action: forgotPwdAction,
      },
    ],
  },
];
export default router;
