import { Injectable, Logger } from '@nestjs/common';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import { NotificationContent } from '../content/content-builder.service';

export interface ResolvedEmail {
  subject: string;
  html: string;
}

@Injectable()
export class TemplateResolverService {
  private readonly logger = new Logger(TemplateResolverService.name);
  private templates: Map<string, handlebars.TemplateDelegate> = new Map();

  constructor() {
    this.registerHelpers();
    this.loadTemplates();
  }

  private registerHelpers() {
    handlebars.registerHelper('eq', (a, b) => a === b);
    handlebars.registerHelper('gt', (a, b) => a > b);
    handlebars.registerHelper('subtract', (a, b) => a - b);
    handlebars.registerHelper('join', (arr: string[], sep: string) =>
      Array.isArray(arr) ? arr.join(sep) : '',
    );
    handlebars.registerHelper('limit', (arr: any[], n: number) =>
      Array.isArray(arr) ? arr.slice(0, n) : [],
    );
  }

  private loadTemplates() {
    const templatesDir = path.join(__dirname, 'templates');
    this.logger.log(`Loading templates from: ${templatesDir}`);
    const files = ['dev', 'user'];
    for (const file of files) {
      const filePath = path.join(templatesDir, `${file}.template.hbs`);
      if (fs.existsSync(filePath)) {
        const source = fs.readFileSync(filePath, 'utf-8');
        this.templates.set(file, handlebars.compile(source));
        this.logger.log(`Template loaded: ${file}`);
      } else {
        this.logger.warn(`Template NOT found: ${filePath}`);
      }
    }
  }

  resolveForDev(content: NotificationContent): ResolvedEmail {
    const impactEmoji = { low: '🟢', medium: '🟡', high: '🔴' }[content.aiImpactLevel ?? 'medium'] ?? '🔵';
    const subject = `${impactEmoji} [${content.project}] ${content.eventType} — ${content.branch ?? 'N/A'} par ${content.author}`;
    const template = this.templates.get('dev');
    const html = template ? template(content) : this.fallbackDevHtml(content);
    return { subject, html };
  }

  resolveForUser(content: NotificationContent): ResolvedEmail {
    const subject = `[${content.project}] Nouvelle mise à jour`;
    const template = this.templates.get('user');
    const html = template ? template(content) : this.fallbackUserHtml(content);
    return { subject, html };
  }

  private fallbackDevHtml(content: NotificationContent): string {
    let html = `<h2>[${content.project}] ${content.eventType} — ${content.branch} par ${content.author}</h2>`;
    if (content.aiDevSummary) html += `<p><strong>Résumé IA :</strong> ${content.aiDevSummary}</p>`;
    if (content.commits) {
      html += `<p>Commits (${content.commitCount}) :</p><ul>`;
      for (const c of content.commits) {
        html += `<li><strong>${c.message}</strong> — ${c.id}<br/>${c.filesChanged.join(', ')}</li>`;
      }
      html += '</ul>';
    }
    if (content.allFilesChanged?.length) {
      html += `<p>Fichiers modifiés : ${content.allFilesChanged.join(', ')}</p>`;
    }
    if (content.checkpoint) html += `<p>Checkpoint : ${content.checkpoint}</p>`;
    return html;
  }

  private fallbackUserHtml(content: NotificationContent): string {
    let html = `<h2>[${content.project}] Nouvelle mise à jour</h2>`;
    if (content.aiUserSummary) html += `<p>${content.aiUserSummary}</p>`;
    else if (content.userMessage) html += `<p>${content.userMessage}</p>`;
    if (content.userChanges?.length) {
      html += '<p>Ce qui change pour vous :</p><ul>';
      for (const change of content.userChanges) {
        html += `<li>${change}</li>`;
      }
      html += '</ul>';
    }
    if (content.progress) html += `<p>Progression : ${content.progress}</p>`;
    if (content.nextStep) html += `<p>Prochaine étape : ${content.nextStep}</p>`;
    return html;
  }
}
