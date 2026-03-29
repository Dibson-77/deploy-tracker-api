import { Module } from '@nestjs/common';
import { ContentBuilderService } from './content-builder.service';
import { RdParserService } from './rd-parser.service';

@Module({
  providers: [ContentBuilderService, RdParserService],
  exports: [ContentBuilderService],
})
export class ContentModule {}
