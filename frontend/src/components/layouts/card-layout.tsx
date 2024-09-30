import { PropsWithChildren } from "react"

const CardLayout = ({ id, children }: PropsWithChildren<{ id: string }>) => {
  return (
    <section id={id} className="relative grid grid-cols-3">
      {children}
    </section>
  )
}

export default CardLayout
