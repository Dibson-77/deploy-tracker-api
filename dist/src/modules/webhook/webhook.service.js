"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var WebhookService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const crypto = __importStar(require("crypto"));
const event_classifier_service_1 = require("../event/event-classifier.service");
const project_service_1 = require("../project/project.service");
const notification_service_1 = require("../notification/notification.service");
let WebhookService = WebhookService_1 = class WebhookService {
    configService;
    eventClassifier;
    projectService;
    notificationService;
    logger = new common_1.Logger(WebhookService_1.name);
    constructor(configService, eventClassifier, projectService, notificationService) {
        this.configService = configService;
        this.eventClassifier = eventClassifier;
        this.projectService = projectService;
        this.notificationService = notificationService;
    }
    verifySignature(payload, signature) {
        const secret = this.configService.get('GITHUB_WEBHOOK_SECRET');
        if (!secret)
            return true;
        const expected = 'sha256=' +
            crypto.createHmac('sha256', secret).update(payload).digest('hex');
        return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
    }
    async handleGitHubWebhook(eventType, payload, signature, rawBody) {
        if (signature && !this.verifySignature(rawBody, signature)) {
            throw new common_1.UnauthorizedException('Invalid webhook signature');
        }
        const event = this.eventClassifier.classify(eventType, payload);
        if (!event) {
            this.logger.log(`Event type "${eventType}" ignored or not applicable`);
            return { message: 'Event ignored' };
        }
        const project = await this.projectService.findByRepoFullName(event.repoFullName);
        if (!project) {
            this.logger.warn(`No project found for repo: ${event.repoFullName}`);
            return { message: 'No project configured for this repository' };
        }
        await this.notificationService.process(project, event);
        return { message: `Notification processed for ${event.type} event` };
    }
    async handleManualTrigger(projectId, body) {
        const project = await this.projectService.findOne(projectId);
        if (!project) {
            throw new common_1.NotFoundException('Project not found');
        }
        const event = {
            type: 'manual',
            repoFullName: project.repoFullName,
            repoName: project.name,
            author: 'manual',
            manualMessage: body.message,
            userChanges: body.userChanges,
        };
        const rdContent = [
            body.progress ? `progress: ${body.progress}` : '',
            body.nextStep ? `next: ${body.nextStep}` : '',
        ]
            .filter(Boolean)
            .join('\n');
        await this.notificationService.process(project, event, rdContent || undefined);
        return { message: 'Manual notification sent' };
    }
};
exports.WebhookService = WebhookService;
exports.WebhookService = WebhookService = WebhookService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        event_classifier_service_1.EventClassifierService,
        project_service_1.ProjectService,
        notification_service_1.NotificationService])
], WebhookService);
//# sourceMappingURL=webhook.service.js.map