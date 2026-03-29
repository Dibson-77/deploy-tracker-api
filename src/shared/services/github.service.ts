import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GithubService {
  private readonly logger = new Logger(GithubService.name);
  private readonly apiBase = 'https://api.github.com';

  constructor(private readonly configService: ConfigService) {}

  private get token(): string {
    return this.configService.get<string>('GITHUB_TOKEN') ?? '';
  }

  private get webhookUrl(): string {
    return this.configService.get<string>('APP_URL') + '/webhook/github';
  }

  private get webhookSecret(): string {
    return this.configService.get<string>('GITHUB_WEBHOOK_SECRET') ?? '';
  }

  private headers() {
    return {
      Authorization: `Bearer ${this.token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
      'X-GitHub-Api-Version': '2022-11-28',
    };
  }

  async registerWebhook(repoFullName: string): Promise<{ hookId: number }> {
    if (!this.token) {
      throw new BadRequestException('GITHUB_TOKEN non configuré dans .env');
    }

    // Vérifier si un webhook existe déjà pour cette URL
    const existing = await this.findExistingHook(repoFullName);
    if (existing) {
      this.logger.log(`Webhook déjà présent sur ${repoFullName} (id: ${existing})`);
      return { hookId: existing };
    }

    const url = `${this.apiBase}/repos/${repoFullName}/hooks`;
    const body = {
      name: 'web',
      active: true,
      events: ['push', 'pull_request', 'release'],
      config: {
        url: this.webhookUrl,
        content_type: 'json',
        secret: this.webhookSecret,
        insecure_ssl: '0',
      },
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const error = await res.json() as any;
      throw new BadRequestException(
        `GitHub API error: ${error.message ?? res.statusText}`,
      );
    }

    const data = await res.json() as any;
    this.logger.log(`Webhook enregistré sur ${repoFullName} (id: ${data.id})`);
    return { hookId: data.id };
  }

  async deleteWebhook(repoFullName: string, hookId: number): Promise<void> {
    if (!this.token) return;

    const url = `${this.apiBase}/repos/${repoFullName}/hooks/${hookId}`;
    await fetch(url, { method: 'DELETE', headers: this.headers() });
    this.logger.log(`Webhook supprimé sur ${repoFullName} (id: ${hookId})`);
  }

  private async findExistingHook(repoFullName: string): Promise<number | null> {
    const url = `${this.apiBase}/repos/${repoFullName}/hooks`;
    const res = await fetch(url, { headers: this.headers() });
    if (!res.ok) return null;

    const hooks = await res.json() as any[];
    const match = hooks.find(
      (h) => h.config?.url === this.webhookUrl,
    );
    return match ? match.id : null;
  }
}
