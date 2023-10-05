import type { Workflow } from "@prisma/client";
import _ from "lodash";
import { useForm } from "react-hook-form";

import DatetimeInput from "./Fields/DatetimeInput";
import SelectInput from "./Fields/SelectInput";
import TextInput from "./Fields/TextInput";

import type { WorkFlowInput } from "types/custom";
import { trpc } from "utils/trpc";

type ScheduleWorkflowRunFormProps = {
  workflow: Workflow;
  onSubmitCallback: () => void;
  cols?: number;
};

const ScheduleWorkflowRunForm = ({
  workflow,
  onSubmitCallback,
  cols = 1,
}: ScheduleWorkflowRunFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const scheduleMutation = trpc.github.scheduleWorkflow.useMutation();

  const onSubmit = (formData: Record<string, string>) => {
    const { runAt, ...inputs } = formData;
    if (runAt) {
      scheduleMutation.mutate({
        workflowId: workflow.id,
        inputs: inputs,
        runAt: new Date(runAt),
      });
      onSubmitCallback?.();
    }
  };

  watch((data) => {
    console.log(data);
  });

  return (
    <div className="flex-grow flex-col items-center">
      <div className="rounded border border-gray-100 bg-white shadow-xl">
        <h2 className="bg-gray-200 p-2 text-xl font-bold uppercase">
          Schedule Run
        </h2>

        <div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 text-sm">
            <div className={`grid grid-cols-${cols}`}>
              <div>
                <div className="p-2">
                  <label
                    className="block font-semibold text-gray-500"
                    htmlFor="datetime"
                  >
                    Execute at
                  </label>

                  <DatetimeInput
                    {...register("runAt", {
                      required: "You have to add a date and time",
                    })}
                  />
                  {errors["runAt"] && (
                    <div className="text-xs text-red-500">
                      {errors["runAt"]?.message as string}
                    </div>
                  )}
                </div>
              </div>
              <div>
                {workflow.inputs ? (
                  <h3 className="bg-gray-100 p-2 text-lg font-semibold">
                    Workflow Inputs
                  </h3>
                ) : (
                  <h3 className="p-2 text-lg font-semibold text-gray-300">
                    This workflow does not have any custom inputs
                  </h3>
                )}
                <div className="p-2">
                  {workflow.inputs &&
                    Object.keys(workflow.inputs).map((key) => {
                      const data = _.get(workflow.inputs, key) as WorkFlowInput;

                      const isChoiceInput = data.type === "choice";
                      const isTextInput =
                        data.type === "string" || !isChoiceInput;
                      return (
                        <div key={key}>
                          <label
                            htmlFor={key}
                            className="block text-base text-sm text-gray-500"
                          >
                            {data?.description ? data.description : key}
                          </label>
                          {isChoiceInput ? (
                            <SelectInput
                              id={key}
                              choices={data?.options}
                              defaultValue={data?.default}
                              registerCallback={() =>
                                register(key, {
                                  required: data.required
                                    ? "This input is required"
                                    : false,
                                })
                              }
                            />
                          ) : null}
                          {isTextInput ? (
                            <TextInput
                              id={key}
                              defaultValue={data.default ?? ""}
                              {...register(key, {
                                required: data.required
                                  ? "This input is required"
                                  : false,
                              })}
                            />
                          ) : null}

                          {errors[key] && (
                            <div className="text-xs text-red-500">
                              {errors[key]?.message as string}
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
              <div className="self-end">
                <div className="p-2">
                  <button
                    className="mt-2 w-full rounded-lg bg-neutral-200 p-2 text-gray-500"
                    type="submit"
                  >
                    Schedule
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ScheduleWorkflowRunForm;
