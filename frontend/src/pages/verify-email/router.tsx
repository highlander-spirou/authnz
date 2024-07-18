import { RouteObject } from "react-router-dom";
import VerifyEmail, { action as verifyEmailAction } from ".";
import queryClient from "@/query-client";

const router: RouteObject = {
  path: "/verify-email/:token",
  element: <VerifyEmail />,
  action: verifyEmailAction(queryClient),
};
export default router;
