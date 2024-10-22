import { QueryClient } from "@tanstack/react-query"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retryDelay: (attemptIndex) => Math.min(5000 * 2 ** attemptIndex, 30000),
    },
  },
})

export default queryClient
