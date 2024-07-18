import { RouteObject } from "react-router-dom";
import UserInfo from "./info";

const router: RouteObject = {
  path: "user",
  children: [
    {
      path: "profile",
      element: <UserInfo />,
    },
    {
      path: "api-tokens",
      element: <UserInfo />,
    },
  ],
};
export default router;
