import AuthLayout from "./layout";
import Login, { action as loginAction } from "./login";
import Register, { action as registerAction } from "./register";

const router = [
  {
    path: "/login",
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <Login />,
        errorElement: <Login />,
        action: loginAction,
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
