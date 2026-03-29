import { NotificationContent } from '../content/content-builder.service';
export interface ResolvedEmail {
    subject: string;
    html: string;
}
export declare class TemplateResolverService {
    private templates;
    constructor();
    private loadTemplates;
    resolveForDev(content: NotificationContent): ResolvedEmail;
    resolveForUser(content: NotificationContent): ResolvedEmail;
    private fallbackDevHtml;
    private fallbackUserHtml;
}
