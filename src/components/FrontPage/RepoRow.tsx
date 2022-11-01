import type { Repo, Workflow } from "@prisma/client";
import { useState } from "react";

import WorkflowList from "components/WorkflowList/WorkflowList";

type RepoRowProps = {
  repo: Repo & { workflows: Workflow[] };
};
export const RepoRow = ({ repo }: RepoRowProps) => {
  const [show, setShow] = useState(false);

  return (
    <>
      <li className="flex justify-between text-xs hover:bg-slate-100">
        <span className="text-lg font-medium">
          {repo.full_name} - {repo.private ? "private" : "public"}
        </span>
        {repo.workflows.length ? (
          <button onClick={() => setShow(!show)}>
            {show ? "hide" : "show"} debug
          </button>
        ) : null}
      </li>

      <WorkflowList workflows={repo.workflows} />

      {repo.workflows.length && show ? (
        <pre className="text-xs">
          {repo.workflows.map((workflow, workflowKey) => (
            <li key={workflowKey}>{JSON.stringify(workflow, null, 2)}</li>
          ))}
        </pre>
      ) : null}
    </>
  );
};
