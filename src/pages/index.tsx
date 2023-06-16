import { type NextPage } from "next";
import { useLocalStorage } from "react-use";

import FilterReposSwitch from "components/FrontPage/FilterReposSwitch";
import InstallHelper from "components/FrontPage/InstallHelper";
import RepoCard from "components/FrontPage/RepoCard";
import TopLevelHeading from "components/FrontPage/TopLevelHeading";
import Main from "components/Layout/Main";
import type { MenuItem } from "types/custom";
import { trpc } from "utils/trpc";

const tabs: MenuItem[] = [
  { name: "Overview", href: "/" },
  { name: "Settings", href: "/settings" },
];

const Index: NextPage = () => {
  const { data: installationsData, isLoading } =
    trpc.github.currentUserInstallations.useQuery();
  const [filterWithWorkflows, setFilterWithWorkflows] = useLocalStorage(
    "filterWithWorkflows",
    false
  );
  const { data: repos } = trpc.github.currentUserRepos.useQuery(
    {
      filterWithWorkflows: filterWithWorkflows,
    },
    { keepPreviousData: true }
  );

  const showInstallHelper =
    !isLoading && Boolean(installationsData?.length) === false;

  if (isLoading) {
    <>
      <TopLevelHeading tabs={tabs} titleString="Workflow Manager" />
    </>;
  }

  return (
    <>
      <TopLevelHeading tabs={tabs} titleString="Workflow Manager" />

      <Main>
        {showInstallHelper ? <InstallHelper /> : null}
        {!isLoading && repos?.length ? (
          <>
            <div className="px-3 pt-3">
              <FilterReposSwitch
                checked={filterWithWorkflows}
                setChecked={setFilterWithWorkflows}
              />
            </div>
            <ul className="grid gap-10 sm:grid-cols-2 xl:grid-cols-3">
              {repos
                ? repos.map((repo) => <RepoCard key={repo.id} repo={repo} />)
                : null}
            </ul>
          </>
        ) : null}
      </Main>
    </>
  );
};

export default Index;
