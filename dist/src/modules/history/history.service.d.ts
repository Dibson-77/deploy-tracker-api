import { PrismaService } from '../../shared/services/prisma.service';
export declare class HistoryService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(projectId?: string): Promise<({
        project: {
            name: string;
            repoFullName: string;
            triggerConfig: import("@prisma/client/runtime/client").JsonValue;
            id: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        projectId: string;
        eventType: string;
        triggerBy: string;
        progress: string | null;
        sentTo: import("@prisma/client/runtime/client").JsonValue;
        content: import("@prisma/client/runtime/client").JsonValue | null;
        status: string;
    })[]>;
    findOne(id: string): Promise<{
        project: {
            name: string;
            repoFullName: string;
            triggerConfig: import("@prisma/client/runtime/client").JsonValue;
            id: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        projectId: string;
        eventType: string;
        triggerBy: string;
        progress: string | null;
        sentTo: import("@prisma/client/runtime/client").JsonValue;
        content: import("@prisma/client/runtime/client").JsonValue | null;
        status: string;
    }>;
}
