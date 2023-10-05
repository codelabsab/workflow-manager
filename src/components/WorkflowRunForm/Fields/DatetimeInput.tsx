/* eslint-disable react/display-name */
import type { LegacyRef } from "react";
import React from "react";

const DatetimeInput = React.forwardRef(
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
        type="datetime-local"
        className="focus:shadow-outline w-full rounded border border-gray-200 p-1 text-base hover:border-gray-300 focus:border-gray-400 focus:ring-0"
        {...props}
      />
    );
  }
);

export default DatetimeInput;
