const CardLayout = ({ children }) => {
  return (
    <>
      <div className="md:grid md:grid-cols-3 md:gap-6">{children}</div>
    </>
  );
};

export default CardLayout;
