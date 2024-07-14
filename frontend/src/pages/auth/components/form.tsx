import {
  Form as RHForm,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, useSubmit } from "react-router-dom";
import { z } from "zod";

const LoginForm = () => {

  const submit = useSubmit();

  const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8, "Password must contains at least 8 characters"),
    remember: z.boolean().default(false).optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    submit(values, { method: "POST", action: "" });
    form.resetField("password")
  };
  return (
    <>
      <RHForm {...form}>
        <Form onSubmit={form.handleSubmit(onSubmit)}>
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
              name="remember"
              render={({ field }) => (
                <FormItem className="block mt-4">
                  <FormControl>
                    <label htmlFor="remember" className="flex items-center">
                      <input
                        type="checkbox"
                        id="remember"
                        name="remember"
                        className="w-4 h-4 text-indigo-500 bg-white border-gray-300 rounded focus:ring-1"
                      />
                      <span className="ms-2 text-sm text-gray-600">
                        Remember Me
                      </span>
                    </label>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="submit-section">
            <a
              href=""
              className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
            >
              Forgot password?
            </a>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 disabled:opacity-50 transition ease-in-out duration-150 ms-4"
            >
              Log in
            </button>
          </div>
        </Form>
      </RHForm>
    </>
  );
};

export default LoginForm;

/*

  <Form method="POST">
              <div className="email-inp">
                <label
                  htmlFor="email"
                  className="block font-medium text-sm text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-input mt-1 w-full rounded-md shadow-sm border-gray-300"
                />
              </div>
              <div className="pwd-inp mt-4">
                <label
                  htmlFor="password"
                  className="block font-medium text-sm text-gray-700"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="form-input mt-1 w-full rounded-md shadow-sm border-gray-300"
                />
              </div>
              <div className="remember-me block mt-4">
                <label htmlFor="remember_me" className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember_me"
                    name="remember_me"
                    className="w-4 h-4 text-indigo-500 bg-gray-100 border-gray-300 rounded focus:ring-1"
                  />
                  <span className="ms-2 text-sm text-gray-600">
                    Remember Me
                  </span>
                </label>
              </div>
              <div className="submit-section flex items-center justify-end mt-4">
                <a
                  href=""
                  className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
                >
                  Forgot password?
                </a>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 disabled:opacity-50 transition ease-in-out duration-150 ms-4"
                >
                  Log in
                </button>
              </div>
            </Form>
*/
