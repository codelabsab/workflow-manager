import { prisma } from "../db/client";

import { app } from "./octokit";
import refreshRepoWorkflows from "./refreshRepoWorkflows";

import type { GetRepositoryResponse } from "types/GithubResponses/GetRepository";

export default async function refreshAllReposForInstallation(
  installationId: number
): Promise<void> {
  const dbInstallation = await prisma.installation.findFirstOrThrow({
    where: { id: installationId },
    include: { repos: { include: { workflows: true } } },
  });
  const octokit = await app.getInstallationOctokit(dbInstallation.id);

  const allReposPages = (await octokit.paginate(
    octokit.rest.apps.listReposAccessibleToInstallation,
    {
      per_page: 30,
    }
  )) as unknown as GetRepositoryResponse[];

  // Delete repos that are not in the response anymore
  const reposToDelete = dbInstallation.repos.filter(
    (repoInDatabase) =>
      !allReposPages.find(
        (repoInResponse) => repoInResponse.id === repoInDatabase.id
      )
  );
  await Promise.allSettled(
    reposToDelete.map(async (repoInDatabaseToDelete) => {
      await prisma.repo.delete({ where: { id: repoInDatabaseToDelete.id } });
    })
  );

  // Create or update repos
  if (allReposPages.length > 0) {
    await Promise.allSettled(
      allReposPages.map(async (repoFromOctokit) => {
        await prisma.repo.upsert({
          where: { id: repoFromOctokit.id },
          update: {
            name: repoFromOctokit.name,
            full_name: repoFromOctokit.full_name,
            raw_github_data: repoFromOctokit as object,
            owner_login: repoFromOctokit.owner.login,
            default_branch: repoFromOctokit.default_branch,
            private: repoFromOctokit.private,
          },
          create: {
            id: repoFromOctokit.id,
            name: repoFromOctokit.name,
            full_name: repoFromOctokit.full_name,
            raw_github_data: repoFromOctokit as object,
            owner_login: repoFromOctokit.owner.login,
            default_branch: repoFromOctokit.default_branch,
            private: repoFromOctokit.private,
            installation: { connect: { id: dbInstallation.id } },
          },
        });
        // Refresh workflows for repository
        await refreshRepoWorkflows({ repoId: repoFromOctokit.id });
      })
    );
  }
}
