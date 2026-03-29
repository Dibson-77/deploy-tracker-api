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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateResolverService = void 0;
const common_1 = require("@nestjs/common");
const handlebars = __importStar(require("handlebars"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
let TemplateResolverService = class TemplateResolverService {
    templates = new Map();
    constructor() {
        this.loadTemplates();
    }
    loadTemplates() {
        const templatesDir = path.join(__dirname, 'templates');
        const files = ['dev', 'user'];
        for (const file of files) {
            const filePath = path.join(templatesDir, `${file}.template.hbs`);
            if (fs.existsSync(filePath)) {
                const source = fs.readFileSync(filePath, 'utf-8');
                this.templates.set(file, handlebars.compile(source));
            }
        }
    }
    resolveForDev(content) {
        const subject = `[${content.project}] ${content.eventType} — ${content.branch ?? 'N/A'} par ${content.author}`;
        const template = this.templates.get('dev');
        const html = template ? template(content) : this.fallbackDevHtml(content);
        return { subject, html };
    }
    resolveForUser(content) {
        const subject = `[${content.project}] Nouvelle mise à jour`;
        const template = this.templates.get('user');
        const html = template ? template(content) : this.fallbackUserHtml(content);
        return { subject, html };
    }
    fallbackDevHtml(content) {
        let html = `<h2>[${content.project}] ${content.eventType} — ${content.branch} par ${content.author}</h2>`;
        if (content.commits) {
            html += `<p>Commits (${content.commitCount}) :</p><ul>`;
            for (const c of content.commits) {
                html += `<li>${c.message}</li>`;
            }
            html += '</ul>';
        }
        if (content.filesChanged)
            html += `<p>Fichiers modifiés : ${content.filesChanged}</p>`;
        if (content.checkpoint)
            html += `<p>Checkpoint : ${content.checkpoint}</p>`;
        return html;
    }
    fallbackUserHtml(content) {
        let html = `<h2>[${content.project}] Nouvelle mise à jour</h2>`;
        if (content.userMessage)
            html += `<p>${content.userMessage}</p>`;
        if (content.userChanges?.length) {
            html += '<p>Ce qui change pour vous :</p><ul>';
            for (const change of content.userChanges) {
                html += `<li>${change}</li>`;
            }
            html += '</ul>';
        }
        if (content.progress)
            html += `<p>Progression : ${content.progress}</p>`;
        if (content.nextStep)
            html += `<p>Prochaine étape : ${content.nextStep}</p>`;
        return html;
    }
};
exports.TemplateResolverService = TemplateResolverService;
exports.TemplateResolverService = TemplateResolverService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], TemplateResolverService);
//# sourceMappingURL=template-resolver.service.js.map