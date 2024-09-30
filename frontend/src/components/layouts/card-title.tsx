const CardTitle = ({
  title,
  description,
}: {
  title: string
  description: string
}) => {
  return (
    <>
      <div className="items-end">
        <h3 className="text-lg font-medium text-foreground">{title}</h3>
        <p className="mt-1 text-sm text-gray-600">{description}</p>
      </div>
    </>
  )
}

export default CardTitle
