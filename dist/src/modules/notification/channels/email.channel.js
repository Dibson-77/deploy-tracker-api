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
var EmailChannel_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailChannel = void 0;
const common_1 = require("@nestjs/common");
const mailer_1 = require("@nestjs-modules/mailer");
let EmailChannel = EmailChannel_1 = class EmailChannel {
    mailerService;
    logger = new common_1.Logger(EmailChannel_1.name);
    constructor(mailerService) {
        this.mailerService = mailerService;
    }
    async send(to, subject, html) {
        for (const email of to) {
            try {
                await this.mailerService.sendMail({
                    to: email,
                    subject,
                    html,
                });
                this.logger.log(`Email sent to ${email}`);
            }
            catch (error) {
                this.logger.error(`Failed to send email to ${email}`, error);
                throw error;
            }
        }
    }
};
exports.EmailChannel = EmailChannel;
exports.EmailChannel = EmailChannel = EmailChannel_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mailer_1.MailerService])
], EmailChannel);
//# sourceMappingURL=email.channel.js.map