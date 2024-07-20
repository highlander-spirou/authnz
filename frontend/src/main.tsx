import ReactDOM from "react-dom/client"
import { RouterProvider } from "react-router-dom"
import { QueryClientProvider } from "@tanstack/react-query"
import createRouter from "./router.tsx"
import queryClient from "./query-client.ts"
import "./index.css"

const router = createRouter()

ReactDOM.createRoot(document.getElementById("root")!).render(
	<QueryClientProvider client={queryClient}>
		<RouterProvider router={router} />
	</QueryClientProvider>
)
