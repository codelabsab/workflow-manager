export interface Sender {
  id: number;
  url: string;
  type: string;
  login: string;
  node_id: string;
  html_url: string;
  gists_url: string;
  repos_url: string;
  avatar_url: string;
  events_url: string;
  site_admin: boolean;
  gravatar_id: string;
  starred_url: string;
  followers_url: string;
  following_url: string;
  organizations_url: string;
  subscriptions_url: string;
  received_events_url: string;
}

export interface Account {
  id: number;
  url: string;
  type: string;
  login: string;
  node_id: string;
  html_url: string;
  gists_url: string;
  repos_url: string;
  avatar_url: string;
  events_url: string;
  site_admin: boolean;
  gravatar_id: string;
  starred_url: string;
  followers_url: string;
  following_url: string;
  organizations_url: string;
  subscriptions_url: string;
  received_events_url: string;
}

export interface Permissions {
  actions: string;
  contents: string;
  metadata: string;
  workflows: string;
}

export interface Installation {
  id: number;
  app_id: number;
  events: string[];
  account: Account;
  app_slug: string;
  html_url: string;
  target_id: number;
  created_at: Date;
  updated_at: Date;
  permissions: Permissions;
  target_type: string;
  suspended_at?: unknown;
  suspended_by?: unknown;
  repositories_url: string;
  single_file_name?: unknown;
  access_tokens_url: string;
  single_file_paths: unknown[];
  repository_selection: string;
  has_multiple_single_files: boolean;
}

export interface Repository {
  id: number;
  name: string;
  node_id: string;
  private: boolean;
  full_name: string;
}

export default interface InstallationCreateEvent {
  action: string;
  sender: Sender;
  requester?: unknown;
  installation: Installation;
  repositories: Repository[];
}
