"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventClassifierService = void 0;
const common_1 = require("@nestjs/common");
let EventClassifierService = class EventClassifierService {
    classify(eventType, payload) {
        switch (eventType) {
            case 'push':
                return this.classifyPush(payload);
            case 'pull_request':
                return this.classifyPullRequest(payload);
            case 'release':
                return this.classifyRelease(payload);
            default:
                return null;
        }
    }
    classifyPush(payload) {
        const branch = payload.ref.replace('refs/heads/', '');
        return {
            type: 'push',
            repoFullName: payload.repository.full_name,
            repoName: payload.repository.name,
            branch,
            author: payload.pusher.name,
            commits: payload.commits.map((c) => ({
                id: c.id.substring(0, 7),
                message: c.message,
                author: c.author.name,
                filesChanged: [...c.added, ...c.modified, ...c.removed],
            })),
        };
    }
    classifyPullRequest(payload) {
        if (payload.action !== 'closed' || !payload.pull_request.merged) {
            return null;
        }
        return {
            type: 'pull_request',
            repoFullName: payload.repository.full_name,
            repoName: payload.repository.name,
            branch: payload.pull_request.base.ref,
            author: payload.pull_request.user.login,
            pullRequest: {
                number: payload.pull_request.number,
                title: payload.pull_request.title,
                body: payload.pull_request.body,
                baseBranch: payload.pull_request.base.ref,
                headBranch: payload.pull_request.head.ref,
            },
        };
    }
    classifyRelease(payload) {
        if (payload.action !== 'published')
            return null;
        return {
            type: 'release',
            repoFullName: payload.repository.full_name,
            repoName: payload.repository.name,
            author: payload.release.author.login,
            release: {
                tagName: payload.release.tag_name,
                name: payload.release.name,
                body: payload.release.body,
            },
        };
    }
};
exports.EventClassifierService = EventClassifierService;
exports.EventClassifierService = EventClassifierService = __decorate([
    (0, common_1.Injectable)()
], EventClassifierService);
//# sourceMappingURL=event-classifier.service.js.map