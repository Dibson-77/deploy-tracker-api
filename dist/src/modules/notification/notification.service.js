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
var NotificationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../shared/services/prisma.service");
const content_builder_service_1 = require("../content/content-builder.service");
const template_resolver_service_1 = require("../template/template-resolver.service");
const email_channel_1 = require("./channels/email.channel");
let NotificationService = NotificationService_1 = class NotificationService {
    prisma;
    contentBuilder;
    templateResolver;
    emailChannel;
    logger = new common_1.Logger(NotificationService_1.name);
    constructor(prisma, contentBuilder, templateResolver, emailChannel) {
        this.prisma = prisma;
        this.contentBuilder = contentBuilder;
        this.templateResolver = templateResolver;
        this.emailChannel = emailChannel;
    }
    async process(project, event, rdRawContent) {
        const config = project.triggerConfig;
        if (!this.shouldNotify(event, config)) {
            this.logger.log(`Event ${event.type} skipped for project ${project.name} (config)`);
            return;
        }
        const content = this.contentBuilder.build(event, rdRawContent);
        const allSentTo = [];
        if (config.notifyDev) {
            await this.notifyTeams(project, 'DEV', content, allSentTo);
        }
        if (config.notifyUsers) {
            await this.notifyTeams(project, 'USER', content, allSentTo);
        }
        await this.logNotification(project.id, event, content, allSentTo, 'sent');
    }
    shouldNotify(event, config) {
        switch (event.type) {
            case 'push':
                return (config.onPushBranches ?? []).includes(event.branch ?? '');
            case 'pull_request':
                return config.onPullRequestMerged === true;
            case 'release':
                return config.onRelease === true;
            case 'manual':
                return config.onManual === true;
            default:
                return false;
        }
    }
    async notifyTeams(project, teamType, content, allSentTo) {
        const teams = await this.prisma.team.findMany({
            where: { projectId: project.id, type: teamType },
            include: { members: true },
        });
        const emails = teams.flatMap((t) => t.members.map((m) => m.email));
        if (emails.length === 0)
            return;
        const resolved = teamType === 'DEV'
            ? this.templateResolver.resolveForDev(content)
            : this.templateResolver.resolveForUser(content);
        try {
            await this.emailChannel.send(emails, resolved.subject, resolved.html);
            allSentTo.push(...emails);
        }
        catch (error) {
            this.logger.error(`Failed to notify ${teamType} teams`, error);
            await this.logNotification(project.id, { type: content.eventType, author: content.author }, content, emails, 'failed');
        }
    }
    async logNotification(projectId, event, content, sentTo, status) {
        await this.prisma.notificationLog.create({
            data: {
                projectId,
                eventType: event.type,
                triggerBy: event.author,
                progress: content.progress,
                sentTo: sentTo,
                content: content,
                status,
            },
        });
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = NotificationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        content_builder_service_1.ContentBuilderService,
        template_resolver_service_1.TemplateResolverService,
        email_channel_1.EmailChannel])
], NotificationService);
//# sourceMappingURL=notification.service.js.map