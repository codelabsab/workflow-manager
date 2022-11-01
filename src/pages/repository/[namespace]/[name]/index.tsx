import { type NextPage } from "next";
import { Fragment, type ReactNode } from "react";

import ALink from "components/ALink";
import Divider from "components/Divider";
import TopLevelHeading from "components/FrontPage/TopLevelHeading";
import Main from "components/Layout/Main";
import WorkflowCard from "components/WorkflowCard";
import useFullRepoName from "hooks/useFullRepoName";
import useGetRepoTabs from "hooks/useGetRepoTabs";
import type { GetRepositoryResponse } from "types/GithubResponses/GetRepository";
import { trpc } from "utils/trpc";

type RowProps = {
  label: ReactNode;
  value: ReactNode;
};
const Row = ({ label, value }: RowProps) => (
  <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
    <dt className="text-sm font-medium text-gray-500">{label}</dt>
    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
      {value}
    </dd>
  </div>
);

const Repository: NextPage = () => {
  const repositoryFullName = useFullRepoName();
  const repository = trpc.github.getRepository.useQuery({
    repositoryFullName: repositoryFullName,
  });

  const tabs = useGetRepoTabs();

  if (repository.isLoading) {
    <>
      <TopLevelHeading tabs={tabs} titleString="Repository" />
    </>;
  }

  return (
    <>
      <TopLevelHeading
        tabs={tabs}
        titleString="Settings"
        subHeader={repositoryFullName}
      />
      <Main>
        <div className="mt-3 overflow-hidden rounded-lg bg-white shadow">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              {repository.data?.name}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Repository details
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              <Row label="Full name" value={repository.data?.full_name} />
              <Row
                label="Private"
                value={repository.data?.private ? "Yes" : "No"}
              />
              <Row label="Owner" value={repository.data?.owner_login} />
              <Row
                label="Workflows total"
                value={repository.data?.workflows.length}
              />
              <Row
                label="Workflows"
                value={
                  <ul className="p divide-y divide-gray-200">
                    {repository.data?.workflows.map((workflow) => (
                      <li className="py-2" key={workflow.id}>
                        <a className="underline" href={`#${workflow.id}`}>
                          {workflow.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                }
              />
              <Row
                label="Default branch"
                value={repository.data?.default_branch}
              />
              <Row
                label="URL"
                value={
                  <ALink
                    url={
                      (
                        repository.data
                          ?.raw_github_data as unknown as GetRepositoryResponse
                      )?.html_url
                    }
                  />
                }
              />
              <Row
                label="Actions URL"
                value={
                  <ALink
                    url={
                      (
                        repository.data
                          ?.raw_github_data as unknown as GetRepositoryResponse
                      )?.html_url + "/actions"
                    }
                  />
                }
              />
            </dl>
          </div>
        </div>
        <Divider>Workflows</Divider>
        {repository.data?.workflows.map((workflow) => (
          <WorkflowCard key={workflow.id} workflow={workflow} />
        ))}
      </Main>
    </>
  );
};

export default Repository;
