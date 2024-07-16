import { z } from "zod";
import CardForm from "../components/card-form";
import CardLayout from "../components/card-layout";
import CardName from "../components/card-name";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import React, { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { updateUserParams } from "../query/params";
import queryClient from "@/query-client";
import userKeys from "../query/queryKeyFactory";
import { UserInterface } from "../types";
import { SvgSpinners } from "@/components/loading-svg";
import { cn } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(1, "Name must contain at least 1 character(s)"),
});

type schemaType = z.infer<typeof schema>;

type UpdateNameFormFieldsProps = {
  form: UseFormReturn<schemaType>;
  status: {
    isPending: boolean;
  };
};

const UpdateNameFormFields: React.FC<UpdateNameFormFieldsProps> = ({
  form,
  status,
}) => {
  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem className="form-item">
            <FormLabel className="input-label">Username</FormLabel>
            <FormControl>
              <div className="w-full relative">
                <input
                  {...field}
                  className="form-input-normal disabled:opacity-30"
                  disabled={status.isPending}
                />
                <span className="absolute inset-y-0 end-0 flex items-center pe-3">
                  <SvgSpinners
                    className={cn(
                      "w-4 h-4",
                      !status.isPending ? "hidden" : "block"
                    )}
                  />
                </span>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

const UpdateName = () => {
  const user = queryClient.getQueryData(userKeys.all) as UserInterface;

  const form = useForm<schemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user?.name ? user.name : "",
    },
  });

  const {
    isError,
    isSuccess,
    isPending,
    status,
    reset,
    mutate: updateUserName,
  } = useMutation(updateUserParams());

  const onSubmit = async (values: schemaType) => {
    updateUserName(values);
  };

  const [statusText, setStatusText] = useState<string>("");

  useEffect(() => {
    console.log('sta', status)
    if (status === "error") {
      setStatusText("Error while changing the name!");
    } else if (status === "success") {
      setStatusText("Name changed");
    } else {
      setStatusText("");
    }
  }, [status]);

  return (
    <>
      <CardLayout>
        <CardName
          title="Profile Information"
          description="Update your account's profile information and email address."
        />
        <CardForm
          form={form}
          onSubmit={onSubmit}
          status={{ isPending, isError, isSuccess }}
          statusText={statusText}
          reset={reset}
        >
          <UpdateNameFormFields form={form} status={{ isPending }} />
        </CardForm>
      </CardLayout>
    </>
  );
};

export default UpdateName;
