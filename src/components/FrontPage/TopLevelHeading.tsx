import Head from "next/head";
import React from "react";

import PageHeader from "components/Layout/PageHeader";
import type { MenuItem } from "types/custom";

type TopLevelHeadingProps = {
  titleString: string;
  tabs: MenuItem[];
  subHeader?: string;
};

const TopLevelHeading = ({
  titleString,
  tabs,
  subHeader,
}: TopLevelHeadingProps) => {
  return (
    <>
      <Head>
        <title>{titleString}</title>
        <meta name="description" content="Workflow Manger" />
      </Head>
      <PageHeader tabs={tabs} subHeader={subHeader} />
    </>
  );
};

export default TopLevelHeading;
