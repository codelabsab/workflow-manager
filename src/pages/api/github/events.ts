import { type NextApiRequest, type NextApiResponse } from "next";

import { prisma } from "server/db/client";
import refreshAllReposForInstallation from "server/utils/refreshAllReposForInstallation";
import refreshRepoWorkflows from "server/utils/refreshRepoWorkflows";
import remapAllInstallsToMembers from "server/utils/remapAllInstallsToMembers";
import type { PushEvent } from "types/GithubEvents/PushEvent";
import type { WorkflowRunEvent } from "types/GithubEvents/WorkFlowDispatchEvents/WorkflowRunEvent";
import type { InstallationAddedEvent } from "types/GithubResponses/InstallationAddedEvent";

enum Action {
  added = "added",
  removed = "removed",
  created = "created",
  deleted = "deleted",
  requested = "requested",
  queued = "queued",
  completed = "completed",
  in_progress = "in_progress",
}

const Events = async (req: NextApiRequest, res: NextApiResponse) => {
  const event = req.body;

  console.log("event", JSON.stringify(event, null, 2));

  const hasInstallationActions = Object.values([
    Action.created,
    Action.added,
    Action.deleted,
    Action.removed,
  ]).includes(event.action);
  const isInstallEvent = event.installation && hasInstallationActions;
  if (isInstallEvent) {
    console.log("event", event);
    const dbUser = await prisma.user.findFirstOrThrow({
      where: { github_id: event.sender.id },
    });

    if (event.action === Action.added || event.action === Action.removed) {
      await prisma.installation.update({
        where: { id: event.installation.id },
        data: {
          repository_selection: (event as InstallationAddedEvent)
            .repository_selection,
        },
      });
      await refreshAllReposForInstallation(event.installation.id);
    }

    if (event.action === Action.created) {
      const isOrganization = event.installation.account.type === "Organization";
      await prisma.installation.create({
        data: {
          id: event.installation.id,
          raw_github_create_event: event,
          url: event.installation.html_url,
          installed_on_organization: isOrganization,
          installed_on_login: event.installation.account.login,
          organization_id: isOrganization
            ? event.installation.account.id
            : null,
          type: event.installation.account.type,
          repository_selection: event.installation.repository_selection,
          usersToInstallations: { create: [{ userId: dbUser.id }] },
        },
      });
      await refreshAllReposForInstallation(event.installation.id);
      // Map all existing users to this installation
      await remapAllInstallsToMembers();
    }
    if (event.action === Action.deleted) {
      await prisma.installation.delete({
        where: { id: event.installation.id },
      });
    }
  }

  const isPushEvent = event.pusher && event.commits;
  if (isPushEvent) {
    console.log("isPushEvent", isPushEvent);
    // Update the workflows for the repo on push
    const pushEvent = event as PushEvent;
    const dbRepo = await prisma.repo.findFirst({
      where: { id: pushEvent.repository.id },
      include: { workflows: true },
    });

    if (dbRepo) {
      await refreshRepoWorkflows({ dbRepo });
    }
  }

  const isWorkflowRunEvent = event.workflow_run;
  if (isWorkflowRunEvent) {
    const workflowRunEvent = event as WorkflowRunEvent;
    await prisma.workflowRun.upsert({
      where: { id: workflowRunEvent.workflow_run.id },
      create: {
        id: workflowRunEvent.workflow_run.id,
        raw_github_data: event,
        status: workflowRunEvent.workflow_run.status,
        head_branch: workflowRunEvent.workflow_run.head_branch,
        head_sha: workflowRunEvent.workflow_run.head_sha,
        created_at: workflowRunEvent.workflow_run.created_at,
        updated_at: workflowRunEvent.workflow_run.updated_at,
        html_url: workflowRunEvent.workflow_run.html_url,
        event: workflowRunEvent.workflow_run.event,
        workflow: {
          connect: { id: Number(workflowRunEvent.workflow.id) },
        },
      },
      update: {
        raw_github_data: event,
        status: workflowRunEvent.workflow_run.status,
        updated_at: workflowRunEvent.workflow_run.updated_at,
        event: workflowRunEvent.workflow_run.event,
        conclusion: workflowRunEvent.workflow_run.conclusion ?? null,
      },
    });
  }

  // todo: handle Workflow Job runs?

  res.status(200).json(Events);
};

export default Events;
