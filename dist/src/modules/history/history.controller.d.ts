import { HistoryService } from './history.service';
export declare class HistoryController {
    private readonly historyService;
    constructor(historyService: HistoryService);
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
