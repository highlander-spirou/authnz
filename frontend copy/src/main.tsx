import { createRoot } from "react-dom/client"
import createRouter from "./router.tsx"
import { QueryClientProvider } from "@tanstack/react-query"
import queryClient from "./query-client.ts"
import { RouterProvider } from "react-router-dom"
import "./index.css"

const router = createRouter()

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
  </QueryClientProvider>
)
