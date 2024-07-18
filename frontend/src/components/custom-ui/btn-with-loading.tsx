import { cn } from "@/lib/utils";
import { SvgSpinners } from "../loading-svg";
import { forwardRef, Ref } from "react";

const BtnWithLoading = forwardRef<HTMLInputElement, {isLoading: boolean}>(
  ({ isLoading, ...props }, ref: Ref<HTMLInputElement>) => {
    return (
      <>
        <div className="w-full relative">
          <input
            {...props}
            ref={ref}
            className="form-input-normal disabled:opacity-30"
            disabled={isLoading}
          />
          <span className="absolute inset-y-0 end-0 flex items-center pe-3">
            <SvgSpinners
              className={cn("w-4 h-4", !isLoading ? "hidden" : "block")}
            />
          </span>
        </div>
      </>
    );
  }
);
export default BtnWithLoading;
