import { Module } from '@nestjs/common';
import { TemplateResolverService } from './template-resolver.service';

@Module({
  providers: [TemplateResolverService],
  exports: [TemplateResolverService],
})
export class TemplateModule {}
