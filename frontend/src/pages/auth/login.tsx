import { formSerialize } from "@/lib/form-serializer";
import { loginRequest } from "./query/fetcher";
import { redirect, useActionData } from "react-router-dom";
import LoginForm from "./components/login-form";
import { AxiosError } from "axios";
import ErrorSection from "./components/error-section";
import { QueryClient } from "@tanstack/react-query";
import { getUserOption } from "@user/query/options";
import userKeys from "@user/query/queryKeyFactory";

export const action =
  (queryClient: QueryClient) =>
  async ({ request }) => {
    if (request.method !== "POST") {
      throw new Response("", { status: 405 });
    }
    try {
      const loginInfo = await formSerialize(request);
      await loginRequest(loginInfo);
      const callbackURL = new URLSearchParams(new URL(request.url).search).get(
        "callbackURL"
      );
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      location.replace(callbackURL ? callbackURL : "/");
      return true;
    } catch (error) {
      if (error instanceof AxiosError) {
        return error.response?.data;
      } else {
        return "Unknown error";
      }
    }
  };

export const loader = (queryClient: QueryClient) => async (): Promise<any> => {
  try {
    const user = await queryClient.ensureQueryData(getUserOption());
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
  const actionData = useActionData() as string | undefined;



  return (
    <>
      {actionData && <ErrorSection errors={actionData} />}
      <LoginForm />
    </>
  );
};

export default Login;
