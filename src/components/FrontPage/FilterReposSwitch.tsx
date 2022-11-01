import { Switch } from "@headlessui/react";
import classNames from "classnames";
import type { Dispatch, SetStateAction } from "react";
import React from "react";

type FilterReposSwitchProps = {
  checked?: boolean;
  setChecked?: Dispatch<SetStateAction<boolean | undefined>>;
};

const FilterReposSwitch = ({ checked, setChecked }: FilterReposSwitchProps) => {
  return (
    <Switch.Group as="div" className="flex items-center">
      <Switch
        checked={checked}
        onChange={setChecked}
        className={classNames(
          checked ? "bg-gray-600" : "bg-gray-200",
          "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        )}
      >
        <span
          aria-hidden="true"
          className={classNames(
            checked ? "translate-x-5" : "translate-x-0",
            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
          )}
        />
      </Switch>
      <Switch.Label as="span" className="ml-3">
        <span className="cursor-pointer text-sm font-medium text-gray-900">
          Only show repositories with workflows
        </span>
      </Switch.Label>
    </Switch.Group>
  );
};

export default FilterReposSwitch;
