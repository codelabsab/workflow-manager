import type { Repo, ScheduledWorkflowRun, Workflow } from "@prisma/client";
import Link from "next/link";
import React from "react";
import { BsCalendar3Week } from "react-icons/bs";
import { FaGithub } from "react-icons/fa";
import { IoPlayCircleOutline } from "react-icons/io5";

import type { GetRepositoryResponse } from "types/GithubResponses/GetRepository";

type RepoCardProps = {
  repo: Repo & {
    workflows: (Workflow & { scheduledRuns: ScheduledWorkflowRun[] })[];
  };
};

const RepoCard = ({ repo }: RepoCardProps) => {
  const totalWorkflows = repo.workflows.flatMap(
    (workflow) => workflow.scheduledRuns
  );

  return (
    <li
      key={repo.id}
      className="relative flex h-72 flex-col justify-between overflow-hidden rounded-lg border-gray-300 bg-white text-left shadow  duration-200 ease-in hover:shadow-lg"
    >
      <Link className="h-full" href={`/repository/${repo.full_name}`}>
        <div className=" px-4 py-5 text-lg font-semibold tracking-tight sm:px-6">
          {/* Header goes here */}
          <span className="mr-3 break-words">{repo.full_name}</span>
          {repo.private ? (
            <span className="break-normal rounded-full border border-gray-200 bg-gray-100 px-2 py-0.5 text-xs font-normal text-gray-400">
              Private
            </span>
          ) : null}
        </div>
        <div className="flex flex-grow flex-col gap-3 px-4 py-5 sm:p-6">
          {/* Content goes here */}
          {repo.workflows.length ? (
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-600">
              <IoPlayCircleOutline className="h-6 w-6 " />{" "}
              {repo.workflows.length} workflows
            </div>
          ) : null}
          {totalWorkflows.length ? (
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-600">
              <BsCalendar3Week className="h-5 w-5 " /> {totalWorkflows.length}{" "}
              scheduled runs
              {JSON.stringify(totalWorkflows)}
            </div>
          ) : null}
        </div>
      </Link>
      <div className="bg-gray-50  px-4 py-5 sm:p-6">
        {/* Content goes here */}
        <a
          href={
            (repo.raw_github_data as unknown as GetRepositoryResponse).html_url
          }
          target="_blank"
          className="flex items-center text-sm hover:underline"
          rel="noreferrer"
        >
          <FaGithub className="mr-2 h-7 w-7 text-gray-700" /> Open on Github
        </a>
      </div>
    </li>
  );
};

export default RepoCard;
