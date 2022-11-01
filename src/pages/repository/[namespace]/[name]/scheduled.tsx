import { type NextPage } from "next";

import TopLevelHeading from "components/FrontPage/TopLevelHeading";
import Main from "components/Layout/Main";
import useFullRepoName from "hooks/useFullRepoName";
import useGetRepoTabs from "hooks/useGetRepoTabs";
import { trpc } from "utils/trpc";

const SchedueldRuns: NextPage = () => {
  const repositoryFullName = useFullRepoName();
  const repository = trpc.github.getRepository.useQuery({
    repositoryFullName: repositoryFullName,
  });

  const tabs = useGetRepoTabs();

  if (repository.isLoading) {
    <>
      <TopLevelHeading tabs={tabs} titleString="Scheduled Runs" />
    </>;
  }

  return (
    <>
      <TopLevelHeading tabs={tabs} titleString="Scheduled Runs" />

      <Main>
        <div className="h-72 border border-gray-700">Schedule new form</div>
        <div className="h-72 border border-gray-700">
          Table with scheduled runs
        </div>
      </Main>
    </>
  );
};

export default SchedueldRuns;
