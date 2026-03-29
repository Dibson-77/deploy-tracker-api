import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { EmailChannel } from './channels/email.channel';
import { ContentModule } from '../content/content.module';
import { TemplateModule } from '../template/template.module';

@Module({
  imports: [ContentModule, TemplateModule],
  providers: [NotificationService, EmailChannel],
  exports: [NotificationService],
})
export class NotificationModule {}
