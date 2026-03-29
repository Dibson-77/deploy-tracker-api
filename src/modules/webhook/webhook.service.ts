import {
  Injectable,
  UnauthorizedException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { EventClassifierService } from '../event/event-classifier.service';
import { ProjectService } from '../project/project.service';
import { NotificationService } from '../notification/notification.service';
import { ClassifiedEvent } from '../event/event.dto';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly eventClassifier: EventClassifierService,
    private readonly projectService: ProjectService,
    private readonly notificationService: NotificationService,
  ) {}

  verifySignature(payload: string, signature: string): boolean {
    const secret = this.configService.get<string>('GITHUB_WEBHOOK_SECRET');
    if (!secret) return true;

    const expected =
      'sha256=' +
      crypto.createHmac('sha256', secret).update(payload).digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expected),
    );
  }

  async handleGitHubWebhook(
    eventType: string,
    payload: any,
    signature: string,
    rawBody: string,
  ): Promise<{ message: string }> {
    if (signature && !this.verifySignature(rawBody, signature)) {
      throw new UnauthorizedException('Invalid webhook signature');
    }

    const event = this.eventClassifier.classify(eventType, payload);
    if (!event) {
      this.logger.log(`Event type "${eventType}" ignored or not applicable`);
      return { message: 'Event ignored' };
    }

    const project = await this.projectService.findByRepoFullName(
      event.repoFullName,
    );
    if (!project) {
      this.logger.warn(`No project found for repo: ${event.repoFullName}`);
      return { message: 'No project configured for this repository' };
    }

    await this.notificationService.process(project, event);
    return { message: `Notification processed for ${event.type} event` };
  }

  async handleManualTrigger(
    projectId: string,
    body: {
      message?: string;
      userChanges?: string[];
      progress?: string;
      nextStep?: string;
    },
  ): Promise<{ message: string }> {
    const project = await this.projectService.findOne(projectId);
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const event: ClassifiedEvent = {
      type: 'manual',
      repoFullName: project.repoFullName,
      repoName: project.name,
      author: 'manual',
      manualMessage: body.message,
      userChanges: body.userChanges,
    };

    const rdContent = [
      body.progress ? `progress: ${body.progress}` : '',
      body.nextStep ? `next: ${body.nextStep}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    await this.notificationService.process(
      project,
      event,
      rdContent || undefined,
    );
    return { message: 'Manual notification sent' };
  }
}
