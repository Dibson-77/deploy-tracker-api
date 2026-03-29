import { ConfigService } from '@nestjs/config';
import { EventClassifierService } from '../event/event-classifier.service';
import { ProjectService } from '../project/project.service';
import { NotificationService } from '../notification/notification.service';
export declare class WebhookService {
    private readonly configService;
    private readonly eventClassifier;
    private readonly projectService;
    private readonly notificationService;
    private readonly logger;
    constructor(configService: ConfigService, eventClassifier: EventClassifierService, projectService: ProjectService, notificationService: NotificationService);
    verifySignature(payload: string, signature: string): boolean;
    handleGitHubWebhook(eventType: string, payload: any, signature: string, rawBody: string): Promise<{
        message: string;
    }>;
    handleManualTrigger(projectId: string, body: {
        message?: string;
        userChanges?: string[];
        progress?: string;
        nextStep?: string;
    }): Promise<{
        message: string;
    }>;
}
