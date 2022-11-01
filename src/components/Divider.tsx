import React from "react";

type DividerProps = { children: React.ReactNode };

const Divider = ({ children }: DividerProps) => {
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t border-gray-300" />
      </div>
      <div className="relative flex justify-center">
        <span className="bg-gray-100 px-3 text-lg font-medium text-gray-600">
          {children}
        </span>
      </div>
    </div>
  );
};

export default Divider;
