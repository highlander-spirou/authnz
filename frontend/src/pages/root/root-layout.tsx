import { AxiosError } from "axios"
import { Outlet, redirect } from "react-router-dom"
import { getUserInfoOptions } from "@user/queries/options"
import Navbar from "./components/navbar"
import { Toaster } from "@/components/ui/sonner"
import { QueryClient } from "@tanstack/react-query"

export const loader =
  (queryClient: QueryClient) =>
  async ({ request }) => {
    try {
      const userInfo = await queryClient.ensureQueryData({
        queryKey: getUserInfoOptions.key,
        queryFn: getUserInfoOptions.fn,
      })
      return userInfo
    } catch (error) {
      if (error instanceof AxiosError) {
        const url = new URL(request.url)
        return redirect(`/login?callbackURL=${url.pathname}`)
      } else {
        throw new Error("Unknown error")
      }
    }
  }

const RootLayout = () => {
  return (
    <>
      <div className="relative min-h-screen">
        <Navbar />
        <Outlet />
        <Toaster />
      </div>
    </>
  )
}

export default RootLayout
