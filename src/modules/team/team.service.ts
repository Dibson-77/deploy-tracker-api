import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/services/prisma.service';
import { CreateTeamDto, AddMemberDto } from './dto/create-team.dto';

@Injectable()
export class TeamService {
  constructor(private readonly prisma: PrismaService) {}

  async findByProject(projectId: string) {
    return this.prisma.team.findMany({
      where: { projectId },
      include: { members: true },
    });
  }

  async createTeam(projectId: string, dto: CreateTeamDto) {
    return this.prisma.team.create({
      data: {
        name: dto.name,
        type: dto.type,
        projectId,
      },
      include: { members: true },
    });
  }

  async addMember(teamId: string, dto: AddMemberDto) {
    const team = await this.prisma.team.findUnique({ where: { id: teamId } });
    if (!team) throw new NotFoundException('Team not found');

    return this.prisma.member.create({
      data: {
        name: dto.name,
        email: dto.email,
        role: dto.role ?? 'member',
        teamId,
      },
    });
  }

  async removeMember(teamId: string, memberId: string) {
    const member = await this.prisma.member.findFirst({
      where: { id: memberId, teamId },
    });
    if (!member) throw new NotFoundException('Member not found');
    return this.prisma.member.delete({ where: { id: memberId } });
  }

  async deleteTeam(teamId: string) {
    const team = await this.prisma.team.findUnique({ where: { id: teamId } });
    if (!team) throw new NotFoundException('Team not found');
    return this.prisma.team.delete({ where: { id: teamId } });
  }
}
