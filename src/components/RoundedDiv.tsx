import cn from "classnames";
import React from "react";

type RoundedDivProps = {
  children: React.ReactNode;
  className?: string;
};

const RoundedDiv = ({ children, className }: RoundedDivProps) => {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border-gray-300 bg-white text-left shadow-lg duration-200 ease-in",
        className
      )}
    >
      {children}
    </div>
  );
};

export default RoundedDiv;
