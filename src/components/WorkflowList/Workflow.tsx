import { Workflow } from "@prisma/client";
import Link from "next/link";
import { useRef, useState } from "react";
import { useClickAway } from "react-use";

import DisplayIfHasScheduledRuns from "./DisplayIfHasScheduledRuns";
import DisplayIfHasWorkflowRuns from "./DisplayIfHasWorkflowRuns";

import ScheduleWorkflowRunForm from "components/WorkflowRunForm/ScheduleWorkflowRunForm";
import WorkflowRunForm from "components/WorkflowRunForm/WorkflowRunForm";

type WorkflowProps = {
  workflow: Workflow;
};

const Workflow = ({ workflow }: WorkflowProps) => {
  const [rawFile, setRawFile] = useState("");
  const [showRunForm, setShowRunForm] = useState(false);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const runNowRef = useRef(null)
  const scheduleRunRef = useRef(null)
  const notShowingYamlFile = !rawFile && Boolean(workflow.fileRaw);

  useClickAway(runNowRef, () => {
    setShowRunForm(false)
  });
  useClickAway(scheduleRunRef, () => {
    setShowScheduleForm(false)
  });

  return (
    <div key={workflow.id} className="ml-10 space-y-4">
      <div className="flex items-baseline justify-between rounded px-2 py-2 text-xs hover:bg-slate-100">
        {workflow.name}
        <div className="space-x-2">
          {workflow.isDispatchable ? (
            <>
              <button
                className="rounded-lg bg-slate-200 px-2 py-1
           hover:bg-slate-300"
                onClick={() => setShowScheduleForm(!showScheduleForm)}
              >
                {showScheduleForm ? "Hide Schedule run" : "Schedule run"}
              </button>
              <button
                className="rounded-lg bg-slate-200 px-2 py-1
           hover:bg-slate-300"
                onClick={() => setShowRunForm(!showRunForm)}
              >
                {showRunForm ? "Hide run" : "Run now"}
              </button>
              {workflow.isDispatchable ? (
                <>
                  <DisplayIfHasWorkflowRuns workflow={workflow}>
                    <Link
                      className="rounded-lg bg-slate-200 px-2 py-1
           hover:bg-slate-300"
                      href={`/runs/${workflow.id}`}
                    >
                      Show runs
                    </Link>
                  </DisplayIfHasWorkflowRuns>
                  <DisplayIfHasScheduledRuns workflow={workflow}>
                    <Link
                      className="rounded-lg bg-slate-200 px-2 py-1
           hover:bg-slate-300"
                      href={`/scheduled/${workflow.id}`}
                    >
                      Show scheduled runs
                    </Link>
                  </DisplayIfHasScheduledRuns>
                </>
              ) : null}
            </>
          ) : (
            <small className="text-cs text-gray-400">
              workflow is not dispatchable
            </small>
          )}

          <span className="relative">
            <button
              className="rounded-lg bg-slate-200 px-2 py-1
           hover:bg-slate-300"
              onClick={() => {
                if (notShowingYamlFile) {
                  setRawFile(workflow.fileRaw || "");
                } else {
                  setRawFile("");
                }
              }}
            >
              {notShowingYamlFile ? "Show" : "Hide"} YAML
            </button>
            {showRunForm ? (
              <div className="absolute right-28 top-6 z-10 ">
                <WorkflowRunForm
                  workflow={workflow}
                  onSubmitCallback={() => setShowRunForm(false)}
                />
              </div>
            ) : null}

            {showRunForm ? (
              <div className="absolute right-28 top-6 z-10 " ref={runNowRef}>
                <WorkflowRunForm
                  workflow={workflow}
                  onSubmitCallback={() => setShowRunForm(false)}
                />
              </div>
            ) : null}

            {showScheduleForm ? (
              <div className="absolute right-28 top-6 z-10 " ref={scheduleRunRef}>
                <ScheduleWorkflowRunForm
                  workflow={workflow}
                  onSubmitCallback={() => setShowScheduleForm(false)}
                />
              </div>
            ) : null}
          </span>
        </div>
      </div>
      {rawFile ? (
        <pre className="rounded bg-gray-700 p-5 text-xs text-gray-50 shadow-lg">
          {rawFile}
        </pre>
      ) : null}
    </div>
  );
};

export default Workflow;
