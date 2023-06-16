import React from "react";
import { FaGithub } from "react-icons/fa";

import { trpc } from "utils/trpc";

const InstallHelper = ({}) => {
  const { data: githubAppData, isLoading } =
    trpc.github.githubAppData.useQuery();
  if (isLoading) {
    return null;
  }
  return (
    <a
      type="button"
      href={githubAppData.html_url}
      target="_blank"
      className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
      rel="noreferrer"
    >
      <span className="block text-lg font-semibold text-gray-500">
        You are not connected to GitHub!
      </span>
      <FaGithub className="mr-2 mt-5 inline h-32 w-32 text-gray-400" />
      <span className="mt-2 block text-sm font-medium text-gray-900">
        Click here to connect
      </span>
    </a>
  );
};

export default InstallHelper;
