import { GoogleGenAI, Type } from '@google/genai';
import { z } from 'zod';
import { ScripturePassage } from '../types/bible';
import { fullBibleService } from './fullBibleService';

const PASTORAL_SELECTION_INSTRUCTIONS = `Você é um orientador e exegeta bíblico católico experiente.
Você possui conhecimento profundo de todo o cânon bíblico católico de 73 livros (Bíblia de Jerusalém: Antigo e Novo Testamento, incluindo os livros deuterocanônicos como Sabedoria, Eclesiástico, Tobias, Judite, Baruc, 1 e 2 Macabeus).

DIRETRIZES DE SELEÇÃO DINÂMICA:
1. Pertinência e Beleza Temática:
   - Selecione os versículos que melhor expressam, iluminam e consolam o coração dos fiéis a respeito do(s) tema(s) ou intenção pastoral solicitada.
   - Liberdade Canônica Total: NÃO há necessidade de impor cotas ou divisão obrigatória por classes de livros. Escolha as passagens onde quer que o tema ressoe com maior verdade, beleza e força espiritual (sejam mais dos Evangelhos, Salmos, Epístolas, Profetas ou Sapienciais).
   
2. Formato e Dimensões:
   - Cada texto bíblico DEVE ter NO MÁXIMO 180 caracteres.
   - O versículo deve ter sentido autônomo, claro e oracional.
   - Forneça a referência bíblica exata no formato usual em português (ex.: "Sl 23, 1", "Jo 14, 27", "Rm 8, 28", "Is 41, 10", "1Cor 13, 4-7", "Sb 3, 1-3", "Mt 11, 28").

3. Quantidade:
   - Retorne exatamente 12 passagens principais (selectedPassages).
   - Retorne até 6 passagens alternativas (alternatePassages).`;

const PassageItemSchema = z.object({
  book: z.string(),
  chapter: z.number().int(),
  verseStart: z.number().int(),
  verseEnd: z.number().int().optional(),
  displayRef: z.string(),
  text: z.string(),
  pastoralContext: z.string().optional(),
  themes: z.array(z.string()).default([]),
});

const FullBibleSelectionSchema = z.object({
  status: z.enum(['ok', 'insufficient_candidates']).default('ok'),
  selectedPassages: z.array(PassageItemSchema).min(1),
  alternatePassages: z.array(PassageItemSchema).default([]),
  uncoveredThemes: z.array(z.string()).default([]),
});

export interface GeminiSelectionResult {
  selectedPassages: ScripturePassage[];
  alternatePassages: ScripturePassage[];
  uncoveredThemes: string[];
}

export class GeminiSelectionService {
  private ai: GoogleGenAI | null = null;
  private modelName = process.env.GEMINI_MODEL || 'gemini-3.8-flash';

