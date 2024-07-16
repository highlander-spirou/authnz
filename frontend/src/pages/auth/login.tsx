import { formSerialize } from "@/lib/form-serializer";
import { loginRequest } from "./query/fetcher";
import { redirect, useRouteError } from "react-router-dom";
import LoginForm from "./components/login-form";
import { AxiosError } from "axios";
import ErrorSection from "./components/error-section";

export const action = async ({ request }) => {
  if (request.method !== "POST") {
    throw new Response("", { status: 405 });
  }

  const loginInfo = await formSerialize(request);
  const { data, error } = await loginRequest(loginInfo);

  if (!data) {
    throw new Error(error);
  }

  const callbackURL = new URLSearchParams(new URL(request.url).search).get(
    "callbackURL"
  );

  if (!callbackURL) {
    return redirect("/");
  } else {
    return redirect(callbackURL);
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
