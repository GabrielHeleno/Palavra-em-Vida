import fs from 'fs';
import path from 'path';
import { ScripturePassage } from '../types/bible';

export interface BibleVerseItem {
  bookKey: string;
  book: string;
  bookAbbr: string;
  chapter: number;
  verse: number;
  text: string;
  normText: string;
  testament: 'AT' | 'NT';
  category: 'evangelho' | 'salmo' | 'epistola' | 'sapiencial' | 'profeta' | 'historico' | 'pentateuco';
  isDeut: boolean;
}

export function normalizeText(str: string): string {
  return (str || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

const BOOK_METADATA: Record<string, {
  abbr: string;
  testament: 'AT' | 'NT';
  isDeut?: boolean;
  cleanName: string;
  category: 'evangelho' | 'salmo' | 'epistola' | 'sapiencial' | 'profeta' | 'historico' | 'pentateuco';
}> = {
  // Pentateuco
  genesis: { abbr: 'Gn', testament: 'AT', cleanName: 'Gênesis', category: 'pentateuco' },
  exodo: { abbr: 'Ex', testament: 'AT', cleanName: 'Êxodo', category: 'pentateuco' },
  levitico: { abbr: 'Lv', testament: 'AT', cleanName: 'Levítico', category: 'pentateuco' },
  numeros: { abbr: 'Nm', testament: 'AT', cleanName: 'Números', category: 'pentateuco' },
  deuteronomio: { abbr: 'Dt', testament: 'AT', cleanName: 'Deuteronômio', category: 'pentateuco' },

  // Históricos
  josue: { abbr: 'Js', testament: 'AT', cleanName: 'Josué', category: 'historico' },
  juizes: { abbr: 'Jz', testament: 'AT', cleanName: 'Juízes', category: 'historico' },
  rute: { abbr: 'Rt', testament: 'AT', cleanName: 'Rute', category: 'historico' },
  '1 samuel': { abbr: '1Sm', testament: 'AT', cleanName: '1 Samuel', category: 'historico' },
  '2 samuel': { abbr: '2Sm', testament: 'AT', cleanName: '2 Samuel', category: 'historico' },
  '1 reis': { abbr: '1Rs', testament: 'AT', cleanName: '1 Reis', category: 'historico' },
  '2 reis': { abbr: '2Rs', testament: 'AT', cleanName: '2 Reis', category: 'historico' },
  '1 cronicas': { abbr: '1Cr', testament: 'AT', cleanName: '1 Crônicas', category: 'historico' },
  '2 cronicas': { abbr: '2Cr', testament: 'AT', cleanName: '2 Crônicas', category: 'historico' },
  esdras: { abbr: 'Ed', testament: 'AT', cleanName: 'Esdras', category: 'historico' },
  neemias: { abbr: 'Ne', testament: 'AT', cleanName: 'Neemias', category: 'historico' },
  tobias: { abbr: 'Tb', testament: 'AT', isDeut: true, cleanName: 'Tobias', category: 'historico' },
  judite: { abbr: 'Jdt', testament: 'AT', isDeut: true, cleanName: 'Judite', category: 'historico' },
  ester: { abbr: 'Est', testament: 'AT', cleanName: 'Ester', category: 'historico' },
  '1 macabeus': { abbr: '1Mc', testament: 'AT', isDeut: true, cleanName: '1 Macabeus', category: 'historico' },
  '2 macabeus': { abbr: '2Mc', testament: 'AT', isDeut: true, cleanName: '2 Macabeus', category: 'historico' },

  // Sapienciais & Salmos
  jo: { abbr: 'Jó', testament: 'AT', cleanName: 'Jó', category: 'sapiencial' },
  salmos: { abbr: 'Sl', testament: 'AT', cleanName: 'Salmos', category: 'salmo' },
  salmo: { abbr: 'Sl', testament: 'AT', cleanName: 'Salmos', category: 'salmo' },
  proverbios: { abbr: 'Pv', testament: 'AT', cleanName: 'Provérbios', category: 'sapiencial' },
  eclesiastes: { abbr: 'Ecl', testament: 'AT', cleanName: 'Eclesiastes', category: 'sapiencial' },
  'cantico dos canticos': { abbr: 'Ct', testament: 'AT', cleanName: 'Cântico dos Cânticos', category: 'sapiencial' },
  canticos: { abbr: 'Ct', testament: 'AT', cleanName: 'Cântico dos Cânticos', category: 'sapiencial' },
  sabedoria: { abbr: 'Sb', testament: 'AT', isDeut: true, cleanName: 'Sabedoria', category: 'sapiencial' },
  eclesiastico: { abbr: 'Eclo', testament: 'AT', isDeut: true, cleanName: 'Eclesiástico', category: 'sapiencial' },
  siracida: { abbr: 'Eclo', testament: 'AT', isDeut: true, cleanName: 'Eclesiástico', category: 'sapiencial' },

  // Profetas
  isaias: { abbr: 'Is', testament: 'AT', cleanName: 'Isaías', category: 'profeta' },
  jeremias: { abbr: 'Jr', testament: 'AT', cleanName: 'Jeremias', category: 'profeta' },
  lamentacoes: { abbr: 'Lm', testament: 'AT', cleanName: 'Lamentações', category: 'profeta' },
  baruc: { abbr: 'Br', testament: 'AT', isDeut: true, cleanName: 'Baruc', category: 'profeta' },
  ezequiel: { abbr: 'Ez', testament: 'AT', cleanName: 'Ezequiel', category: 'profeta' },
  daniel: { abbr: 'Dn', testament: 'AT', cleanName: 'Daniel', category: 'profeta' },
  oseias: { abbr: 'Os', testament: 'AT', cleanName: 'Oseias', category: 'profeta' },
  joel: { abbr: 'Jl', testament: 'AT', cleanName: 'Joel', category: 'profeta' },
  amos: { abbr: 'Am', testament: 'AT', cleanName: 'Amós', category: 'profeta' },
  obadias: { abbr: 'Ob', testament: 'AT', cleanName: 'Obadias', category: 'profeta' },
  jonas: { abbr: 'Jn', testament: 'AT', cleanName: 'Jonas', category: 'profeta' },
  miqueias: { abbr: 'Mq', testament: 'AT', cleanName: 'Miqueias', category: 'profeta' },
  naum: { abbr: 'Na', testament: 'AT', cleanName: 'Naum', category: 'profeta' },
  habacuc: { abbr: 'Hab', testament: 'AT', cleanName: 'Habacuc', category: 'profeta' },
  habacuque: { abbr: 'Hab', testament: 'AT', cleanName: 'Habacuc', category: 'profeta' },
  sofonias: { abbr: 'Sf', testament: 'AT', cleanName: 'Sofonias', category: 'profeta' },
  ageu: { abbr: 'Ag', testament: 'AT', cleanName: 'Ageu', category: 'profeta' },
  zacarias: { abbr: 'Zc', testament: 'AT', cleanName: 'Zacarias', category: 'profeta' },
  malaquias: { abbr: 'Ml', testament: 'AT', cleanName: 'Malaquias', category: 'profeta' },

  // Evangelhos & Atos
  mateus: { abbr: 'Mt', testament: 'NT', cleanName: 'Mateus', category: 'evangelho' },
  marcos: { abbr: 'Mc', testament: 'NT', cleanName: 'Marcos', category: 'evangelho' },
  lucas: { abbr: 'Lc', testament: 'NT', cleanName: 'Lucas', category: 'evangelho' },
  joao: { abbr: 'Jo', testament: 'NT', cleanName: 'João', category: 'evangelho' },
  'atos dos apostolos': { abbr: 'At', testament: 'NT', cleanName: 'Atos dos Apóstolos', category: 'historico' },
  atos: { abbr: 'At', testament: 'NT', cleanName: 'Atos dos Apóstolos', category: 'historico' },

  // Epístolas & Apocalipse
  romanos: { abbr: 'Rm', testament: 'NT', cleanName: 'Romanos', category: 'epistola' },
  '1 corintios': { abbr: '1Cor', testament: 'NT', cleanName: '1 Coríntios', category: 'epistola' },
  '2 corintios': { abbr: '2Cor', testament: 'NT', cleanName: '2 Coríntios', category: 'epistola' },
  galatas: { abbr: 'Gl', testament: 'NT', cleanName: 'Gálatas', category: 'epistola' },
  efesios: { abbr: 'Ef', testament: 'NT', cleanName: 'Efésios', category: 'epistola' },
  filipenses: { abbr: 'Fl', testament: 'NT', cleanName: 'Filipenses', category: 'epistola' },
  colossenses: { abbr: 'Cl', testament: 'NT', cleanName: 'Colossenses', category: 'epistola' },
  '1 tessalonicenses': { abbr: '1Ts', testament: 'NT', cleanName: '1 Tessalonicenses', category: 'epistola' },
  '2 tessalonicenses': { abbr: '2Ts', testament: 'NT', cleanName: '2 Tessalonicenses', category: 'epistola' },
  '1 timoteo': { abbr: '1Tm', testament: 'NT', cleanName: '1 Timóteo', category: 'epistola' },
  '2 timoteo': { abbr: '2Tm', testament: 'NT', cleanName: '2 Timóteo', category: 'epistola' },
  tito: { abbr: 'Tt', testament: 'NT', cleanName: 'Tito', category: 'epistola' },
  filemom: { abbr: 'Fm', testament: 'NT', cleanName: 'Filemom', category: 'epistola' },
  hebreus: { abbr: 'Hb', testament: 'NT', cleanName: 'Hebreus', category: 'epistola' },
  tiago: { abbr: 'Tg', testament: 'NT', cleanName: 'Tiago', category: 'epistola' },
  '1 pedro': { abbr: '1Pd', testament: 'NT', cleanName: '1 Pedro', category: 'epistola' },
  '2 pedro': { abbr: '2Pd', testament: 'NT', cleanName: '2 Pedro', category: 'epistola' },
  '1 joao': { abbr: '1Jo', testament: 'NT', cleanName: '1 João', category: 'epistola' },
  '2 joao': { abbr: '2Jo', testament: 'NT', cleanName: '2 João', category: 'epistola' },
  '3 joao': { abbr: '3Jo', testament: 'NT', cleanName: '3 João', category: 'epistola' },
  judas: { abbr: 'Jd', testament: 'NT', cleanName: 'Judas', category: 'epistola' },
  apocalipse: { abbr: 'Ap', testament: 'NT', cleanName: 'Apocalipse', category: 'profeta' },
};

const ABBR_MAP: Record<string, string> = {
  gn: 'genesis', ex: 'exodo', lv: 'levitico', nm: 'numeros', dt: 'deuteronomio',
  js: 'josue', jz: 'juizes', rt: 'rute', '1sm': '1 samuel', '2sm': '2 samuel',
  '1rs': '1 reis', '2rs': '2 reis', '1cr': '1 cronicas', '2cr': '2 cronicas',
  ed: 'esdras', ne: 'neemias', tb: 'tobias', jdt: 'judite', est: 'ester', et: 'ester',
  '1mc': '1 macabeus', '2mc': '2 macabeus', sl: 'salmos', pv: 'proverbios', pr: 'proverbios',
  ec: 'eclesiastes', ecl: 'eclesiastes', ct: 'cantico dos canticos', sb: 'sabedoria',
  eclo: 'eclesiastico', sir: 'eclesiastico', is: 'isaias', jr: 'jeremias', lm: 'lamentacoes',
  br: 'baruc', ez: 'ezequiel', dn: 'daniel', os: 'oseias', jl: 'joel', am: 'amos',
  ob: 'obadias', jn: 'jonas', mq: 'miqueias', na: 'naum', hc: 'habacuc', hab: 'habacuc',
  sf: 'sofonias', ag: 'ageu', zc: 'zacarias', ml: 'malaquias', mt: 'mateus', mc: 'marcos',
  lc: 'lucas', jo: 'joao', at: 'atos dos apostolos', atos: 'atos dos apostolos', rm: 'romanos',
  '1co': '1 corintios', '1cor': '1 corintios', '2co': '2 corintios', '2cor': '2 corintios',
  gl: 'galatas', ef: 'efesios', fp: 'filipenses', fl: 'filipenses', cl: 'colossenses',
  '1ts': '1 tessalonicenses', '2ts': '2 tessalonicenses', '1tm': '1 timoteo', '2tm': '2 timoteo',
  tt: 'tito', fm: 'filemom', hb: 'hebreus', tg: 'tiago', '1pe': '1 pedro', '1pd': '1 pedro',
  '2pe': '2 pedro', '2pd': '2 pedro', '1jo': '1 joao', '2jo': '2 joao', '3jo': '3 joao',
  jd: 'judas', ap: 'apocalipse',
};

export class FullBibleService {
  private verseMap: Map<string, string> = new Map();
  private loaded = false;

  constructor() {
    this.loadFullBibleText();
  }

  private resolveBookKey(rawBook: string): string | null {
    const norm = normalizeText(rawBook);
    if (BOOK_METADATA[norm]) return norm;
    if (ABBR_MAP[norm]) return ABBR_MAP[norm];

    for (const k of Object.keys(BOOK_METADATA)) {
      if (k.startsWith(norm) || norm.startsWith(k)) return k;
    }
    return null;
  }

  private loadFullBibleText() {
    try {
      const biblePath = path.resolve(process.cwd(), 'biblia_sagrada_completa.txt');
      if (!fs.existsSync(biblePath)) {
        console.warn('Arquivo biblia_sagrada_completa.txt não encontrado no caminho:', biblePath);
        return;
      }

      const content = fs.readFileSync(biblePath, 'utf-8');
      const lines = content.split('\n');
      const verseRegex = /^\[([^\]]+)\s+(\d+)[:\.,](\d+)\]\s*(.*)$/;

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith('[')) continue;

        const match = trimmed.match(verseRegex);
        if (match) {
          const rawBook = match[1].trim();
          const chapter = parseInt(match[2], 10);
          const verse = parseInt(match[3], 10);
          const text = match[4].trim();

          const bookKey = this.resolveBookKey(rawBook);
          if (bookKey) {
            const key = `${bookKey}:${chapter}:${verse}`;
            this.verseMap.set(key, text);
          }
        }
      }

      this.loaded = true;
      console.log(`[FullBibleService] Carregados ${this.verseMap.size} versículos literais da Bíblia Completa.`);
    } catch (err) {
      console.error('[FullBibleService] Erro ao carregar Bíblia Completa:', err);
    }
  }

  /**
   * Obtém o texto literal de uma passagem no acervo integral
   */
  public getPassage(
    bookInput: string,
    chapter: number,
    verseStart: number,
    verseEnd?: number
  ): { text: string; displayRef: string; book: string; bookAbbr: string; testament: 'AT' | 'NT'; isDeut: boolean } | null {
    const bookKey = this.resolveBookKey(bookInput);
    if (!bookKey) return null;

    const meta = BOOK_METADATA[bookKey];
    const end = verseEnd && verseEnd >= verseStart ? verseEnd : verseStart;
    const parts: string[] = [];

    for (let v = verseStart; v <= end; v++) {
      const key = `${bookKey}:${chapter}:${v}`;
      const verseText = this.verseMap.get(key);
      if (verseText) {
        parts.push(verseText);
      }
    }

    if (parts.length === 0) return null;

    let fullText = parts.join(' ').replace(/\s+/g, ' ').trim();
    let finalVerseEnd: number | undefined = end > verseStart ? end : undefined;

    if (fullText.length > 180 && parts.length > 1) {
      const firstVerseText = parts[0];
      if (firstVerseText.length <= 180) {
        fullText = firstVerseText;
        finalVerseEnd = undefined;
      }
    }

    const displayRef = finalVerseEnd
      ? `${meta.abbr} ${chapter}, ${verseStart}-${finalVerseEnd}`
      : `${meta.abbr} ${chapter}, ${verseStart}`;

    return {
      text: fullText,
      displayRef,
      book: meta.cleanName,
      bookAbbr: meta.abbr,
      testament: meta.testament,
      isDeut: !!meta.isDeut,
    };
  }

  /**
   * Constrói e valida uma passagem selecionada pela IA contra o texto canônico
   */
  public createScripturePassage(
    bookInput: string,
    chapter: number,
    verseStart: number,
    verseEnd: number | undefined,
    fallbackText: string,
    themes: string[] = []
  ): ScripturePassage {
    const verified = this.getPassage(bookInput, chapter, verseStart, verseEnd);
    const bookKey = this.resolveBookKey(bookInput) || normalizeText(bookInput);
    const meta = BOOK_METADATA[bookKey] || {
      abbr: bookInput.slice(0, 3),
      cleanName: bookInput,
      testament: 'NT' as const,
      category: 'evangelho' as const,
      isDeut: false,
    };

    let text = verified?.text || fallbackText;
    if (text.length > 180) {
      text = text.slice(0, 177) + '...';
    }

    const displayRef = verified?.displayRef || (verseEnd && verseEnd > verseStart
      ? `${meta.abbr} ${chapter}, ${verseStart}-${verseEnd}`
      : `${meta.abbr} ${chapter}, ${verseStart}`);

    const id = `BJ-${meta.abbr.toUpperCase().replace(/[^A-Z0-9]/g, '')}-${chapter}-${verseStart}`;

    return {
      id,
      translationId: 'BJ',
      book: meta.cleanName,
      bookAbbr: meta.abbr,
      chapter,
      verseStart,
      verseEnd: verified ? (verified.displayRef.includes('-') ? verseEnd : undefined) : verseEnd,
      displayRef,
      text,
      themes: themes.length > 0 ? themes : ['Palavra de Deus'],
      dbVersion: '2.0.0-pure-ai',
      testament: meta.testament,
      isDeuterocanonical: meta.isDeut,
    };
  }
}

export const fullBibleService = new FullBibleService();
