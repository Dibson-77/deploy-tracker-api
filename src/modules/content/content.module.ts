import { Module } from '@nestjs/common';
import { ContentBuilderService } from './content-builder.service';
import { RdParserService } from './rd-parser.service';
import { AiSummaryService } from '../../shared/services/ai-summary.service';

@Module({
  providers: [ContentBuilderService, RdParserService, AiSummaryService],
  exports: [ContentBuilderService],
})
export class ContentModule {}
