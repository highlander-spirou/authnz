import { formSerialize } from "@/lib/form-serializer";
import RegisterForm from "./components/register-form";
import { registerRequest } from "./query/fetcher";
import { redirect, useRouteError } from "react-router-dom";
import { AxiosError } from "axios";
import ErrorSection from "./components/error-section";

export const action = async ({ request }) => {
  if (request.method !== "POST") {
    throw new Response("", { status: 405 });
  }

  const registerInfo = await formSerialize(request);
  
  try {
    await registerRequest(registerInfo);
    return redirect("/login");
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message);
    }
  }
};
const Register = () => {
  const errors = useRouteError() as null | AxiosError<{ message: string }>;

  return (
    <>
      <ErrorSection errors={errors} />
      <RegisterForm />
    </>
  );
};

export default Register;
