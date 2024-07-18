const LoadingOpaque = ({ isLoading, children }) => {
  return (
    <div className={isLoading ? "opacity-40 pointer-events-none" : ""}>
      {children}
    </div>
  );
};

export default LoadingOpaque;
