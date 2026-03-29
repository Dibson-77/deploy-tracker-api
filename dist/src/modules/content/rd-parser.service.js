"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var RdParserService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RdParserService = void 0;
const common_1 = require("@nestjs/common");
let RdParserService = RdParserService_1 = class RdParserService {
    logger = new common_1.Logger(RdParserService_1.name);
    parse(rawContent) {
        try {
            const data = {};
            const lines = rawContent.split('\n');
            for (const line of lines) {
                const trimmed = line.trim();
                if (trimmed.startsWith('progress:')) {
                    data.progress = trimmed.replace('progress:', '').trim();
                }
                else if (trimmed.startsWith('checkpoint:')) {
                    data.checkpoint = trimmed.replace('checkpoint:', '').trim();
                }
                else if (trimmed.startsWith('next:')) {
                    data.nextStep = trimmed.replace('next:', '').trim();
                }
                else if (trimmed.startsWith('message:')) {
                    data.userMessage = trimmed.replace('message:', '').trim();
                }
                else if (trimmed.startsWith('- ')) {
                    if (!data.userChanges)
                        data.userChanges = [];
                    data.userChanges.push(trimmed.replace('- ', ''));
                }
            }
            return data;
        }
        catch (error) {
            this.logger.warn('Failed to parse Rd file', error);
            return {};
        }
    }
};
exports.RdParserService = RdParserService;
exports.RdParserService = RdParserService = RdParserService_1 = __decorate([
    (0, common_1.Injectable)()
], RdParserService);
//# sourceMappingURL=rd-parser.service.js.map