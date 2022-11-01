export interface WorkflowResponse {
  id: number;
  url: string;
  name: string;
  path: string;
  state: string;
  node_id: string;
  html_url: string;
  badge_url: string;
  created_at: Date;
  updated_at: Date;
}
