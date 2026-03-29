import { PrismaService } from '../../shared/services/prisma.service';
import { ContentBuilderService } from '../content/content-builder.service';
import { TemplateResolverService } from '../template/template-resolver.service';
import { EmailChannel } from './channels/email.channel';
import { ClassifiedEvent } from '../event/event.dto';
export declare class NotificationService {
    private readonly prisma;
    private readonly contentBuilder;
    private readonly templateResolver;
    private readonly emailChannel;
    private readonly logger;
    constructor(prisma: PrismaService, contentBuilder: ContentBuilderService, templateResolver: TemplateResolverService, emailChannel: EmailChannel);
    process(project: any, event: ClassifiedEvent, rdRawContent?: string): Promise<void>;
    private shouldNotify;
    private notifyTeams;
    private logNotification;
}
