const CardName = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <>
      <div className="px-4 sm:px-0">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <p className="mt-1 text-sm text-gray-600">{description}</p>
      </div>
    </>
  );
};

export default CardName;
