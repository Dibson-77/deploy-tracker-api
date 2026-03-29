import { Injectable } from '@nestjs/common';
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
  private templates: Map<string, handlebars.TemplateDelegate> = new Map();

  constructor() {
    this.loadTemplates();
  }

  private loadTemplates() {
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

  resolveForDev(content: NotificationContent): ResolvedEmail {
    const subject = `[${content.project}] ${content.eventType} — ${content.branch ?? 'N/A'} par ${content.author}`;
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
    if (content.commits) {
      html += `<p>Commits (${content.commitCount}) :</p><ul>`;
      for (const c of content.commits) {
        html += `<li>${c.message}</li>`;
      }
      html += '</ul>';
    }
    if (content.filesChanged) html += `<p>Fichiers modifiés : ${content.filesChanged}</p>`;
    if (content.checkpoint) html += `<p>Checkpoint : ${content.checkpoint}</p>`;
    return html;
  }

  private fallbackUserHtml(content: NotificationContent): string {
    let html = `<h2>[${content.project}] Nouvelle mise à jour</h2>`;
    if (content.userMessage) html += `<p>${content.userMessage}</p>`;
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
