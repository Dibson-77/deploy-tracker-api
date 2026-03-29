import { Injectable, Logger } from '@nestjs/common';

export interface RdData {
  progress?: string;
  checkpoint?: string;
  nextStep?: string;
  userMessage?: string;
  userChanges?: string[];
}

@Injectable()
export class RdParserService {
  private readonly logger = new Logger(RdParserService.name);

  parse(rawContent: string): RdData {
    try {
      const data: RdData = {};
      const lines = rawContent.split('\n');

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('progress:')) {
          data.progress = trimmed.replace('progress:', '').trim();
        } else if (trimmed.startsWith('checkpoint:')) {
          data.checkpoint = trimmed.replace('checkpoint:', '').trim();
        } else if (trimmed.startsWith('next:')) {
          data.nextStep = trimmed.replace('next:', '').trim();
        } else if (trimmed.startsWith('message:')) {
          data.userMessage = trimmed.replace('message:', '').trim();
        } else if (trimmed.startsWith('- ')) {
          if (!data.userChanges) data.userChanges = [];
          data.userChanges.push(trimmed.replace('- ', ''));
        }
      }

      return data;
    } catch (error) {
      this.logger.warn('Failed to parse Rd file', error);
      return {};
    }
  }
}
