/* eslint-disable react/display-name */
import type { LegacyRef } from "react";
import React from "react";

const TextInput = React.forwardRef(
  (
    props: React.DetailedHTMLProps<
      React.InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    >,
    ref: LegacyRef<HTMLInputElement> | undefined
  ) => {
    return (
      <input
        ref={ref}
        type="text"
        className="focus:shadow-outline w-full rounded border-gray-200 p-3 text-base hover:border-gray-300 focus:border-gray-400 focus:ring-0"
        {...props}
      />
    );
  }
);

export default TextInput;
