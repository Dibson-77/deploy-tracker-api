import { Injectable } from '@nestjs/common';
import { ClassifiedEvent } from '../event/event.dto';
import { RdParserService, RdData } from './rd-parser.service';
import { AiSummaryService, AiSummaryResult } from '../../shared/services/ai-summary.service';

export interface FileGroup {
  folder: string;
  files: string[];
}

export interface NotificationContent {
  project: string;
  eventType: string;
  branch?: string;
  author: string;
  commitCount?: number;
  commits?: Array<{ id: string; message: string; author: string; filesChanged: string[] }>;
  allFilesChanged?: string[];
  filesChangedCount?: number;
  filesGroupedByFolder?: FileGroup[];
  commitSha?: string;
  prTitle?: string;
  prBody?: string | null;
  prNumber?: number;
  releaseTag?: string;
  releaseName?: string | null;
  releaseBody?: string | null;
  // IA
  aiDevSummary?: string;
  aiUserSummary?: string;
  aiImpactLevel?: 'low' | 'medium' | 'high';
  // Rd file
  progress?: string;
  checkpoint?: string;
  nextStep?: string;
  userMessage?: string;
  userChanges?: string[];
}

@Injectable()
export class ContentBuilderService {
  constructor(
    private readonly rdParser: RdParserService,
    private readonly aiSummary: AiSummaryService,
  ) {}

  async build(event: ClassifiedEvent, rdRawContent?: string): Promise<NotificationContent> {
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

    const allFilesArray = Array.from(allFiles);
    const filesGroupedByFolder = this.groupFilesByFolder(allFilesArray);

    // Résumé IA (non-bloquant)
    let aiResult: AiSummaryResult | null = null;
    if (event.commits?.length && allFilesArray.length) {
      aiResult = await this.aiSummary.summarize({
        project: event.repoName,
        branch: event.branch ?? 'main',
        author: event.author,
        eventType: event.type,
        commits: event.commits.map((c) => ({
          message: c.message,
          filesChanged: c.filesChanged,
        })),
        allFiles: allFilesArray,
      });
    }

    return {
      project: event.repoName,
      eventType: event.type,
      branch: event.branch,
      author: event.author,
      commitCount: event.commits?.length,
      commits: event.commits,
      allFilesChanged: allFilesArray.length > 0 ? allFilesArray : undefined,
      filesChangedCount: allFilesArray.length > 0 ? allFilesArray.length : undefined,
      filesGroupedByFolder: filesGroupedByFolder.length > 0 ? filesGroupedByFolder : undefined,
      commitSha: event.commits?.[event.commits.length - 1]?.id,
      prTitle: event.pullRequest?.title,
      prBody: event.pullRequest?.body,
      prNumber: event.pullRequest?.number,
      releaseTag: event.release?.tagName,
      releaseName: event.release?.name,
      releaseBody: event.release?.body,
      aiDevSummary: aiResult?.devSummary,
      aiUserSummary: aiResult?.userSummary,
      aiImpactLevel: aiResult?.impactLevel,
      progress: rdData.progress,
      checkpoint: rdData.checkpoint,
      nextStep: rdData.nextStep,
      userMessage: event.manualMessage ?? rdData.userMessage,
      userChanges: event.userChanges ?? rdData.userChanges,
    };
  }

  private groupFilesByFolder(files: string[]): FileGroup[] {
    const groups = new Map<string, string[]>();

    for (const file of files) {
      const parts = file.split('/');
      const folder = parts.length > 1 ? parts.slice(0, -1).join('/') : '(racine)';
      const fileName = parts[parts.length - 1];
      if (!groups.has(folder)) groups.set(folder, []);
      groups.get(folder)!.push(fileName);
    }

    return Array.from(groups.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([folder, files]) => ({ folder, files }));
  }
}
