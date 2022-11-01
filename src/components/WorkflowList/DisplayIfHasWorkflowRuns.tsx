import type { Workflow } from "@prisma/client";
import type { ReactNode } from "react";
import { useInterval } from "react-use";

import { trpc } from "utils/trpc";

type DisplayIfHasWorkflowRunsProps = {
  workflow: Workflow;
  children: ReactNode;
};

const DisplayIfHasWorkflowRuns = ({
  workflow,
  children,
}: DisplayIfHasWorkflowRunsProps) => {
  const { data: hasWorkflowRuns, isLoading: hasWorkflowRunsIsLoading } =
    trpc.github.hasWorkflowRuns.useQuery({
      workflowId: String(workflow.id),
    });
  const utils = trpc.useContext();

  // Invalidate the cache every 2 seconds
  useInterval(
    () => {
      utils.github.hasWorkflowRuns.invalidate({
        workflowId: String(workflow.id),
      });
    },
    !hasWorkflowRunsIsLoading ? 2000 : null
  );

  if (hasWorkflowRuns) {
    return <>{children}</>;
  }
  return null;
};

export default DisplayIfHasWorkflowRuns;
