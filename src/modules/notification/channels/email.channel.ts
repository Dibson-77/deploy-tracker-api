import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { NotificationChannel } from './channel.interface';

@Injectable()
export class EmailChannel implements NotificationChannel {
  private readonly logger = new Logger(EmailChannel.name);

  constructor(private readonly mailerService: MailerService) {}

  async send(to: string[], subject: string, html: string): Promise<void> {
    for (const email of to) {
      try {
        await this.mailerService.sendMail({
          to: email,
          subject,
          html,
        });
        this.logger.log(`Email sent to ${email}`);
      } catch (error) {
        this.logger.error(`Failed to send email to ${email}`, error);
        throw error;
      }
    }
  }
}
