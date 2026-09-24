export interface ScripturePassage {
  id: string;
  translationId: string; // e.g. "BJ"
  book: string;          // e.g. "Lucas", "Salmos", "Sabedoria"
  bookAbbr: string;      // e.g. "Lc", "Sl", "Sb"
  chapter: number;
  verseStart: number;
  verseEnd?: number;
  displayRef: string;    // e.g. "Lc 15, 20-24"
  text: string;          // Literal ipsis litteris text
  themes: string[];      // Associated pastoral themes / keywords
  pastoralContext?: string; // Por que esta passagem foi escolhida teologicamente
  dbVersion: string;
  testament: 'AT' | 'NT';
  isDeuterocanonical?: boolean;
}

export interface TheologicalReflection {
  centralSpiritualConcept: string;
  humanRealities: string;
  theologicalSynonyms: string[];
  canonicalStrategy: string;
}

export interface TranslationMetadata {
  id: string;
  name: string;
  publisher: string;
  canon: string; // "Católico com 73 livros (inclui deuterocanônicos)"
  numberingConvention: string;
  licenseNote: string;
  version: string;
  isLimitedInitialSet: boolean;
  totalPassages: number;
}

export interface BibleDatabase {
  metadata: TranslationMetadata;
  passages: ScripturePassage[];
}

export interface SelectionRequest {
  themes: string[];
  pastoralGuidance?: string;
  lockedPassageIds?: string[];
  replacePassageId?: string;
  useGemini?: boolean;
}

export interface GeminiCandidate {
  id: string;
  displayRef: string;
  text: string;
  themes: string[];
}

export interface GeminiSelectionOutput {
  status: 'ok' | 'insufficient_candidates';
  selectedIds: string[];
  alternateIds: string[];
  uncoveredThemes: string[];
  searchTerms: string[];
}

export interface SelectionResponse {
  status: 'ok' | 'insufficient_candidates' | 'error' | 'warning';
  selectedPassages: ScripturePassage[];
  alternatePassages: ScripturePassage[];
  uncoveredThemes: string[];
  message?: string;
  theologicalReflection?: TheologicalReflection;
  meta: {
    cacheHit: boolean;
    processingTimeMs: number;
    translationName: string;
    translationId: string;
    dbVersion: string;
    totalCandidatesEvaluated: number;
    selectionEngine?: 'gemini' | 'local' | 'deterministic' | 'deterministic_fallback' | 'fallback';
  };
}

export interface CardLayoutMetrics {
  fontSizePt: number;
  lineHeightPt: number;
  lines: string[];
  textHeightMm: number;
  totalCardHeightMm: number;
  availableHeightMm: number;
  fitsComfortably: boolean;
  overflows: boolean;
}
