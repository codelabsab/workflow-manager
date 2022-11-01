import type { FieldValues } from "react-hook-form";

import OptionInput from "./OptionInput";

type SelectInputProps = {
  choices?: string[];
  defaultValue?: string;
  id: string;
  registerCallback: () => FieldValues;
};

const SelectInput = ({
  choices,
  defaultValue,
  id,
  registerCallback,
}: SelectInputProps) => {
  if (!choices || choices.length === 0) {
    return null;
  }

  return (
    <select id={id} defaultValue={defaultValue} {...registerCallback()}>
      {choices.map((choice, index) => (
        <OptionInput key={index} value={choice}>
          {choice}
        </OptionInput>
      ))}
    </select>
  );
};

export default SelectInput;
