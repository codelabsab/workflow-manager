import type { Repo, Workflow } from "@prisma/client";

import { prisma } from "../db/client";

export const isDispatchable = (rawWorkflow: string) => {
  return rawWorkflow.includes("workflow_dispatch");
};

export type refreshRepoWorkflowProps = {
  repoId?: number;
  dbRepo?: Repo & { workflows: Workflow[] };
};

export async function getDbUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      usersToInstallations: {
        include: {
          installation: {
            include: { repos: { include: { workflows: true } } },
          },
        },
      },
    },
  });
  return user;
}
