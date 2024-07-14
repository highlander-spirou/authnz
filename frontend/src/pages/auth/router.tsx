import Login, { action as loginAction } from "./login";
import { action as verifyEmailAction } from "./verify-email";

const router = [
  {
    path: "/login",
    element: <Login />,
    errorElement: <Login />,
    action: loginAction,
  },
  { path: "/verify-email", action: verifyEmailAction },
];
export default router;
