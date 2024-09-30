import { cn } from "@/lib/utils"

const ErrorSection = ({ errors }: { errors: string }) => {
  return (
    <>
      <div className={cn(!errors ? "hidden" : "block", "error-section mb-4")}>
        <p className="big-error font-medium text-red-600">{errors}</p>
      </div>
    </>
  )
}

export default ErrorSection
