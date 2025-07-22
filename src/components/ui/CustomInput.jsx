import React, { forwardRef, useId } from "react";

const CustomInput = forwardRef(
  (
    { label, error, className = "", containerClassName = "", ...props },
    ref
  ) => {
    const id = useId();

    return (
      <div className={`mb-4 ${containerClassName}`}>
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {label}
          </label>
        )}
        <input
          id={id}
          ref={ref}
          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
            error ? "border-red-500" : "border-gray-300"
          } ${className}`}
          {...props}
        />
      </div>
    );
  }
);
