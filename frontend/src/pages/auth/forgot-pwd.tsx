import { AxiosError } from "axios";
import { useNavigation, useRouteError } from "react-router-dom";
import ErrorSection from "./components/error-section";
import ForgotPwdForm from "./components/forgot-pwd-form";
import { formSerialize } from "@/lib/form-serializer";
import { sendResetPwd } from "./query/fetcher";
import LoadingOpaque from "@/components/loading-opaque";

export const action = async ({ request }) => {
  try {
    const requestPwdForm = await formSerialize(request);
    await sendResetPwd(requestPwdForm);
    return true;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data);
    } else {
      throw new Error("Unknown error");
    }
  }
};

const ForgotPwd = () => {
  const errors = useRouteError() as Error;

  const navigation = useNavigation();

  return (
    <>
      <LoadingOpaque isLoading={navigation.state === "submitting"}>
        <p className="mb-4 text-sm text-gray-600">
          Forgot your password? No problem. Just let us know your email address
          and we will email you a password reset link that will allow you to
          choose a new one.
        </p>
        <ErrorSection errors={errors.message} />
        <ForgotPwdForm />
      </LoadingOpaque>
    </>
  );
};

export default ForgotPwd;
