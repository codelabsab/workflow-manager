import React from "react";

import TopLevelHeading from "components/FrontPage/TopLevelHeading";
import Main from "components/Layout/Main";
import Loading from "components/Loading";
import RoundedDiv from "components/RoundedDiv";
import useFullRepoName from "hooks/useFullRepoName";
import useGetRepoTabs from "hooks/useGetRepoTabs";
import { trpc } from "utils/trpc";

const TABLE_COLUMNS = ["name", "head branch", "updated at", "status", ""];

const Row = ({ children }: { children: React.ReactNode }) => (
  <td className="p-2">{children}</td>
);

const HistoryPage = () => {
  const tabs = useGetRepoTabs();
  const repositoryFullName = useFullRepoName();

  const { data, isLoading } = trpc.github.getRepositoryWorkflowRuns.useQuery(
    {
      repositoryFullName: repositoryFullName,
    },
    { refetchInterval: 5000 }
  );

  if (isLoading) {
    return (
      <>
        <TopLevelHeading tabs={tabs} titleString="Repository" />
        <Main>
          <Loading />
        </Main>
      </>
    );
  }

  if (data?.length === 0) {
    return (
      <>
        <TopLevelHeading tabs={tabs} titleString="Repository" />
        <Main>
          <div>No history found</div>
        </Main>
      </>
    );
  }

  return (
    <>
      <TopLevelHeading
        tabs={tabs}
        titleString="Scheduled Runs"
        subHeader={repositoryFullName}
      />

      <Main>
        <RoundedDiv>
          <div className="flex flex-col gap-4 p-5">
            <h1 className="text-2xl font-semibold tracking-tight">
              Workflow Logs
            </h1>
            <table className="w-full">
              <tr>
                {TABLE_COLUMNS.map((name) => (
                  <th key={name} className="p-2 capitalize">
                    {name}
                  </th>
                ))}
              </tr>

              {data?.map((workflowRun) => (
                <tr key={workflowRun.id} className="odd:bg-gray-100">
                  <Row>{workflowRun.workflow.name}</Row>
                  <Row>{workflowRun.head_branch}</Row>
                  <Row>{workflowRun.updated_at.toISOString()}</Row>
                  <Row>{workflowRun.status}</Row>
                  <Row>
                    <a
                      href={`https://github.com/${repositoryFullName}/actions/runs/${workflowRun.id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:underline"
                    >
                      More info
                    </a>
                  </Row>
                </tr>
              ))}
            </table>
          </div>
        </RoundedDiv>
      </Main>
    </>
  );
};

export default HistoryPage;
