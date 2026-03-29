"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../shared/services/prisma.service");
let TeamService = class TeamService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByProject(projectId) {
        return this.prisma.team.findMany({
            where: { projectId },
            include: { members: true },
        });
    }
    async createTeam(projectId, dto) {
        return this.prisma.team.create({
            data: {
                name: dto.name,
                type: dto.type,
                projectId,
            },
            include: { members: true },
        });
    }
    async addMember(teamId, dto) {
        const team = await this.prisma.team.findUnique({ where: { id: teamId } });
        if (!team)
            throw new common_1.NotFoundException('Team not found');
        return this.prisma.member.create({
            data: {
                name: dto.name,
                email: dto.email,
                role: dto.role ?? 'member',
                teamId,
            },
        });
    }
    async removeMember(teamId, memberId) {
        const member = await this.prisma.member.findFirst({
            where: { id: memberId, teamId },
        });
        if (!member)
            throw new common_1.NotFoundException('Member not found');
        return this.prisma.member.delete({ where: { id: memberId } });
    }
    async deleteTeam(teamId) {
        const team = await this.prisma.team.findUnique({ where: { id: teamId } });
        if (!team)
            throw new common_1.NotFoundException('Team not found');
        return this.prisma.team.delete({ where: { id: teamId } });
    }
};
exports.TeamService = TeamService;
exports.TeamService = TeamService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TeamService);
//# sourceMappingURL=team.service.js.map