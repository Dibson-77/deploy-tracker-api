export interface GitHubPushEvent {
  ref: string;
  repository: {
    full_name: string;
    name: string;
  };
  pusher: {
    name: string;
    email: string;
  };
  commits: Array<{
    id: string;
    message: string;
    author: { name: string; email: string };
    added: string[];
    removed: string[];
    modified: string[];
  }>;
  head_commit: {
    id: string;
    message: string;
  } | null;
}

export interface GitHubPullRequestEvent {
  action: string;
  pull_request: {
    number: number;
    title: string;
    body: string | null;
    merged: boolean;
    user: { login: string };
    head: { ref: string };
    base: { ref: string };
  };
  repository: {
    full_name: string;
    name: string;
  };
}

export interface GitHubReleaseEvent {
  action: string;
  release: {
    tag_name: string;
    name: string | null;
    body: string | null;
    author: { login: string };
  };
  repository: {
    full_name: string;
    name: string;
  };
}

export type GitHubEventType = 'push' | 'pull_request' | 'release' | 'manual';

export interface ClassifiedEvent {
  type: GitHubEventType;
  repoFullName: string;
  repoName: string;
  branch?: string;
  author: string;
  commits?: Array<{
    id: string;
    message: string;
    author: string;
    filesChanged: string[];
  }>;
  pullRequest?: {
    number: number;
    title: string;
    body: string | null;
    baseBranch: string;
    headBranch: string;
  };
  release?: {
    tagName: string;
    name: string | null;
    body: string | null;
  };
  manualMessage?: string;
  userChanges?: string[];
}
