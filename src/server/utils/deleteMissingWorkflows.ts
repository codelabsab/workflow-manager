import type { Repo, Workflow } from "@prisma/client";
import _ from "lodash";

import { prisma } from "../db/client";

export default async function deleteMissingWorkflows(
  dbRepo: Repo & { workflows: Workflow[] },
  workflowsFromGithubResponse: { id: number }[]
) {
  // Delete workflows that are not in the response anymore
  const workflowsToDelete = dbRepo.workflows.filter(
    (workflow) =>
      !workflowsFromGithubResponse.find(
        (w) => String(w.id) === String(workflow.id)
      )
  );
  await Promise.all(
    _.map(workflowsToDelete, async (workflow) => {
      await prisma.workflow.delete({ where: { id: workflow.id } });
    })
  );
}
