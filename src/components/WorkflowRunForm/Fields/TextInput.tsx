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
        className="w-full rounded border p-1 text-base "
        {...props}
      />
    );
  }
);

export default TextInput;
