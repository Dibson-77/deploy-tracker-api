import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../shared/services/prisma.service';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class ApprovalService {
  private readonly logger = new Logger(ApprovalService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  async approve(logId: string): Promise<{ message: string }> {
    const log = await this.prisma.notificationLog.findUnique({ where: { id: logId } });

    if (!log) {
      throw new NotFoundException(`Notification log ${logId} not found`);
    }

    if (log.status !== 'pending_approval') {
      throw new BadRequestException(`Log ${logId} is not pending approval (status: ${log.status})`);
    }

    await this.notificationService.sendPendingNotification(logId);
    this.logger.log(`Notification ${logId} approved and sent`);

    return { message: `Notification approved and sent successfully` };
  }

  async reject(logId: string): Promise<{ message: string }> {
    const log = await this.prisma.notificationLog.findUnique({ where: { id: logId } });

    if (!log) {
      throw new NotFoundException(`Notification log ${logId} not found`);
    }

    if (log.status !== 'pending_approval') {
      throw new BadRequestException(`Log ${logId} is not pending approval (status: ${log.status})`);
    }

    await this.prisma.notificationLog.update({
      where: { id: logId },
      data: { status: 'rejected' },
    });

    this.logger.log(`Notification ${logId} rejected`);
    return { message: `Notification rejected` };
  }

  async listPending() {
    return this.prisma.notificationLog.findMany({
      where: { status: 'pending_approval' },
      include: { project: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }
}
