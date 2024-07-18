import { formSerialize } from "@/lib/form-serializer";
import { loginRequest } from "./query/fetcher";
import { redirect, useRouteError } from "react-router-dom";
import LoginForm from "./components/login-form";
import { AxiosError } from "axios";
import ErrorSection from "./components/error-section";
import { QueryClient } from "@tanstack/react-query";
import { getUserParams } from "@user/query/params";
import userKeys from "@user/query/queryKeyFactory";

export const action =
  (queryClient: QueryClient) =>
  async ({ request }) => {
    if (request.method !== "POST") {
      throw new Response("", { status: 405 });
    }

    const loginInfo = await formSerialize(request);
    try {
      await loginRequest(loginInfo);
      const callbackURL = new URLSearchParams(new URL(request.url).search).get(
        "callbackURL"
      );
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      location.replace(callbackURL ? callbackURL : "/");
      return null;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data.message);
      }
    }
  };

export const loader = (queryClient: QueryClient) => async (): Promise<any> => {
  try {
    const user = await queryClient.ensureQueryData(getUserParams());
    if (user) {
      return redirect("/");
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      return null;
    }
    throw new Error();
  }
};

const Login = () => {
  const errors = useRouteError() as null | AxiosError<{ message: string }>;

  return (
    <>
      <ErrorSection errors={errors} />
      <LoginForm />
    </>
  );
};

export default Login;
