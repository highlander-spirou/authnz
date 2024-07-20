import InputWithLoading from "@/components/custom-ui/input-with-loading";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { CardForm, CardMainLayout } from "@user/layouts";
import { updateEmailOption } from "@user/query/options";
import { UserInterface } from "@user/types";
import { useEffect, useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
});

type schemaType = z.infer<typeof schema>;

type UpdateEmailFormFieldsProps = {
  form: UseFormReturn<schemaType>;
  status: {
    isPending: boolean;
  };
};

const UpdateEmailFormFields: React.FC<UpdateEmailFormFieldsProps> = ({
  form,
  status,
}) => {
  return (
    <>
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem className="form-item">
            <FormLabel className="input-label">Change email address</FormLabel>
            <FormControl>
              <div>
                <InputWithLoading isLoading={status.isPending} {...field} />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

const UpdateEmail = ({ user }: { user: UserInterface }) => {
  const [statusText, setStatusText] = useState<string>("");
  const { isError, isSuccess, isPending, status, reset, mutate } = useMutation(
    updateEmailOption()
  );

  const form = useForm<schemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: user.email,
    },
  });

  const onSubmit = async (values: schemaType) => {
    mutate(values);
  };

  useEffect(() => {
    if (status === "error") {
      setStatusText("Error while updating your email!");
    } else if (status === "success") {
      setStatusText("Email changed");
    } else {
      setStatusText("");
    }
  }, [status]);

  return (
    <>
      <CardMainLayout>
        <h2 className="flex gap-3 items-center text-green-600 text-sm mb-5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            className="w-5 h-5 fill-green-600"
            viewBox="0 0 16 16"
          >
            <path d="M2 2a2 2 0 0 0-2 2v8.01A2 2 0 0 0 2 14h5.5a.5.5 0 0 0 0-1H2a1 1 0 0 1-.966-.741l5.64-3.471L8 9.583l7-4.2V8.5a.5.5 0 0 0 1 0V4a2 2 0 0 0-2-2zm3.708 6.208L1 11.105V5.383zM1 4.217V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v.217l-7 4.2z" />
            <path d="M16 12.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0m-1.993-1.679a.5.5 0 0 0-.686.172l-1.17 1.95-.547-.547a.5.5 0 0 0-.708.708l.774.773a.75.75 0 0 0 1.174-.144l1.335-2.226a.5.5 0 0 0-.172-.686" />
          </svg>
          Your email is verified.
        </h2>
        <CardForm
          form={form}
          onSubmit={onSubmit}
          status={{ isPending, isError, isSuccess }}
          statusText={statusText}
          reset={reset}
        >
          <UpdateEmailFormFields form={form} status={{ isPending }} />
        </CardForm>
      </CardMainLayout>
    </>
  );
};

export default UpdateEmail;
