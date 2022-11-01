import type { Repo, ScheduledWorkflowRun, Workflow } from "@prisma/client";
import type { Octokit } from "octokit";
import { z } from "zod";

import { getDbUser } from "../../utils/misc";
import { app } from "../../utils/octokit";
import { protectedProcedure, router } from "../trpc";

type RepoWithWorkflows = Repo & {
  workflows: (Workflow & { scheduledRuns: ScheduledWorkflowRun[] })[];
};

export const githubRouter = router({
  currentUserRepos: protectedProcedure
    .input(z.object({ filterWithWorkflows: z.boolean().optional() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findFirstOrThrow({
        where: { id: ctx.session.user.id },
        include: {
          usersToInstallations: {
            include: {
              installation: {
                include: {
                  repos: {
                    include: {
                      workflows: {
                        include: {
                          scheduledRuns: { where: { hasBeenTriggered: false } },
                        },
                      },
                    },
                    orderBy: { full_name: "asc" },
                  },
                },
              },
            },
          },
        },
      });
      const repos = user.usersToInstallations.flatMap(
        (i) => i.installation.repos as RepoWithWorkflows[]
      );
      if (input.filterWithWorkflows) {
        return repos.filter((repo) => repo.workflows.length);
      }
      return repos || [];
    }),
  dbUser: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findFirstOrThrow({
      where: { id: ctx.session.user.id },
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
  }),

  githubAppData: protectedProcedure.query(async () => {
    const { data } = await app.octokit.request("/app");
    return data;
  }),
  currentUserInstallations: protectedProcedure.query(async ({ ctx }) => {
    const dbUser = await getDbUser(ctx.session.user.id);
    return dbUser?.usersToInstallations.flatMap((i) => i.installation) || [];
  }),
  getWorkflowRuns: protectedProcedure
    .input(z.object({ workflowId: z.string() }))
    .query(async ({ ctx, input }) => {
      const workflowRuns = await ctx.prisma.workflowRun.findMany({
        where: { workflowId: Number(input.workflowId) },
        take: 10,
      });
      return workflowRuns;
    }),
  getWorkflowScheduledRuns: protectedProcedure
    .input(z.object({ workflowId: z.string() }))
    .query(async ({ ctx, input }) => {
      const workflowRuns = await ctx.prisma.scheduledWorkflowRun.findMany({
        where: { workflowId: Number(input.workflowId) },
        take: 10,
        include: { workflow: true },
      });
      return workflowRuns;
    }),
  hasWorkflowRuns: protectedProcedure
    .input(z.object({ workflowId: z.string() }))
    .query(async ({ ctx, input }) => {
      const workflowRuns = await ctx.prisma.workflowRun.findMany({
        where: { workflowId: Number(input.workflowId) },
        take: 1,
      });
      return workflowRuns.length ? true : false;
    }),
  hasSheduledRuns: protectedProcedure
    .input(z.object({ workflowId: z.string() }))
    .query(async ({ ctx, input }) => {
      const workflowRuns = await ctx.prisma.scheduledWorkflowRun.findMany({
        where: { workflowId: Number(input.workflowId) },
        take: 1,
      });
      return workflowRuns.length ? true : false;
    }),
  triggerWorkflow: protectedProcedure
    .input(
      z.object({
        workflowId: z.number(),
        ref: z.optional(z.string()),
        inputs: z.optional(z.record(z.string())),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const dbWorkflow = await ctx.prisma.workflow.findFirstOrThrow({
        where: { id: input.workflowId },
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
          workflow_id: input.workflowId.toString(),
          ref: input.ref || dbWorkflow.repo.default_branch,
          inputs: input.inputs || {},
        }
      );
      console.log("response", response);
      return response;
    }),
  scheduleWorkflow: protectedProcedure
    .input(
      z.object({
        workflowId: z.number(),
        ref: z.optional(z.string()),
        inputs: z.optional(z.record(z.string())),
        runAt: z.date(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const recordToCreate = {
        runAt: input.runAt,
        inputs: input.inputs,
        workflow: {
          connect: { id: input.workflowId },
        },
        createdBy: {
          connect: { id: ctx.session.user.id },
        },
      };
      console.log("recordToCreate", recordToCreate);
      const result = await ctx.prisma.scheduledWorkflowRun.create({
        data: recordToCreate,
      });
      return result;
    }),
  getRepository: protectedProcedure
    .input(z.object({ repositoryFullName: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      if (!input.repositoryFullName) {
        return null;
      }

      // todo return the repository that matches
      const repository = await ctx.prisma?.repo.findFirst({
        where: { full_name: input.repositoryFullName },
        include: { workflows: { include: { scheduledRuns: true } } },
      });

      // todo: Make sure that you can only query repos that you have access to

      return repository;
    }),
});
