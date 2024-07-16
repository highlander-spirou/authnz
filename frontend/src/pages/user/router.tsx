import UserInfo from "./info";

const router = {
  path: "user",
  children: [
    {
      path: "profile",
      element: <UserInfo />,
    },
  ],
};
export default router;