  private getAi(): GoogleGenAI {
    const apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.API_KEY ||
      process.env.GOOGLE_API_KEY ||
      process.env.VITE_GEMINI_API_KEY;

    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      throw new Error(
        'A chave da API do Gemini (GEMINI_API_KEY) não está configurada no ambiente. Adicione a variável GEMINI_API_KEY nas Configurações/Secrets do projeto para ativar o discernimento da IA.'
      );
    }
    if (!this.ai) {
      this.ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    }
    return this.ai;
  }

  public isConfigured(): boolean {
    const apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.API_KEY ||
      process.env.GOOGLE_API_KEY ||
      process.env.VITE_GEMINI_API_KEY;

    return !!apiKey && apiKey !== 'MY_GEMINI_API_KEY';
  }

  /**
   * Seleciona dinamicamente as 12 melhores passagens bíblicas para o tema solicitado
   * em todo o cânon de 73 livros sem cotas rígidas.
   */
  public async selectFromFullBible(
    themes: string[],
    pastoralGuidance?: string,
    lockedPassages: ScripturePassage[] = []
  ): Promise<GeminiSelectionResult> {
    const ai = this.getAi();

    const cleanThemes = themes.length > 0 ? themes : ['Palavra de Deus para o coração'];
    const lockedPrompt = lockedPassages.map(p => ({
      displayRef: p.displayRef,
      text: p.text,
      book: p.book,
      chapter: p.chapter,
      verseStart: p.verseStart,
      verseEnd: p.verseEnd,
    }));

    const promptText = `Selecione 12 passagens bíblicas ideais e tocantes para o seguinte tema:

TEMA(S) PASTORAL(IS): ${cleanThemes.join(' | ')}
${pastoralGuidance ? `ORIENTAÇÃO PASTORAL ADICIONAL: ${pastoralGuidance}` : ''}
${lockedPrompt.length > 0 ? `Passagens já fixadas:\n${JSON.stringify(lockedPrompt, null, 2)}` : ''}

INSTRUÇÕES:
1. Selecione de forma 100% dinâmica as 12 melhores passagens de todo o cânon bíblico católico de 73 livros (sem obrigatoriedade de cotas fixas entre livros; priorize a pertinência e profundidade espiritual para o tema).
2. Cada passagem deve ter no máximo 180 caracteres e sentido pleno.
3. Forneça também 6 passagens alternativas.`;

    const response = await ai.models.generateContent({
      model: this.modelName,
      contents: promptText,
      config: {
        systemInstruction: PASTORAL_SELECTION_INSTRUCTIONS,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            status: {
              type: Type.STRING,
              description: "Deve ser 'ok'",
            },
            selectedPassages: {
              type: Type.ARRAY,
              description: "Lista de 12 passagens bíblicas selecionadas dinamicamente.",
              items: {
                type: Type.OBJECT,
                properties: {
                  book: { type: Type.STRING, description: "Nome do livro bíblico em português (ex: Salmos, Lucas, Isaías, Filipenses, Sabedoria)" },
                  chapter: { type: Type.INTEGER, description: "Número do capítulo" },
                  verseStart: { type: Type.INTEGER, description: "Versículo inicial" },
                  verseEnd: { type: Type.INTEGER, description: "Versículo final (opcional)" },
                  displayRef: { type: Type.STRING, description: "Referência formatada (ex: Sl 23, 1 ou Jo 14, 27)" },
                  text: { type: Type.STRING, description: "Texto bíblico da passagem (até 180 caracteres)" },
                  pastoralContext: { type: Type.STRING, description: "Breve comentário pastoral sobre a passagem" },
                  themes: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Temas pastorais relacionados" },
                },
                required: ['book', 'chapter', 'verseStart', 'displayRef', 'text'],
              },
            },
            alternatePassages: {
              type: Type.ARRAY,
              description: "Até 6 passagens bíblicas alternativas.",
              items: {
                type: Type.OBJECT,
                properties: {
                  book: { type: Type.STRING },
                  chapter: { type: Type.INTEGER },
                  verseStart: { type: Type.INTEGER },
                  verseEnd: { type: Type.INTEGER },
                  displayRef: { type: Type.STRING },
                  text: { type: Type.STRING },
                  pastoralContext: { type: Type.STRING },
                  themes: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ['book', 'chapter', 'verseStart', 'displayRef', 'text'],
              },
            },
            uncoveredThemes: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ['status', 'selectedPassages', 'alternatePassages'],
        },
      },
    });

    const rawText = response.text?.trim() || '';
    if (!rawText) {
      throw new Error('O modelo Gemini retornou uma resposta vazia.');
    }

    const parsedJson = JSON.parse(rawText);
    const validated = FullBibleSelectionSchema.parse(parsedJson);

    const validSelected: ScripturePassage[] = [];
    const usedRefs = new Set<string>();

    for (const locked of lockedPassages) {
      validSelected.push(locked);
      usedRefs.add(locked.id);
    }

    for (const item of validated.selectedPassages) {
      if (validSelected.length >= 12) break;
      const passage = fullBibleService.createScripturePassage(
        item.book,
        item.chapter,
        item.verseStart,
        item.verseEnd,
        item.text,
        item.themes
      );

      if (item.pastoralContext) {
        passage.pastoralContext = item.pastoralContext;
      }

      if (!usedRefs.has(passage.id)) {
        validSelected.push(passage);
        usedRefs.add(passage.id);
      }
    }

    const validAlternates: ScripturePassage[] = [];
    for (const item of validated.alternatePassages) {
      if (validAlternates.length >= 6) break;
      const passage = fullBibleService.createScripturePassage(
        item.book,
        item.chapter,
        item.verseStart,
        item.verseEnd,
        item.text,
        item.themes
      );

      if (item.pastoralContext) {
        passage.pastoralContext = item.pastoralContext;
      }

      if (!usedRefs.has(passage.id)) {
        validAlternates.push(passage);
        usedRefs.add(passage.id);
      }
    }

    return {
      selectedPassages: validSelected,
      alternatePassages: validAlternates,
      uncoveredThemes: validated.uncoveredThemes,
    };
  }
}

export const geminiService = new GeminiSelectionService();
