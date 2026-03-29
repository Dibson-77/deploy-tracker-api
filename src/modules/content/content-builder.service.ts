import { Injectable } from '@nestjs/common';
import { ClassifiedEvent } from '../event/event.dto';
import { RdParserService, RdData } from './rd-parser.service';

export interface NotificationContent {
  project: string;
  eventType: string;
  branch?: string;
  author: string;
  commitCount?: number;
  commits?: Array<{ id: string; message: string; author: string; filesChanged: string[] }>;
  filesChanged?: string;
  commitSha?: string;
  prTitle?: string;
  prBody?: string | null;
  prNumber?: number;
  releaseTag?: string;
  releaseName?: string | null;
  releaseBody?: string | null;
  progress?: string;
  checkpoint?: string;
  nextStep?: string;
  userMessage?: string;
  userChanges?: string[];
}

@Injectable()
export class ContentBuilderService {
  constructor(private readonly rdParser: RdParserService) {}

  build(event: ClassifiedEvent, rdRawContent?: string): NotificationContent {
    let rdData: RdData = {};
    if (rdRawContent) {
      rdData = this.rdParser.parse(rdRawContent);
    }

    const allFiles = new Set<string>();
    if (event.commits) {
      for (const commit of event.commits) {
        commit.filesChanged.forEach((f) => allFiles.add(f));
      }
    }

    return {
      project: event.repoName,
      eventType: event.type,
      branch: event.branch,
      author: event.author,
      commitCount: event.commits?.length,
      commits: event.commits,
      filesChanged: allFiles.size > 0 ? `${allFiles.size} fichier(s)` : undefined,
      commitSha: event.commits?.[event.commits.length - 1]?.id,
      prTitle: event.pullRequest?.title,
      prBody: event.pullRequest?.body,
      prNumber: event.pullRequest?.number,
      releaseTag: event.release?.tagName,
      releaseName: event.release?.name,
      releaseBody: event.release?.body,
      progress: rdData.progress,
      checkpoint: rdData.checkpoint,
      nextStep: rdData.nextStep,
      userMessage: event.manualMessage ?? rdData.userMessage,
      userChanges: event.userChanges ?? rdData.userChanges,
    };
  }
}
