import type { Workflow } from "@prisma/client";
import _ from "lodash";
import { useForm } from "react-hook-form";

import SelectInput from "./Fields/SelectInput";
import TextInput from "./Fields/TextInput";

import type { WorkFlowInput } from "types/custom";
import { trpc } from "utils/trpc";


type WorkflowRunFormProps = {
  workflow: Workflow;
  onSubmitCallback: () => void;
};

const WorkflowRunForm = ({
  workflow,
  onSubmitCallback,
}: WorkflowRunFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const utils = trpc.useContext();
  const triggerWorkflowMutation = trpc.github.triggerWorkflow.useMutation();

  const onSubmit = (formData: Record<string, string>) => {
    triggerWorkflowMutation.mutate({
      workflowId: workflow.id,
      inputs: formData,
    });
    onSubmitCallback?.();
    utils.github.hasWorkflowRuns.invalidate({
      workflowId: String(workflow.id),
    });
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-72 rounded border border-gray-200 bg-white  shadow-xl">
        <h2 className="bg-gray-200 p-2 text-xl font-bold uppercase">Run now</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 text-sm">
          {workflow.inputs ? (
            <h3 className=" bg-gray-100 p-2 text-lg font-semibold">
              Workflow Inputs
            </h3>
          ) : (
            "This workflow does not have any custom inputs"
          )}
          <div className="p-2">
            {workflow.inputs &&
              Object.keys(workflow.inputs).map((key) => {
                const data = _.get(workflow.inputs, key) as WorkFlowInput;

                const isChoiceInput = data.type === "choice";
                const isTextInput = data.type === "string" || !isChoiceInput;
                return (
                  <div key={key}>
                    <label
                      htmlFor={key}
                      className="block text-base font-semibold text-gray-600"
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
            <button
              className="mt-2 w-full rounded-lg bg-slate-200 p-2 text-xs  hover:bg-slate-300"
              type="submit"
            >
              Run workflow now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WorkflowRunForm;
