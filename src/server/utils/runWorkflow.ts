import type { Octokit } from "octokit";
import type { JSONValue } from "superjson/dist/types";

import { app } from "./octokit";

import { prisma } from "server/db/client";

export default async function runWorkflow(
  workflowId: number,
  ref?: string,
  inputs?: Record<string, string> | JSONValue | null
) {
  const dbWorkflow = await prisma.workflow.findFirstOrThrow({
    where: { id: workflowId },
    include: { repo: { include: { installation: true } } },
  });

  const octokit: Octokit = await app.getInstallationOctokit(
    dbWorkflow.repo.installationId
  );
  // https://docs.github.com/en/rest/actions/workflows#create-a-workflow-dispatch-event
  const response = await octokit.request(
    "POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches",
    {
      owner: dbWorkflow.repo.owner_login,
      repo: dbWorkflow.repo.name,
      workflow_id: workflowId.toString(),
      ref: ref || dbWorkflow.repo.default_branch,
      inputs: (inputs as Record<string, string>) || {},
    }
  );
  return response;
}
