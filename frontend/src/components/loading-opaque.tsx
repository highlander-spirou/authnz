import React from "react";

type LoadingOpaqueProps = {
  isLoading: boolean;
  children: React.ReactNode;
};

const LoadingOpaque: React.FC<LoadingOpaqueProps> = ({
  isLoading,
  children,
}) => {
  return (
    <div className={isLoading ? "opacity-40 pointer-events-none" : ""}>
      {children}
    </div>
  );
};

export default LoadingOpaque;
