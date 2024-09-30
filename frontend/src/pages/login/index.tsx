import { useActionData } from "react-router-dom"
import { QueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"

import { formSerialize } from "@/lib/form-serializer"
import { loginRequest } from "@auth/queries/fetcher"
import userKeys from "@user/queries/queryKeyFactories"
import { getUserInfoOptions } from "@user/queries/options"

import SigninWithGoolgeBtn from "@/components/custom-ui/signin-google-btn"
import LoginForm from "./components/login-form"
import ErrorSection from "./components/error-section"

export const action =
  (queryClient: QueryClient) =>
  async ({ request }) => {
    if (request.method !== "POST") {
      throw new Response("", { status: 405 })
    }
    try {
      const loginInfo = await formSerialize(request)
      await loginRequest(loginInfo)
      queryClient.invalidateQueries({ queryKey: userKeys.info })
      return null
    } catch (error) {
      if (error instanceof AxiosError) {
        return error.response?.data.message
      } else {
        return "Unknown error"
      }
    }
  }

export const loader =
  (queryClient: QueryClient) =>
  async ({ request }) => {
    const urlParam = new URLSearchParams(new URL(request.url).search).get(
      "callbackURL"
    )
    const callbackURL = urlParam || "/"
    try {
      const user = await queryClient.ensureQueryData({
        queryKey: getUserInfoOptions.key,
        queryFn: getUserInfoOptions.fn,
      })
      if (user) {
        location.replace(callbackURL)
      }
      return null
    } catch (error) {
      return "Unknown error"
    }
  }

const Login = () => {
  const actionData = useActionData() as string | undefined

  return (
    <>
      <div className="grid grid-cols-2 place-items-center restrict-content-grow">
        <img
          src="/background.png"
          alt="splash-art"
          className="w-full max-w-[800px] h-screen object-contain bg-slate-100"
        />
        <div className="form-wrapper w-[350px] flex flex-col items-center">
          <h1>Login</h1>
          <SigninWithGoolgeBtn />
          <div className="w-full py-5 flex items-center text-sm font-medium before:flex-1 before:border-t-[1.5px] before:border-gray-200 before:me-5 after:flex-1 after:border-t-[1.5px] after:border-gray-200 after:ms-5">
            or Login with email
          </div>
          {actionData && <ErrorSection errors={actionData} />}
          <LoginForm />
        </div>
      </div>
    </>
  )
}

export default Login
