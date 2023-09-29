import useFullRepoName from "./useFullRepoName";

import type { MenuItem } from "types/custom";

export default function useGetRepoTabs() {
  const repositoryFullName = useFullRepoName();

  const tabs: MenuItem[] = [
    { name: "Overview", href: `/repository/${repositoryFullName}` },
    {
      name: "Scheduled",
      href: `/repository/${repositoryFullName}/scheduled`,
    },
    {
      name: "History",
      href: `/repository/${repositoryFullName}/history`,
    },
  ];
  return tabs;
}
