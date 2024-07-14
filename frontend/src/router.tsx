import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "./pages/root/error-page";
import loginRouter from "./pages/auth/router";
import dashboardRouter from "./pages/dashboard/router";
import RootLayout, { loader as rootLoader } from "./pages/root/root-layout";

const createRouter = (): any => {
  return createBrowserRouter([
    {
      path: "/",
      errorElement: <ErrorPage />,
      element: <RootLayout />,
      loader: rootLoader,
      children: [dashboardRouter],
    },
    ...loginRouter,
  ]);
};

export default createRouter;
