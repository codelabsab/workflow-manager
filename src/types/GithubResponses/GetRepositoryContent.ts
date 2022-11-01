export interface Links {
  git: string;
  self: string;
  html: string;
}

export interface RepositoryContent {
  type: string;
  encoding: string;
  size: number;
  name: string;
  path: string;
  content: string;
  sha: string;
  url: string;
  git_url: string;
  html_url: string;
  download_url: string;
  _links: Links;
}
