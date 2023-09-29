import React from "react";

import TopLevelHeading from "components/FrontPage/TopLevelHeading";
import Main from "components/Layout/Main";
import RoundedDiv from "components/RoundedDiv";
import useFullRepoName from "hooks/useFullRepoName";
import useGetRepoTabs from "hooks/useGetRepoTabs";
import { trpc } from "utils/trpc";

const HistoryPage = () => {
  const tabs = useGetRepoTabs();
  const repositoryFullName = useFullRepoName();

  const { data, isLoading } = trpc.github.getRepositoryWorkflowRuns.useQuery({
    repositoryFullName: repositoryFullName,
  });

  if (isLoading) {
    return <>Loading</>;
  }

  return (
    <>
      <TopLevelHeading tabs={tabs} titleString="Scheduled Runs" />

      <Main>
        <RoundedDiv>
          <div className="p-5">
            <h1 className="text-lg font-bold tracking-tight">Workflow Logs</h1>
            <div>
              {data?.map((workflowRun) => (
                <div key={workflowRun.id}>
                  {workflowRun.workflow.name}
                  {workflowRun.created_at.toISOString()} {workflowRun.status}{" "}
                  {workflowRun.conclusion}
                </div>
              ))}
            </div>
          </div>
        </RoundedDiv>
      </Main>
    </>
  );
};

export default HistoryPage;
