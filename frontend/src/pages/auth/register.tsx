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
  const { data, error } = await registerRequest(registerInfo);

  if (!data) {
    console.log("fasjkf", error);
    throw new Error(error);
  }
  return redirect("/login");
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
