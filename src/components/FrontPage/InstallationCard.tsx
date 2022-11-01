import type { Installation } from "@prisma/client";
import React from "react";
import { FaGithub } from "react-icons/fa";

import type InstallationCreateEvent from "types/GithubResponses/InstallationCreateEvent";

type LiProps = {
  name: string;
  value: React.ReactNode;
};
const Li = ({ name, value }: LiProps) => (
  <li className="flex py-1">
    <p className="text-sm font-medium text-gray-900">
      <span className="font-bold">{name}:</span> {value}
    </p>
    <p className="text-sm text-gray-500"></p>
  </li>
);

type InstallationCardProps = {
  installation: Installation;
};

const InstallationCard = ({ installation }: InstallationCardProps) => {
  const json =
    installation.raw_github_create_event as unknown as InstallationCreateEvent;

  return (
    <li
      key={installation.id}
      className="relative flex h-72 flex-col justify-between overflow-hidden rounded-lg border-gray-300 bg-white text-left shadow  duration-200 ease-in hover:shadow-lg"
    >
      <div className=" px-4 py-5 text-lg font-semibold tracking-tight sm:px-6">
        {/* Header goes here */}
        <span className="mr-3 break-words">{json.installation.app_slug}</span>
      </div>
      <div className="flex flex-grow flex-col gap-3 px-4  sm:px-6">
        {/* Content goes here */}
        <ul role="list" className="">
          <Li name="ID" value={json.installation.id} />
          <Li name="Type" value={json.installation.target_type} />
          <Li name="Installed on" value={json.installation.account.login} />
          <Li
            name="Repository Selection"
            value={installation.repository_selection}
          />
        </ul>
      </div>
      <div className="bg-gray-50  px-4 py-5 sm:p-6">
        {/* Content goes here */}
        <a
          href={installation.url}
          target="_blank"
          className="flex items-center text-sm hover:underline"
          rel="noreferrer"
        >
          <FaGithub className="mr-2 h-7 w-7 text-gray-700" /> Configure on
          Github
        </a>
      </div>
    </li>
  );
};

export default InstallationCard;
