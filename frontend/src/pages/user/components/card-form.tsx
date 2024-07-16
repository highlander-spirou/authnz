import { Form } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import React from "react";
import { type UseFormReturn } from "react-hook-form";

type CardFormProps = {
  form: UseFormReturn<any>;
  onSubmit: (values: any) => void;
  children: React.ReactNode;
  status?: {
    isSuccess: boolean;
    isError: boolean;
    isPending: boolean;
  };
  statusText?: string;
  reset: () => void;
};

const CardForm: React.FC<CardFormProps> = ({
  form,
  onSubmit,
  status,
  statusText,
  reset,
  children,
}) => {
  return (
    <>
      <div
        className={cn(
          "mt-5 md:mt-0 md:col-span-2",
          status?.isPending && "opacity-40 pointer-events-none"
        )}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="px-4 py-5 bg-white sm:p-6 shadow sm:rounded-tl-md sm:rounded-tr-md">
              <div className="form-grid">{children}</div>
            </div>
            <div className="user-submit-section">
              <button
                type="submit"
                className="btn-black"
                disabled={status?.isPending}
              >
                Submit
              </button>
              {status?.isSuccess && (
                <div className="flex gap-1">
                  <button
                    className="btn-link"
                    type="button"
                    onClick={() => reset()}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      className="w-5 h-5"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                    </svg>
                  </button>
                  <p className="user-status-success">{statusText}</p>
                </div>
              )}
              {status?.isError && (
                <p className="user-status-error">{statusText}</p>
              )}
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};

export default CardForm;
