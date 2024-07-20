import { RouteObject } from "react-router-dom";
import VerifyEmail, { action as verifyEmailAction } from "./verify-email";
import ResetPassword, { action as resetPwdAction } from "./reset-password";
import queryClient from "@/query-client";

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
];
export default router;
