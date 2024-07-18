import {
  Form as RHForm,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, Link, useSubmit } from "react-router-dom";
import { z } from "zod";

const RegisterForm = () => {
  const submit = useSubmit();

  const formSchema = z
    .object({
      email: z.string().email(),
      password: z
        .string()
        .min(8, "Password must contains at least 8 characters"),
      name: z.string().optional(),
      passwordConfirm: z.string(),
    })
    .refine((data) => data.password === data.passwordConfirm, {
      message: "Passwords don't match",
      path: ["passwordConfirm"],
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      passwordConfirm: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const submitValue = {
      email: values.email,
      password: values.password,
      ...(values.name && { name: values.name }),
    };
    
    submit(submitValue, { method: "POST", action: "" });
    form.reset();
  };
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
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormLabel className="input-label">Password</FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      type="password"
                      className="form-input-normal"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="passwordConfirm"
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormLabel className="input-label">
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      type="password"
                      className="form-input-normal"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormLabel className="input-label">Name</FormLabel>
                  <FormDescription className="text-xs italic">
                    Field is optional
                  </FormDescription>
                  <FormControl>
                    <input
                      {...field}
                      type="password"
                      className="form-input-normal"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="auth-submit-section">
            <Link to="/login" className="btn-link">
              Already registered?
            </Link>
            <button type="submit" className="btn-black ms-2">
              Register
            </button>
          </div>
        </Form>
      </RHForm>
    </>
  );
};

export default RegisterForm;
