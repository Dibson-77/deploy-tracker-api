import { PrismaService } from '../../shared/services/prisma.service';
import { CreateProjectDto, UpdateTriggerConfigDto } from './dto/create-project.dto';
export declare class ProjectService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<({
        teams: ({
            members: {
                name: string;
                id: string;
                email: string;
                role: string;
                teamId: string;
            }[];
        } & {
            name: string;
            id: string;
            createdAt: Date;
            type: import("@prisma/client").$Enums.TeamType;
            projectId: string;
        })[];
    } & {
        name: string;
        repoFullName: string;
        triggerConfig: import("@prisma/client/runtime/client").JsonValue;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findOne(id: string): Promise<{
        teams: ({
            members: {
                name: string;
                id: string;
                email: string;
                role: string;
                teamId: string;
            }[];
        } & {
            name: string;
            id: string;
            createdAt: Date;
            type: import("@prisma/client").$Enums.TeamType;
            projectId: string;
        })[];
    } & {
        name: string;
        repoFullName: string;
        triggerConfig: import("@prisma/client/runtime/client").JsonValue;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findByRepoFullName(repoFullName: string): Promise<({
        teams: ({
            members: {
                name: string;
                id: string;
                email: string;
                role: string;
                teamId: string;
            }[];
        } & {
            name: string;
            id: string;
            createdAt: Date;
            type: import("@prisma/client").$Enums.TeamType;
            projectId: string;
        })[];
    } & {
        name: string;
        repoFullName: string;
        triggerConfig: import("@prisma/client/runtime/client").JsonValue;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
    create(dto: CreateProjectDto): Promise<{
        name: string;
        repoFullName: string;
        triggerConfig: import("@prisma/client/runtime/client").JsonValue;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateTriggerConfig(id: string, dto: UpdateTriggerConfigDto): Promise<{
        name: string;
        repoFullName: string;
        triggerConfig: import("@prisma/client/runtime/client").JsonValue;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        name: string;
        repoFullName: string;
        triggerConfig: import("@prisma/client/runtime/client").JsonValue;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
