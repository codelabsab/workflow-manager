import type { Workflow } from "@prisma/client";
import React from "react";

import WorkflowControls from "./WorkflowList/WorkflowControls";

import ALink from "components/ALink";
import RoundedDiv from "components/RoundedDiv";
import type { GetRepositoryResponse } from "types/GithubResponses/GetRepository";

type WorkflowCardProps = {
  workflow: Workflow;
};

const WorkflowCard = ({ workflow }: WorkflowCardProps) => {
  return (
    <RoundedDiv>
      <div className="sticky top-0 flex items-center justify-between rounded-t-lg border-b bg-white py-3.5 pl-4 pr-4 text-left text-lg font-medium leading-6 text-gray-900 sm:pl-6">
        <div>{workflow.name}</div>
        <div className="flex justify-center text-xs">
          <WorkflowControls workflow={workflow} />
          <ALink
            label="Open on GitHub"
            url={
              (workflow.raw_github_data as unknown as GetRepositoryResponse)
                .html_url
            }
          />
        </div>
      </div>
      <pre className="overflow-hidden overflow-x-scroll rounded-b-lg bg-white py-4 pl-4 pr-4 text-xs font-medium text-gray-900 sm:pl-6">
        {workflow.fileRaw}
      </pre>
    </RoundedDiv>
  );
};

export default WorkflowCard;
