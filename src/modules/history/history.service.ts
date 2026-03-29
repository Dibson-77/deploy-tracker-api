import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/services/prisma.service';

@Injectable()
export class HistoryService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(projectId?: string) {
    const where = projectId ? { projectId } : {};
    return this.prisma.notificationLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { project: true },
    });
  }

  async findOne(id: string) {
    const log = await this.prisma.notificationLog.findUnique({
      where: { id },
      include: { project: true },
    });
    if (!log) throw new NotFoundException('Notification log not found');
    return log;
  }
}
