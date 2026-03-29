import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../shared/services/prisma.service';
import { GithubService } from '../../shared/services/github.service';
import { CreateProjectDto, UpdateTriggerConfigDto } from './dto/create-project.dto';

@Injectable()
export class ProjectService {
  private readonly logger = new Logger(ProjectService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly github: GithubService,
  ) {}

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

    const project = await this.prisma.project.create({
      data: {
        name: dto.name,
        repoFullName: dto.repoFullName,
        triggerConfig: (dto.triggerConfig ?? defaultConfig) as any,
      },
    });

    // Enregistrement automatique du webhook sur GitHub
    try {
      const { hookId } = await this.github.registerWebhook(dto.repoFullName);
      await this.prisma.project.update({
        where: { id: project.id },
        data: { githubHookId: hookId },
      });
      return { ...project, githubHookId: hookId };
    } catch (error) {
      this.logger.warn(
        `Webhook GitHub non enregistré pour ${dto.repoFullName}: ${error.message}`,
      );
      return project;
    }
  }

  async updateTriggerConfig(id: string, dto: UpdateTriggerConfigDto) {
    await this.findOne(id);
    return this.prisma.project.update({
      where: { id },
      data: { triggerConfig: dto.triggerConfig as any },
    });
  }

  async remove(id: string) {
    const project = await this.findOne(id);

    // Suppression du webhook sur GitHub
    if (project.githubHookId) {
      try {
        await this.github.deleteWebhook(project.repoFullName, project.githubHookId);
      } catch (error) {
        this.logger.warn(`Impossible de supprimer le webhook GitHub: ${error.message}`);
      }
    }

    return this.prisma.project.delete({ where: { id } });
  }
}
