import React from "react";
import ErrorBoundary from "../common/ErrorBoundary";

const Layout = ({ children }) => {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto px-4 py-8">{children}</div>
      </div>
    </ErrorBoundary>
  );
};

export default Layout;
