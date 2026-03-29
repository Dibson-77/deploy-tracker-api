import { ClassifiedEvent } from '../event/event.dto';
import { RdParserService } from './rd-parser.service';
export interface NotificationContent {
    project: string;
    eventType: string;
    branch?: string;
    author: string;
    commitCount?: number;
    commits?: Array<{
        id: string;
        message: string;
        author: string;
        filesChanged: string[];
    }>;
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
export declare class ContentBuilderService {
    private readonly rdParser;
    constructor(rdParser: RdParserService);
    build(event: ClassifiedEvent, rdRawContent?: string): NotificationContent;
}
