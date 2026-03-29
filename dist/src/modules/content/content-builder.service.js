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
exports.ContentBuilderService = void 0;
const common_1 = require("@nestjs/common");
const rd_parser_service_1 = require("./rd-parser.service");
let ContentBuilderService = class ContentBuilderService {
    rdParser;
    constructor(rdParser) {
        this.rdParser = rdParser;
    }
    build(event, rdRawContent) {
        let rdData = {};
        if (rdRawContent) {
            rdData = this.rdParser.parse(rdRawContent);
        }
        const allFiles = new Set();
        if (event.commits) {
            for (const commit of event.commits) {
                commit.filesChanged.forEach((f) => allFiles.add(f));
            }
        }
        return {
            project: event.repoName,
            eventType: event.type,
            branch: event.branch,
            author: event.author,
            commitCount: event.commits?.length,
            commits: event.commits,
            filesChanged: allFiles.size > 0 ? `${allFiles.size} fichier(s)` : undefined,
            commitSha: event.commits?.[event.commits.length - 1]?.id,
            prTitle: event.pullRequest?.title,
            prBody: event.pullRequest?.body,
            prNumber: event.pullRequest?.number,
            releaseTag: event.release?.tagName,
            releaseName: event.release?.name,
            releaseBody: event.release?.body,
            progress: rdData.progress,
            checkpoint: rdData.checkpoint,
            nextStep: rdData.nextStep,
            userMessage: event.manualMessage ?? rdData.userMessage,
            userChanges: event.userChanges ?? rdData.userChanges,
        };
    }
};
exports.ContentBuilderService = ContentBuilderService;
exports.ContentBuilderService = ContentBuilderService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [rd_parser_service_1.RdParserService])
], ContentBuilderService);
//# sourceMappingURL=content-builder.service.js.map