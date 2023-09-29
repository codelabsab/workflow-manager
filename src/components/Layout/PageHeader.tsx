import Link from "next/link";
import React from "react";

import AvatarMenu from "./AvatarMenu";

import SectionTabs from "components/Navigation/SectionTabs";
import type { MenuItem } from "types/custom";

type PageHeaderProps = {
  tabs: MenuItem[];
  subHeader?: string;
};

const PageHeader = ({ tabs, subHeader }: PageHeaderProps) => {
  return (
    <div className="border-b border-slate-200 bg-white px-5 pt-2">
      <div className="container mx-auto">
        <div className="flex items-center justify-between pt-5">
          <div className="flex flex-col items-baseline sm:flex-row sm:gap-4">
            <Link href="/">
              <h1 className="text-xl font-semibold text-gray-900">
                Workflow Manager
              </h1>
            </Link>
            {subHeader ? (
              <h2 className="text-xs font-semibold text-gray-500 sm:text-sm">
                {subHeader}
              </h2>
            ) : null}
          </div>
          <AvatarMenu />
        </div>

        <div className="mt-0 w-full pb-5 sm:mt-5 sm:pb-0">
          <SectionTabs tabs={tabs} className="mt-10 sm:mt-7" />
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
