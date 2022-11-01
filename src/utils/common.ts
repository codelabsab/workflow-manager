import _ from "lodash";
import yaml from "yaml";

import type { WorkFlowInput } from "../types/custom";

export function decodeBase64(content: string) {
  const buff = Buffer.from(content, "base64");
  const text = buff.toString("utf-8");
  return text;
}

export function decodeYamlFile(text: string) {
  try {
    const parsed = yaml.parse(text);
    return parsed;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export function parseWorkflowInputs(
  rawWorkflow: string
): WorkFlowInput | undefined {
  const parsed = decodeYamlFile(rawWorkflow);
  if (!parsed) {
    return;
  }

  const inputs = _.get(parsed, "on.workflow_dispatch.inputs");

  return inputs;
}
