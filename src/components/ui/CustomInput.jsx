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
      </div>
    );
  }
);
