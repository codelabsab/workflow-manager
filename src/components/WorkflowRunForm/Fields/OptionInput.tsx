import React from "react";

const OptionInput = (
  props: React.DetailedHTMLProps<
    React.OptionHTMLAttributes<HTMLOptionElement>,
    HTMLOptionElement
  >
) => {
  return <option {...props}>{props.value}</option>;
};

export default OptionInput;
