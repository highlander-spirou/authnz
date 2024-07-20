import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form, useActionData, useSubmit } from "react-router-dom";
import {
  Form as RHForm,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useEffect, useState } from "react";

const ForgotPwdForm = () => {
  const submit = useSubmit();

  const formSchema = z.object({
    email: z.string().email(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    submit(values, { method: "POST", action: "" });
  };

  const [statusText, setStatusText] = useState<string>("");
  const isSendingSuccess = useActionData() as boolean;

  useEffect(() => {
    if (isSendingSuccess) {
      setStatusText("A new reset password link has been sent to your inbox");
      form.reset()
    }
  }, [isSendingSuccess]);

  return (
    <>
      <RHForm {...form}>
        <Form onSubmit={form.handleSubmit(onSubmit)} method="POST" action="">
          <div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="input-label">Email</FormLabel>
                  <FormControl>
                    <input {...field} className="form-input-normal" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {!!isSendingSuccess && (
            <p className="user-status-success my-5">{statusText}</p>
          )}
          <div className="auth-submit-section">
            <button type="submit" className="btn-black ms-2">
              Send
            </button>
          </div>
        </Form>
      </RHForm>
    </>
  );
};

export default ForgotPwdForm;
