import { Injectable } from '@nestjs/common';
import {
  ClassifiedEvent,
  GitHubPushEvent,
  GitHubPullRequestEvent,
  GitHubReleaseEvent,
} from './event.dto';

@Injectable()
export class EventClassifierService {
  classify(eventType: string, payload: any): ClassifiedEvent | null {
    switch (eventType) {
      case 'push':
        return this.classifyPush(payload as GitHubPushEvent);
      case 'pull_request':
        return this.classifyPullRequest(payload as GitHubPullRequestEvent);
      case 'release':
        return this.classifyRelease(payload as GitHubReleaseEvent);
      default:
        return null;
    }
  }

  private classifyPush(payload: GitHubPushEvent): ClassifiedEvent {
    const branch = payload.ref.replace('refs/heads/', '');
    return {
      type: 'push',
      repoFullName: payload.repository.full_name,
      repoName: payload.repository.name,
      branch,
      author: payload.pusher.name,
      commits: payload.commits.map((c) => ({
        id: c.id.substring(0, 7),
        message: c.message,
        author: c.author.name,
        filesChanged: [...c.added, ...c.modified, ...c.removed],
      })),
    };
  }

  private classifyPullRequest(
    payload: GitHubPullRequestEvent,
  ): ClassifiedEvent | null {
    if (payload.action !== 'closed' || !payload.pull_request.merged) {
      return null;
    }
    return {
      type: 'pull_request',
      repoFullName: payload.repository.full_name,
      repoName: payload.repository.name,
      branch: payload.pull_request.base.ref,
      author: payload.pull_request.user.login,
      pullRequest: {
        number: payload.pull_request.number,
        title: payload.pull_request.title,
        body: payload.pull_request.body,
        baseBranch: payload.pull_request.base.ref,
        headBranch: payload.pull_request.head.ref,
      },
    };
  }

  private classifyRelease(payload: GitHubReleaseEvent): ClassifiedEvent | null {
    if (payload.action !== 'published') return null;
    return {
      type: 'release',
      repoFullName: payload.repository.full_name,
      repoName: payload.repository.name,
      author: payload.release.author.login,
      release: {
        tagName: payload.release.tag_name,
        name: payload.release.name,
        body: payload.release.body,
      },
    };
  }
}
