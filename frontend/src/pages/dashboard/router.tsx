import App from ".";

const router = {
  path: "/dashboard",
  children: [
    { index: true, element: <App /> },
  ],
};
export default router;
