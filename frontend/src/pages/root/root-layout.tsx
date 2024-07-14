import { Outlet, redirect } from "react-router-dom";
import { addUser, userStore } from "@/store/user";
import { fetchUserInfo } from "../user/query/fetcher";

export const loader = async ({ request }): Promise<any> => {
  const { user } = userStore;
  const url = new URL(request.url);
  if (!user) {
    const userInfo = await fetchUserInfo();
    if (!userInfo) {
      return redirect(`/login?callbackURL=${url.pathname}`);
    }
    addUser(userInfo);
  }

  return user;
};

const RootLayout = () => {
  return (
    <>
      <div>Root</div>
      <Outlet />
    </>
  );
};

export default RootLayout;
