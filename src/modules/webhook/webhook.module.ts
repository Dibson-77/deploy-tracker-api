import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
import { EventModule } from '../event/event.module';
import { ProjectModule } from '../project/project.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [EventModule, ProjectModule, NotificationModule],
  controllers: [WebhookController],
  providers: [WebhookService],
})
export class WebhookModule {}
