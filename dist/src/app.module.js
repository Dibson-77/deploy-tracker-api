"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mailer_1 = require("@nestjs-modules/mailer");
const handlebars_adapter_1 = require("@nestjs-modules/mailer/adapters/handlebars.adapter");
const path_1 = require("path");
const prisma_service_1 = require("./shared/services/prisma.service");
const project_module_1 = require("./modules/project/project.module");
const team_module_1 = require("./modules/team/team.module");
const webhook_module_1 = require("./modules/webhook/webhook.module");
const history_module_1 = require("./modules/history/history.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            mailer_1.MailerModule.forRoot({
                transport: {
                    host: process.env.MAIL_HOST,
                    port: parseInt(process.env.MAIL_PORT) || 587,
                    secure: process.env.MAIL_SECURE === 'true',
                    auth: {
                        user: process.env.MAIL_USER,
                        pass: process.env.MAIL_PASSWORD,
                    },
                },
                defaults: {
                    from: process.env.MAIL_FROM,
                },
                template: {
                    dir: (0, path_1.join)(__dirname, 'modules', 'template', 'templates'),
                    adapter: new handlebars_adapter_1.HandlebarsAdapter(),
                    options: { strict: true },
                },
            }),
            project_module_1.ProjectModule,
            team_module_1.TeamModule,
            webhook_module_1.WebhookModule,
            history_module_1.HistoryModule,
        ],
        providers: [prisma_service_1.PrismaService],
        exports: [prisma_service_1.PrismaService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map