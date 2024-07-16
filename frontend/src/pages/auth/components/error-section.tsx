import { cn } from "@/lib/utils";

const ErrorSection = ({ errors }) => {
  return (
    <>
      <div className={cn(!errors ? "hidden" : "block", "error-section mb-4")}>
        <p className="big-error font-medium text-red-600">
          Whoops! Something went wrong.
        </p>
        <ul className="mt-3 list-disc list-inside text-sm text-red-600">
          <li>{errors && errors.message}</li>
        </ul>
      </div>
    </>
  );
};

export default ErrorSection;
