import type { Workflow } from "@prisma/client";
import { type NextPage } from "next";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";

import Divider from "components/Divider";
import TopLevelHeading from "components/FrontPage/TopLevelHeading";
import Main from "components/Layout/Main";
import ScheduleWorkflowRunForm from "components/WorkflowRunForm/ScheduleWorkflowRunForm";
import useFullRepoName from "hooks/useFullRepoName";
import useGetRepoTabs from "hooks/useGetRepoTabs";
import { trpc } from "utils/trpc";

const ScheduledRuns: NextPage = () => {
  const repositoryFullName = useFullRepoName();
  const repository = trpc.github.getRepository.useQuery({
    repositoryFullName: repositoryFullName,
  });

  const tabs = useGetRepoTabs();
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [selection, setSelection] = useState("");

  const handleSelect = (workflowId: string) => {
    setSelection(workflowId);

    const wf: Workflow | unknown = repository.data?.workflows.find(
      ({ id }) => String(id) === workflowId
    );

    if (wf) {
      setWorkflow(wf as Workflow);
    }
  };

  const onSubmit = () => {
    setWorkflow(null);
    setSelection("");
    toast.success("Workflow scheduled");
  };

  if (repository.isLoading) {
    return <TopLevelHeading tabs={tabs} titleString="Scheduled Runs" />;
  }

  return (
    <>
      <TopLevelHeading tabs={tabs} titleString="Scheduled Runs" />

      <Main>
        <div className="rounded-lg border bg-white px-4 py-5 shadow">
          <div>
            <div className="flex gap-5">
              <div className="flex items-start lg:w-72">
                <select
                  onChange={({ target }) => handleSelect(target.value)}
                  value={selection}
                  className="w-full truncate rounded border-gray-700 text-lg"
                >
                  <option value="" disabled>
                    Select workflow
                  </option>
                  {repository.data?.workflows.map((workflow) => (
                    <option key={workflow.id} value={workflow.id}>
                      {workflow.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-grow">
                {!workflow && (
                  <h3 className="p-2 text-lg font-semibold text-gray-300">
                    Select a workflow to schedule
                  </h3>
                )}
                {workflow && (
                  <ScheduleWorkflowRunForm
                    workflow={workflow}
                    onSubmitCallback={onSubmit}
                    cols={3}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        <Divider>Scheduled runs</Divider>
        <div className="h-72 rounded-lg border bg-white px-4 py-5 shadow">
          Table with scheduled runs
        </div>
      </Main>
      <ToastContainer />
    </>
  );
};

export default ScheduledRuns;
