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
exports.ProjectService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../shared/services/prisma.service");
let ProjectService = class ProjectService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.project.findMany({
            include: { teams: { include: { members: true } } },
        });
    }
    async findOne(id) {
        const project = await this.prisma.project.findUnique({
            where: { id },
            include: { teams: { include: { members: true } } },
        });
        if (!project)
            throw new common_1.NotFoundException('Project not found');
        return project;
    }
    async findByRepoFullName(repoFullName) {
        return this.prisma.project.findUnique({
            where: { repoFullName },
            include: { teams: { include: { members: true } } },
        });
    }
    async create(dto) {
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
                triggerConfig: (dto.triggerConfig ?? defaultConfig),
            },
        });
    }
    async updateTriggerConfig(id, dto) {
        await this.findOne(id);
        return this.prisma.project.update({
            where: { id },
            data: { triggerConfig: dto.triggerConfig },
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.project.delete({ where: { id } });
    }
};
exports.ProjectService = ProjectService;
exports.ProjectService = ProjectService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProjectService);
//# sourceMappingURL=project.service.js.map