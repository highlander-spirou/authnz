import queryClient from "@/query-client";
import AuthLayout from "./layout";
import Login, { action as loginAction, loader as loginLoader } from "./login";
import Register, { action as registerAction } from "./register";
import { RouteObject } from "react-router-dom";

const router: RouteObject[] = [
  {
    path: "/login",
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <Login />,
        errorElement: <Login />,
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
];
export default router;
