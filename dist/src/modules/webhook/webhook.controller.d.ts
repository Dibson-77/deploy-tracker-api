import type { Request } from 'express';
import { WebhookService } from './webhook.service';
export declare class WebhookController {
    private readonly webhookService;
    constructor(webhookService: WebhookService);
    handleGitHub(eventType: string, signature: string, payload: any, req: Request): Promise<{
        message: string;
    }>;
    manualTrigger(projectId: string, body: {
        message?: string;
        userChanges?: string[];
        progress?: string;
        nextStep?: string;
    }): Promise<{
        message: string;
    }>;
}
