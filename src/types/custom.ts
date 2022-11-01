import { Prisma } from "@prisma/client";
import { z } from "zod";

import type { WorkflowResponse } from "./GithubResponses/GetWorkflow";

// Relationship types

const userWithRelatedFields = Prisma.validator<Prisma.UserArgs>()({
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

export type UserWithInstallation = Prisma.UserGetPayload<
  typeof userWithRelatedFields
>;

export type RepoWithWorkflows = Omit<
  Prisma.WorkflowCreateInput,
  "workflows"
> & { workflows: WorkflowWithResponse[] };

// custom types

const workFlowWithData = Prisma.validator<Prisma.WorkflowArgs>()({
  select: { raw_github_data: true, id: true },
});

export const ZodWorkFlowInput = z.object({
  default: z.optional(z.string()),
  description: z.optional(z.string()),
  required: z.optional(z.boolean()),
  options: z.optional(z.array(z.string())),
  type: z.optional(z.enum(["boolean", "number", "choice", "string"])),
  choices: z.optional(z.array(z.string())),
});
export type WorkFlowInput = z.infer<typeof ZodWorkFlowInput>;

export const ZodWorkflowParsedInputs = z.record(ZodWorkFlowInput);
export type WorkflowParsedInputs = z.infer<typeof ZodWorkflowParsedInputs>;

export type WorkflowWithData = Prisma.WorkflowGetPayload<
  typeof workFlowWithData
>;

export type WorkflowWithResponse = Omit<
  Prisma.WorkflowCreateInput,
  "raw_github_data" | "inputs"
> & {
  raw_github_data: WorkflowResponse;
  inputs?: WorkflowParsedInputs;
};

export type URL = string;
export type MenuItem = {
  name: string;
  href: URL;
};
