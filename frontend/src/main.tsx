import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import createRouter from "./router";
import './index.css'

const router = createRouter();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
