import App from ".";

const router = {
  path: "/",
  children: [
    { index: true, element: <App /> },
  ],
};
export default router;
