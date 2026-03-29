import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/adapters/handlebars.adapter';
import { join } from 'path';
import { PrismaService } from './shared/services/prisma.service';
import { ProjectModule } from './modules/project/project.module';
import { TeamModule } from './modules/team/team.module';
import { WebhookModule } from './modules/webhook/webhook.module';
import { HistoryModule } from './modules/history/history.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST,
        port: parseInt(process.env.MAIL_PORT as string) || 587,
        secure: process.env.MAIL_SECURE === 'true',
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASSWORD,
        },
      },
      defaults: {
        from: process.env.MAIL_FROM,
      },
      template: {
        dir: join(__dirname, 'modules', 'template', 'templates'),
        adapter: new HandlebarsAdapter(),
        options: { strict: true },
      },
    }),
    ProjectModule,
    TeamModule,
    WebhookModule,
    HistoryModule,
  ],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
