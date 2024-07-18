import { Form } from "@/components/ui/form";
import React from "react";
import { type UseFormReturn } from "react-hook-form";
import SuccessStateButton from "../components/success-state-button";
import LoadingOpaque from "@/components/loading-opaque";

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
      <LoadingOpaque isLoading={status?.isPending}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div>
              <div className="form-grid">{children}</div>
              <div className="user-submit-section">
                <button
                  type="submit"
                  className="btn-black"
                  disabled={status?.isPending}
                >
                  Submit
                </button>
                {status?.isSuccess && (
                  <SuccessStateButton statusText={statusText!} reset={reset} />
                )}
                {status?.isError && (
                  <p className="user-status-error">{statusText}</p>
                )}
              </div>
            </div>
          </form>
        </Form>
      </LoadingOpaque>
    </>
  );
};

export default CardForm;
