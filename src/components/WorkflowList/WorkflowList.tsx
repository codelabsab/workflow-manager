import type { Workflow } from "@prisma/client";

import WorkflowComponent from "./WorkflowControls";

type WorkflowListProps = {
  workflows: Workflow[];
};

const WorkflowList = ({ workflows }: WorkflowListProps) => {
  if (!workflows.length) {
    return null;
  }

  return (
    <div className="">
      {workflows.map((workflow) => (
        <WorkflowComponent workflow={workflow} key={workflow.id} />
      ))}
    </div>
  );
};

export default WorkflowList;
