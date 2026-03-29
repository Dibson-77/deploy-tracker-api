import { Injectable, Logger } from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';

export interface AiSummaryResult {
  devSummary: string;
  userSummary: string;
  impactLevel: 'low' | 'medium' | 'high';
}

@Injectable()
export class AiSummaryService {
  private readonly logger = new Logger(AiSummaryService.name);
  private client: Anthropic | null = null;

  constructor() {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (apiKey) {
      this.client = new Anthropic({ apiKey });
    }
  }

  async summarize(data: {
    project: string;
    branch: string;
    author: string;
    eventType: string;
    commits: Array<{ message: string; filesChanged: string[] }>;
    allFiles: string[];
  }): Promise<AiSummaryResult | null> {
    if (!this.client) {
      this.logger.warn('ANTHROPIC_API_KEY non défini — résumé IA désactivé');
      return null;
    }

    try {
      const prompt = this.buildPrompt(data);
      const response = await this.client.messages.create({
        model: 'claude-haiku-4-5',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }],
      });

      const text = response.content
        .filter((b) => b.type === 'text')
        .map((b) => (b as any).text)
        .join('');

      return this.parseResponse(text);
    } catch (error) {
      this.logger.error('Erreur résumé IA', error);
      return null;
    }
  }

  private buildPrompt(data: {
    project: string;
    branch: string;
    author: string;
    eventType: string;
    commits: Array<{ message: string; filesChanged: string[] }>;
    allFiles: string[];
  }): string {
    const commitsList = data.commits
      .map((c) => `- ${c.message} (${c.filesChanged.length} fichier(s))`)
      .join('\n');

    const filesSample = data.allFiles.slice(0, 20).join(', ');

    return `Tu es un assistant technique. Analyse ce déploiement Git et génère deux résumés en français.

Projet: ${data.project}
Branche: ${data.branch}
Auteur: ${data.author}
Type: ${data.eventType}

Commits:
${commitsList}

Fichiers modifiés (${data.allFiles.length} total): ${filesSample}${data.allFiles.length > 20 ? '...' : ''}

Génère exactement ce format JSON (sans markdown) :
{
  "devSummary": "Résumé technique en 2-3 phrases max pour les développeurs. Mentionne les modules impactés, le type de changement (feature/fix/refactor), et les risques potentiels.",
  "userSummary": "Résumé non-technique en 1-2 phrases pour les utilisateurs finaux. Décris ce qui change dans l'application sans jargon technique.",
  "impactLevel": "low|medium|high"
}`;
  }

  private parseResponse(text: string): AiSummaryResult {
    try {
      const cleaned = text.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      return {
        devSummary: parsed.devSummary ?? '',
        userSummary: parsed.userSummary ?? '',
        impactLevel: parsed.impactLevel ?? 'medium',
      };
    } catch {
      return {
        devSummary: text.slice(0, 200),
        userSummary: '',
        impactLevel: 'medium',
      };
    }
  }
}
