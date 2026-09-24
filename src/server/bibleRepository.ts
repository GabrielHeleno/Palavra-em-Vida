import { z } from 'zod';
import initialDatabaseJson from '../data/initialBibleDatabase.json';
import { ScripturePassage, TranslationMetadata, BibleDatabase } from '../types/bible';

export const ScripturePassageSchema = z.object({
  id: z.string().min(3),
  translationId: z.string().min(1),
  book: z.string().min(1),
  bookAbbr: z.string().min(1),
  chapter: z.number().int().positive(),
  verseStart: z.number().int().positive(),
  verseEnd: z.number().int().positive().optional(),
  displayRef: z.string().min(3),
  text: z.string().min(10).max(180, 'O texto da passagem deve ter no máximo 180 caracteres.'),
  themes: z.array(z.string()).min(1),
  dbVersion: z.string().min(1),
  testament: z.enum(['AT', 'NT']),
  isDeuterocanonical: z.boolean().optional(),
});

export function isPassageCompliant(p: { text: string; verseStart: number; verseEnd?: number }): boolean {
  // Limite estrito: no máximo 180 caracteres por passagem.
  if (p.text.length > 180) return false;
  return true;
}

export const TranslationMetadataSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  publisher: z.string().min(1),
  canon: z.string().min(1),
  numberingConvention: z.string().min(1),
  licenseNote: z.string().min(1),
  version: z.string().min(1),
  isLimitedInitialSet: z.boolean(),
  totalPassages: z.number().int().nonnegative(),
});

export const BibleDatabaseSchema = z.object({
  metadata: TranslationMetadataSchema,
  passages: z.array(ScripturePassageSchema).min(1),
});

class BibleRepository {
  private database: BibleDatabase;
  private passageMap: Map<string, ScripturePassage> = new Map();

  constructor() {
    this.database = this.loadInitialDatabase();
    this.indexPassages();
  }

  private loadInitialDatabase(): BibleDatabase {
    try {
      const sanitized = {
        ...initialDatabaseJson,
        passages: initialDatabaseJson.passages.filter((p: any) => p.text && p.text.length <= 180),
      };
      const parsed = BibleDatabaseSchema.parse(sanitized);
      parsed.metadata.totalPassages = parsed.passages.length;
      return parsed as BibleDatabase;
    } catch (err) {
      console.error('Falha ao validar acervo inicial bíblico:', err);
      throw new Error('Acervo bíblico inicial inválido.');
    }
  }

  private indexPassages() {
    this.passageMap.clear();
    for (const p of this.database.passages) {
      this.passageMap.set(p.id, p);
    }
  }

  public getMetadata(): TranslationMetadata {
    return {
      ...this.database.metadata,
      totalPassages: this.database.passages.length,
    };
  }

  public getAllPassages(): ScripturePassage[] {
    return this.database.passages.filter(isPassageCompliant);
  }

  public getPassageById(id: string): ScripturePassage | undefined {
    const p = this.passageMap.get(id);
    return p && isPassageCompliant(p) ? p : undefined;
  }

  public getPassagesByIds(ids: string[]): ScripturePassage[] {
    const list: ScripturePassage[] = [];
    for (const id of ids) {
      const p = this.passageMap.get(id);
      if (p && isPassageCompliant(p)) list.push(p);
    }
    return list;
  }

  public importDatabase(rawJson: unknown): { success: boolean; message: string; count?: number; errors?: string[] } {
    try {
      const parsed = BibleDatabaseSchema.parse(rawJson);
      
      // Validação determinística de duplicatas e regras de tamanho
      const idSet = new Set<string>();
      const passageCoordSet = new Set<string>();
      const errors: string[] = [];

      for (const p of parsed.passages) {
        if (!isPassageCompliant(p)) {
          errors.push(`Passagem ${p.displayRef} excede o limite máximo de 180 caracteres.`);
        }
        if (idSet.has(p.id)) {
          errors.push(`Identificador duplicado encontrado: ${p.id}`);
        }
        idSet.add(p.id);

        const coord = `${p.book}-${p.chapter}-${p.verseStart}-${p.verseEnd || 0}`;
        if (passageCoordSet.has(coord)) {
          errors.push(`Passagem duplicada em referência: ${p.displayRef} (${coord})`);
        }
        passageCoordSet.add(coord);
      }

      if (errors.length > 0) {
        return {
          success: false,
          message: 'Erros de validação na base submetida.',
          errors,
        };
      }

      // Atualiza base em memória
      parsed.metadata.totalPassages = parsed.passages.length;
      this.database = parsed as BibleDatabase;
      this.indexPassages();

      return {
        success: true,
        message: `Acervo importado com sucesso. ${parsed.passages.length} passagens ativas.`,
        count: parsed.passages.length,
      };
    } catch (err: any) {
      return {
        success: false,
        message: 'Estrutura JSON inválida para o acervo bíblico.',
        errors: err.errors ? err.errors.map((e: any) => `${e.path.join('.')}: ${e.message}`) : [err.message],
      };
    }
  }
}

export const bibleRepository = new BibleRepository();
