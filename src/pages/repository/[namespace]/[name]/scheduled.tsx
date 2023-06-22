import type { Workflow } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { type NextPage } from "next";
import { Fragment, useState } from "react";
import { toast } from "react-toastify";

import JsonValue = Prisma.JsonValue;
import Divider from "components/Divider";
import TopLevelHeading from "components/FrontPage/TopLevelHeading";
import Main from "components/Layout/Main";
import ScheduleWorkflowRunForm from "components/WorkflowRunForm/ScheduleWorkflowRunForm";
import useFullRepoName from "hooks/useFullRepoName";
import useGetRepoTabs from "hooks/useGetRepoTabs";
import { trpc } from "utils/trpc";

const getRunDate = (runAt: Date): string => {
  return new Date(runAt).toUTCString();
};

const RowComponent = ({
  id,
  workflowId,
  hasBeenTriggered,
  runAt,
  userId,
  inputs,
}: {
  id: string;
  workflowId: number;
  hasBeenTriggered: boolean;
  runAt: Date;
  userId: string;
  inputs: JsonValue;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <tr
        className={`rounded hover:cursor-pointer hover:bg-gray-100 ${
          open &&
          "rounded border border-gray-700 bg-gray-50 font-bold text-gray-700"
        }`}
        onClick={() => setOpen(!open)}
      >
        <td className="w-2 truncate">{id}</td>
        <td className="w-2 truncate">{workflowId}</td>
        <td className="w-2 truncate">{`${hasBeenTriggered}`}</td>
        <td className="w-2 truncate">{getRunDate(runAt)}</td>
        <td className="w-2 truncate">{userId}</td>
        <td className="w-2 truncate">{JSON.stringify(inputs)}</td>
      </tr>
      {open && (
        <tr className="bg-gray-50">
          <td colSpan={6}>
            <div className="mb-5 w-full rounded border border-gray-700 bg-gray-50 p-5 text-gray-700">
              <div className="flex w-full">
                <div className="font-bold">id:</div>
                <div className="truncate">{id}</div>
              </div>
              <div className="flex w-full">
                <div className="font-bold">workflowId:</div>
                <div className="truncate">{workflowId}</div>
              </div>
              <div className="flex w-full">
                <div className="font-bold">hasBeenTriggered:</div>
                <div className="truncate">{`${hasBeenTriggered}`}</div>
              </div>
              <div className="flex w-full">
                <div className="font-bold">runAt:</div>
                <div className="truncate">{getRunDate(runAt)}</div>
              </div>
              <div className="flex w-full">
                <div className="font-bold">userId:</div>
                <div className="truncate">{userId}</div>
              </div>
              <div className="flex w-full">
                <div className="font-bold">inputs:</div>
                <div className="truncate">{JSON.stringify(inputs)}</div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

const ScheduledRuns: NextPage = () => {
  const repositoryFullName = useFullRepoName();
  const repository = trpc.github.getRepository.useQuery({
    repositoryFullName: repositoryFullName,
  });
  const { data: scheduledRuns = [] } =
    trpc.github.getWorkflowScheduledRuns.useQuery({});

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
        <div className="rounded-lg border bg-white px-4 py-5 shadow">
          <table className="w-full table-fixed truncate text-left font-mono text-xs">
            <thead>
              <tr>
                <td className="w-2 truncate font-bold">id</td>
                <td className="w-2 truncate font-bold">workflowId</td>
                <td className="w-2 truncate font-bold">hasBeenTriggered</td>
                <td className="w-2 truncate font-bold">runAt</td>
                <td className="w-2 truncate font-bold">userId</td>
                <td className="w-2 truncate font-bold">inputs</td>
              </tr>
            </thead>
            <tbody>
              {scheduledRuns.map((scheduledRun) => (
                <Fragment key={scheduledRun.id}>
                  <RowComponent {...scheduledRun} />
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </Main>
    </>
  );
};

export default ScheduledRuns;
