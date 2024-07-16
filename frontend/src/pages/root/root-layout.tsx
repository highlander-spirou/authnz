import { Outlet, redirect } from "react-router-dom";
import Navbar from "./components/navbar";
import PageIndicator from "./components/page-indicator";
import { QueryClient } from "@tanstack/react-query";
import { getUserParams } from "../user/query/params";
import userKeys from "../user/query/queryKeyFactory";

export const loader =
  (queryClient: QueryClient) =>
  async ({ request }): Promise<any> => {
    const user = queryClient.getQueryData(userKeys.all);
    if (!user) {
      const userInfo = await queryClient.fetchQuery(getUserParams());
      if (!userInfo) {
        const url = new URL(request.url);
        return redirect(`/login?callbackURL=${url.pathname}`);
      }
      return userInfo;
    }

    return user;
  };

const RootLayout = () => {
  return (
    <>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <PageIndicator />
        <Outlet />
      </div>
    </>
  );
};

export default RootLayout;
