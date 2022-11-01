import type { Workflow } from "@prisma/client";
import type { ReactNode } from "react";
import { useInterval } from "react-use";

import { trpc } from "utils/trpc";

type DisplayIfHasScheduledRunsProps = {
  workflow: Workflow;
  children: ReactNode;
};

const DisplayIfHasScheduledRuns = ({
  workflow,
  children,
}: DisplayIfHasScheduledRunsProps) => {
  const { data: hasSheduledRuns, isLoading } =
    trpc.github.hasSheduledRuns.useQuery({
      workflowId: String(workflow.id),
    });
  const utils = trpc.useContext();

  // Invalidate the cache every 2 seconds
  useInterval(
    () => {
      utils.github.hasSheduledRuns.invalidate({
        workflowId: String(workflow.id),
      });
    },
    !isLoading ? 2000 : null
  );

  if (hasSheduledRuns) {
    return <>{children}</>;
  }
  return null;
};

export default DisplayIfHasScheduledRuns;
