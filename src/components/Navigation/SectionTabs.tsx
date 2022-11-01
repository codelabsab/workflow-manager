import classNames from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

import type { MenuItem } from "types/custom";

type SectionTabsProps = {
  tabs: MenuItem[];
  className?: string;
};

const SectionTabs = ({ tabs, className }: SectionTabsProps) => {
  const router = useRouter();

  console.log("router.pathname", router.asPath);

  return (
    <>
      <div className={classNames(className, "mt-3 sm:mt-4")}>
        <div className="sm:hidden">
          <label htmlFor="current-tab" className="sr-only">
            Select a tab
          </label>
          <select
            id="current-tab"
            name="current-tab"
            className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base  focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
            defaultValue={tabs.find((tab) => router.asPath === tab.href)?.name}
            onChange={(event) => {
              const href = tabs.find(
                (tab) => tab.name === event.target.value
              )?.href;
              router.push(href || "");
            }}
          >
            {tabs.map((tab) => (
              <option key={tab.name}>{tab.name}</option>
            ))}
          </select>
        </div>
        <div className="hidden sm:block">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const isCurrent = router.asPath === tab.href;
              console.log("isCurrent", router.asPath, tab.href);
              return (
                <Link
                  key={tab.name}
                  href={tab.href}
                  className={classNames(
                    isCurrent
                      ? "border-gray-500 font-medium text-gray-600"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                    " whitespace-nowrap border-b-2 px-1 pb-4 text-sm"
                  )}
                  aria-current={isCurrent ? "page" : undefined}
                >
                  {tab.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
};

export default SectionTabs;
