import { Module } from '@nestjs/common';
import { EventClassifierService } from './event-classifier.service';

@Module({
  providers: [EventClassifierService],
  exports: [EventClassifierService],
})
export class EventModule {}
