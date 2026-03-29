import {
  Controller,
  Post,
  Body,
  Headers,
  Param,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { WebhookService } from './webhook.service';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post('github')
  async handleGitHub(
    @Headers('x-github-event') eventType: string,
    @Headers('x-hub-signature-256') signature: string,
    @Body() payload: any,
    @Req() req: Request,
  ) {
    const rawBody =
      typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    return this.webhookService.handleGitHubWebhook(
      eventType,
      payload,
      signature,
      rawBody,
    );
  }

  @Post('trigger/:projectId')
  async manualTrigger(
    @Param('projectId') projectId: string,
    @Body()
    body: {
      message?: string;
      userChanges?: string[];
      progress?: string;
      nextStep?: string;
    },
  ) {
    return this.webhookService.handleManualTrigger(projectId, body);
  }
}
