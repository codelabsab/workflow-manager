import classNames from "classnames";
import { type NextPage } from "next";
import { useRouter } from "next/router";

import InstallationCard from "components/FrontPage/InstallationCard";
import InstallHelper from "components/FrontPage/InstallHelper";
import TopLevelHeading from "components/FrontPage/TopLevelHeading";
import Main from "components/Layout/Main";
import type { MenuItem } from "types/custom";
import { trpc } from "utils/trpc";

const tabs: MenuItem[] = [
  { name: "Overview", href: "/" },
  { name: "Settings", href: "/settings" },
];

const navigation: MenuItem[] = [
  { name: "Installations", href: "/settings" },
  { name: "Profile", href: "/settings/profile" },
];

const Settings: NextPage = () => {
  const currentUserInstallations =
    trpc.github.currentUserInstallations.useQuery();
  const githubAppData = trpc.github.githubAppData.useQuery();
  const router = useRouter();

  const isLoading =
    currentUserInstallations.isLoading || githubAppData.isLoading;
  const showInstallHelper =
    !isLoading && Boolean(currentUserInstallations?.data?.length) === false;

  if (isLoading || !currentUserInstallations?.data) {
    <>
      <TopLevelHeading tabs={tabs} titleString="Workflow Manager" />
    </>;
  }

  return (
    <>
      <TopLevelHeading tabs={tabs} titleString="Settings" />
      <Main>
        <div className="block gap-3 sm:flex">
          <nav className="space-y-1 sm:w-1/5" aria-label="Sidebar">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={classNames(
                  router.pathname === item.href
                    ? "bg-gray-200 text-gray-900"
                    : "text-gray-600 hover:bg-gray-200 hover:text-gray-900",
                  "flex items-center rounded-md px-3 py-2 text-sm font-medium"
                )}
                aria-current={
                  router.pathname === item.href ? "page" : undefined
                }
              >
                <span className="truncate">{item.name}</span>
              </a>
            ))}
          </nav>
          <div className="mt-10 flex  flex-grow flex-col gap-6 sm:mt-0">
            {showInstallHelper ? (
              <InstallHelper />
            ) : (
              currentUserInstallations?.data?.map((installation) => (
                <InstallationCard
                  key={installation.id}
                  installation={installation}
                />
              ))
            )}
            {currentUserInstallations?.data?.length ? (
              <div className="flex justify-end">
                <a
                  href={`${githubAppData?.data?.html_url}/installations/new`}
                  type="button"
                  target="_blank"
                  className="items-center rounded border border-transparent bg-gray-500 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  rel="noreferrer"
                >
                  Add Another Installation
                </a>
              </div>
            ) : null}
          </div>
        </div>
      </Main>
    </>
  );
};

export default Settings;
