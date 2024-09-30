import { PropsWithChildren } from "react"

const CardContent = ({ children }: PropsWithChildren) => {
  return (
    <div className="col-span-2">
      <div className="p-6 bg-white shadow rounded-lg">{children}</div>
    </div>
  )
}

export default CardContent
