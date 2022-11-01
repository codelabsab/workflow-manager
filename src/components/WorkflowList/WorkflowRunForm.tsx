import _ from "lodash";
import React from "react";
import { useForm } from "react-hook-form";

import type { WorkFlowInput, WorkflowWithResponse } from "../../types/custom";
import { trpc } from "../../utils/trpc";

type WorkflowRunFormProps = {
  workflow: WorkflowWithResponse;
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

  const triggerWorkflowMutation = trpc.github.triggerWorkflow.useMutation();

  const onSubmit = (formData: Record<string, string>) => {
    triggerWorkflowMutation.mutate({
      workflowId: workflow.id,
      inputs: formData,
    });
    onSubmitCallback?.();
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-72 rounded border border-gray-200 bg-white p-2 shadow-xl">
        {workflow.inputs ? (
          <h2 className="text-lg font-bold ">Workflow Inputs</h2>
        ) : (
          "This workflow does not have any custom inputs"
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 text-sm">
          {workflow.inputs &&
            Object.keys(workflow.inputs).map((key) => {
              const data = _.get(workflow.inputs, key) as WorkFlowInput;

              return (
                <div key={key}>
                  <label
                    htmlFor={key}
                    className="block text-base font-semibold text-gray-600"
                  >
                    {data?.description ? data.description : key}
                  </label>
                  <input
                    id={key}
                    type="text"
                    className="w-full rounded border p-1 text-base "
                    defaultValue={data.default ?? ""}
                    {...register(key, {
                      required: data.required
                        ? "This input is required"
                        : false,
                    })}
                  />
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
        </form>
      </div>
    </div>
  );
};

export default WorkflowRunForm;
