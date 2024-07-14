import { formSerialize } from "@/lib/form-serializer";
import { loginRequest } from "./query/fetcher";
import { redirect, useRouteError } from "react-router-dom";
import { cn } from "@/lib/utils";
import { AxiosError } from "axios";
import LoginForm from "./components/form";

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
      <div className="font-sans text-gray-900 antialiased">
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100">
          <div className="Login-logo"></div>
          <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg">
            <div
              className={cn(!errors ? "hidden" : "block", "error-section mb-4")}
            >
              <p className="big-error font-medium text-red-600">
                Whoops! Something went wrong.
              </p>
              <ul className="mt-3 list-disc list-inside text-sm text-red-600">
                <li>{errors && errors.message}</li>
              </ul>
            </div>
            <LoginForm />
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
