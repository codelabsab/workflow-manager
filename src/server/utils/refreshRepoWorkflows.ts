import {
  decodeBase64,
  decodeYamlFile,
  parseWorkflowInputs,
} from "../../utils/common";
import { prisma } from "../db/client";

import deleteMissingWorkflows from "./deleteMissingWorkflows";
import type { refreshRepoWorkflowProps } from "./misc";
import { isDispatchable } from "./misc";
import { app } from "./octokit";

export default async function refreshRepoWorkflows({
  repoId,
  dbRepo,
}: refreshRepoWorkflowProps) {
  if (!repoId && !dbRepo) {
    throw new Error("No repoId or dbRepo provided!");
  }
  // Use dbRepo if provided otherwise fetch it
  const repo =
    dbRepo ??
    (await prisma.repo.findFirstOrThrow({
      where: { id: repoId },
      include: { workflows: true },
    }));

  const octokit = await app.getInstallationOctokit(repo.installationId);

  const response = await octokit.rest.actions.listRepoWorkflows({
    owner: repo.owner_login,
    repo: repo.name,
  });
  const workflowsFromGithubResponse = response.data.workflows;

  await deleteMissingWorkflows(repo, workflowsFromGithubResponse);

  // Create or update workflows
  await Promise.allSettled(
    workflowsFromGithubResponse.map(async (workflow_github_response) => {
      const workflowFileContentResponse = await octokit.request(
        "GET /repos/{owner}/{repo}/contents/{path}",
        {
          owner: repo.owner_login,
          repo: repo.name,
          path: workflow_github_response.path,
        }
      );

      const raw = decodeBase64(
        (workflowFileContentResponse.data as { content: string }).content
      );
      const inputs = parseWorkflowInputs(raw);
      const decoded = decodeYamlFile(raw);

      await prisma.workflow.upsert({
        where: { id: workflow_github_response.id },
        update: {
          raw_github_data: workflow_github_response,
          raw_github_content_data: workflowFileContentResponse,
          fileYaml: decoded,
          fileRaw: raw,
          isDispatchable: isDispatchable(raw),
          inputs: inputs,
          html_url: workflow_github_response.html_url,
          name: workflow_github_response.name,
        },
        create: {
          id: workflow_github_response.id,
          raw_github_data: workflow_github_response,
          raw_github_content_data: workflowFileContentResponse,
          fileYaml: decoded,
          fileRaw: raw,
          isDispatchable: isDispatchable(raw),
          inputs: inputs,
          name: workflow_github_response.name,
          html_url: workflow_github_response.html_url,
          repo: { connect: { id: repo.id } },
        },
      });
    })
  );
}
