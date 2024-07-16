import { findPageIndicator } from "@/lib/page-indicator-list";
import { useLocation } from "react-router-dom";

const PageIndicator = () => {
  const location = useLocation();

  return (
    <>
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h2 className="font-semibold text-xl text-gray-800 leading-tight">
            {!findPageIndicator(location.pathname)
              ? import.meta.env.VITE_APP_NAME!
              : findPageIndicator(location.pathname)}
          </h2>
        </div>
      </header>
    </>
  );
};

export default PageIndicator;
