import { useRouter } from "next/router";
import { useInterval } from "react-use";

import { trpc } from "utils/trpc";

const WorkflowRuns = () => {
  const router = useRouter();
  // Get and set workflowId to a string
  const { workflowId: incomingId } = router.query;
  const workflowId = typeof incomingId === "string" ? incomingId : "";
  const utils = trpc.useContext();

  const { data: workflowRuns, isLoading } =
    trpc.github.getWorkflowRuns.useQuery({
      workflowId,
    });

  // Invalidate the cache every 2 seconds
  useInterval(
    () => {
      utils.github.getWorkflowRuns.invalidate();
    },
    isLoading ? null : 5000
  );

  if (isLoading) {
    return <div className="p-10">Loading</div>;
  }
  if (!workflowRuns?.length) {
    return <div className="p-10">No runs found</div>;
  }
  return (
    <div className="p-10">
      {workflowRuns.map((run) => (
        <pre className="" key={run.id.toString()}>
          {run.id.toString()} - {run.created_at.toISOString()} - {run.status} -{" "}
          <a className="underline" href={run.html_url}>
            Open on github
          </a>
        </pre>
      ))}
    </div>
  );
};

export default WorkflowRuns;
