import runWorkflow from "./runWorkflow";

import { prisma } from "server/db/client";

export default async function runScheduled() {
  const now = new Date();
  const shouldRunNow = await prisma.scheduledWorkflowRun.findMany({
    where: { hasBeenTriggered: false, runAt: { lte: now } },
    include: { workflow: { include: { repo: true } } },
  });

  console.log(`Should run ${shouldRunNow.length}`);

  await Promise.all(
    shouldRunNow.map(async (scheduledRun) => {
      await runWorkflow(
        scheduledRun.workflowId,
        scheduledRun.workflow?.repo.default_branch,
        scheduledRun.inputs
      );
      await prisma.scheduledWorkflowRun.update({
        where: { id: scheduledRun.id },
        data: {
          hasBeenTriggered: true,
        },
      });
    })
  );

  return true;
}
