import { MailerService } from '@nestjs-modules/mailer';
import { NotificationChannel } from './channel.interface';
export declare class EmailChannel implements NotificationChannel {
    private readonly mailerService;
    private readonly logger;
    constructor(mailerService: MailerService);
    send(to: string[], subject: string, html: string): Promise<void>;
}
