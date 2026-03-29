import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../shared/services/prisma.service';
import { ContentBuilderService, NotificationContent } from '../content/content-builder.service';
import { TemplateResolverService } from '../template/template-resolver.service';
import { EmailChannel } from './channels/email.channel';
import { ClassifiedEvent } from '../event/event.dto';
import { TriggerConfig } from '../project/dto/create-project.dto';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly contentBuilder: ContentBuilderService,
    private readonly templateResolver: TemplateResolverService,
    private readonly emailChannel: EmailChannel,
  ) {}

  async process(
    project: any,
    event: ClassifiedEvent,
    rdRawContent?: string,
  ): Promise<void> {
    const config = project.triggerConfig as TriggerConfig;

    if (!this.shouldNotify(event, config)) {
      this.logger.log(`Event ${event.type} skipped for project ${project.name} (config)`);
      return;
    }

    const content = await this.contentBuilder.build(event, rdRawContent);
    const allSentTo: string[] = [];

    // Notifications DEV — envoi immédiat
    if (config.notifyDev) {
      await this.notifyTeams(project, 'DEV', content, allSentTo);
    }

    // Notifications USER — envoi immédiat ou en attente d'approbation
    if (config.notifyUsers) {
      if (config.requireApprovalForUsers) {
        await this.createPendingApproval(project, event, content);
      } else {
        await this.notifyTeams(project, 'USER', content, allSentTo);
      }
    }

    await this.logNotification(project.id, event, content, allSentTo, 'sent');
  }

  // Appel depuis ApprovalService après validation admin
  async sendPendingNotification(logId: string): Promise<void> {
    const log = await this.prisma.notificationLog.findUnique({
      where: { id: logId },
      include: { project: { include: { teams: { include: { members: true } } } } },
    });

    if (!log || log.status !== 'pending_approval') return;

    const content = log.content as unknown as NotificationContent;
    const emails = log.project.teams
      .filter((t) => t.type === 'USER')
      .flatMap((t) => t.members.map((m) => m.email));

    if (emails.length === 0) return;

    const resolved = this.templateResolver.resolveForUser(content);
    await this.emailChannel.send(emails, resolved.subject, resolved.html);

    await this.prisma.notificationLog.update({
      where: { id: logId },
      data: { status: 'sent', sentTo: emails },
    });

    this.logger.log(`Notification USER envoyée après approbation (log: ${logId})`);
  }

  private async createPendingApproval(
    project: any,
    event: ClassifiedEvent,
    content: NotificationContent,
  ): Promise<void> {
    await this.prisma.notificationLog.create({
      data: {
        projectId: project.id,
        eventType: event.type,
        triggerBy: event.author,
        progress: content.progress,
        sentTo: [],
        content: content as any,
        status: 'pending_approval',
      },
    });
    this.logger.log(`Notification USER mise en attente d'approbation pour ${project.name}`);
  }

  private shouldNotify(event: ClassifiedEvent, config: TriggerConfig): boolean {
    switch (event.type) {
      case 'push':
        return (config.onPushBranches ?? []).includes(event.branch ?? '');
      case 'pull_request':
        return config.onPullRequestMerged === true;
      case 'release':
        return config.onRelease === true;
      case 'manual':
        return config.onManual === true;
      default:
        return false;
    }
  }

  private async notifyTeams(
    project: any,
    teamType: 'DEV' | 'USER',
    content: NotificationContent,
    allSentTo: string[],
  ): Promise<void> {
    const teams = await this.prisma.team.findMany({
      where: { projectId: project.id, type: teamType },
      include: { members: true },
    });

    const emails = teams.flatMap((t) => t.members.map((m) => m.email));
    if (emails.length === 0) return;

    const resolved =
      teamType === 'DEV'
        ? this.templateResolver.resolveForDev(content)
        : this.templateResolver.resolveForUser(content);

    try {
      await this.emailChannel.send(emails, resolved.subject, resolved.html);
      allSentTo.push(...emails);
    } catch (error) {
      this.logger.error(`Failed to notify ${teamType} teams`, error);
      await this.logNotification(
        project.id,
        { type: content.eventType, author: content.author } as any,
        content,
        emails,
        'failed',
      );
    }
  }

  private async logNotification(
    projectId: string,
    event: ClassifiedEvent,
    content: NotificationContent,
    sentTo: string[],
    status: string,
  ): Promise<void> {
    await this.prisma.notificationLog.create({
      data: {
        projectId,
        eventType: event.type,
        triggerBy: event.author,
        progress: content.progress,
        sentTo: sentTo,
        content: content as any,
        status,
      },
    });
  }
}
