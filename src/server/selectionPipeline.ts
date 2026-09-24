import { z } from 'zod';
import { geminiService } from './geminiService';
import { cacheService } from './cacheService';
import { deterministicEngine } from './deterministicEngine';
import { SelectionResponse, ScripturePassage } from '../types/bible';

const RequestSchema = z.object({
  themes: z.array(z.string()).max(10).default([]),
  pastoralGuidance: z.string().max(300).optional(),
  lockedPassageIds: z.array(z.string()).max(11).optional(),
  useAi: z.boolean().optional().default(false),
});

export async function processSelection(rawInput: unknown): Promise<SelectionResponse> {
  const startTime = Date.now();
  const modelName = process.env.GEMINI_MODEL || 'gemini-3.8-flash';

  // 1. Validação dos dados de entrada
  const parseResult = RequestSchema.safeParse(rawInput);
  if (!parseResult.success) {
    return {
      status: 'error',
      selectedPassages: [],
      alternatePassages: [],
      uncoveredThemes: [],
      message: 'Dados de solicitação inválidos: ' + parseResult.error.issues.map(i => i.message).join(', '),
      meta: {
        cacheHit: false,
        processingTimeMs: Date.now() - startTime,
        translationName: 'Bíblia Ave Maria / Jerusalém (Cânon Integral)',
        translationId: 'BJ-FULL',
        dbVersion: '2.0.0-deterministic-catalog',
        totalCandidatesEvaluated: 300,
        selectionEngine: 'deterministic',
      },
    };
  }

  const { themes, pastoralGuidance, lockedPassageIds = [], useAi = false } = parseResult.data;

  // Constrói termo de busca unificado
  const searchQuery = [
    ...themes,
    pastoralGuidance || '',
  ].filter(Boolean).join(' ').trim();

  // 2. Execução Determinística Prioritária (Catálogo de 300 Temas Pastorais)
  if (!useAi) {
    const matchedTheme = deterministicEngine.matchTheme(searchQuery);

    if (matchedTheme) {
      const resolvedPassages = deterministicEngine.resolvePassages(matchedTheme);
      return {
        status: 'ok',
        selectedPassages: resolvedPassages,
        alternatePassages: [],
        uncoveredThemes: [],
        message: `Tema canônico identificado: ${matchedTheme.name} (${matchedTheme.groupName}).`,
        meta: {
          cacheHit: true,
          processingTimeMs: Date.now() - startTime,
          translationName: 'Bíblia Sagrada Católica (Cânon Integral)',
          translationId: 'CATOLICA-INTEGRAL',
          dbVersion: '2.0.0-deterministic-catalog',
          totalCandidatesEvaluated: 300,
          selectionEngine: 'deterministic',
        },
      };
    } else {
      // Nenhum tema determinístico correspondente encontrado: orienta o uso do Gemini
      return {
        status: 'warning',
        selectedPassages: [],
        alternatePassages: [],
        uncoveredThemes: themes,
        message: 'Não encontramos uma seleção temática pré-configurada para este termo no catálogo determinístico offline. Recomendamos utilizar o botão do assistente Gemini (ícone do robô ao lado do download) para obter uma seleção personalizada via IA.',
        meta: {
          cacheHit: false,
          processingTimeMs: Date.now() - startTime,
          translationName: 'Bíblia Sagrada Católica (Cânon Integral)',
          translationId: 'CATOLICA-INTEGRAL',
          dbVersion: '2.0.0-deterministic-catalog',
          totalCandidatesEvaluated: 300,
          selectionEngine: 'deterministic',
        },
      };
    }
  }

  // 3. Verificação de Cache para modo IA (se habilitado)
  const cacheKey = cacheService.generateCacheKey(
    themes,
    pastoralGuidance,
    'BJ-FULL',
    '2.0.0',
    modelName,
    lockedPassageIds,
    true
  );

  return await cacheService.coalesce(cacheKey, async () => {
    try {
      const lockedPassages: ScripturePassage[] = [];
      const result = await geminiService.selectFromFullBible(
        themes,
        pastoralGuidance,
        lockedPassages
      );

      return {
        status: 'ok',
        selectedPassages: result.selectedPassages,
        alternatePassages: result.alternatePassages,
        uncoveredThemes: result.uncoveredThemes || [],
        meta: {
          cacheHit: false,
          processingTimeMs: Date.now() - startTime,
          translationName: 'Bíblia de Jerusalém (Cânon Integral de 73 Livros)',
          translationId: 'BJ-FULL',
          dbVersion: '2.0.0-pure-ai',
          totalCandidatesEvaluated: 31104,
          selectionEngine: 'gemini',
        },
      };
    } catch (err: any) {
      console.warn('[SelectionPipeline] Erro na seleção por IA. Acionando fallback determinístico:', err?.message);

      const matchedTheme = deterministicEngine.matchTheme(searchQuery);
      if (matchedTheme) {
        const resolvedPassages = deterministicEngine.resolvePassages(matchedTheme);
        return {
          status: 'ok',
          selectedPassages: resolvedPassages,
          alternatePassages: [],
          uncoveredThemes: [],
          message: `Fallback determinístico ativado: ${matchedTheme.name}.`,
          meta: {
            cacheHit: false,
            processingTimeMs: Date.now() - startTime,
            translationName: 'Bíblia Sagrada Católica (Cânon Integral)',
            translationId: 'CATOLICA-INTEGRAL',
            dbVersion: '2.0.0-deterministic-catalog',
            totalCandidatesEvaluated: 300,
            selectionEngine: 'deterministic_fallback',
          },
        };
      }

      return {
        status: 'warning',
        selectedPassages: [],
        alternatePassages: [],
        uncoveredThemes: themes,
        message: 'Não encontramos correspondência exata para esta busca no catálogo pastoral. Recomendamos acessar diretamente o assistente Gemini pelo botão superior ao lado de download.',
        meta: {
          cacheHit: false,
          processingTimeMs: Date.now() - startTime,
          translationName: 'Bíblia Sagrada Católica',
          translationId: 'CATOLICA-INTEGRAL',
          dbVersion: '2.0.0',
          totalCandidatesEvaluated: 300,
          selectionEngine: 'fallback',
        },
      };
    }
  });
}
