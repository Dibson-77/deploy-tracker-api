import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/services/prisma.service';
import { CreateProjectDto, UpdateTriggerConfigDto } from './dto/create-project.dto';

@Injectable()
export class ProjectService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.project.findMany({
      include: { teams: { include: { members: true } } },
    });
  }

  async findOne(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: { teams: { include: { members: true } } },
    });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async findByRepoFullName(repoFullName: string) {
    return this.prisma.project.findUnique({
      where: { repoFullName },
      include: { teams: { include: { members: true } } },
    });
  }

  async create(dto: CreateProjectDto) {
    const defaultConfig = {
      onPushBranches: ['main'],
      onPullRequestMerged: true,
      onRelease: true,
      onManual: true,
      notifyDev: true,
      notifyUsers: false,
    };
    return this.prisma.project.create({
      data: {
        name: dto.name,
        repoFullName: dto.repoFullName,
        triggerConfig: (dto.triggerConfig ?? defaultConfig) as any,
      },
    });
  }

  async updateTriggerConfig(id: string, dto: UpdateTriggerConfigDto) {
    await this.findOne(id);
    return this.prisma.project.update({
      where: { id },
      data: { triggerConfig: dto.triggerConfig as any },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.project.delete({ where: { id } });
  }
}
