import { createRoot } from "react-dom/client"
import createRouter from "./router.tsx"
import { QueryClientProvider } from "@tanstack/react-query"
import { RouterProvider } from "react-router-dom"
import "./index.css"
import queryClient from "./query-client.ts"

const router = createRouter()

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
  </QueryClientProvider>
)
