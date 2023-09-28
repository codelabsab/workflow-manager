import cn from "classnames";
import React from "react";

type RoundedDivProps = {
  children: React.ReactNode;
  classNames?: string;
} & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

const RoundedDiv = ({ children, classNames }: RoundedDivProps) => {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border-gray-300 bg-white text-left shadow-lg duration-200 ease-in",
        classNames
      )}
    >
      {children}
    </div>
  );
};

export default RoundedDiv;
