import {
  DeterministicThemeItem,
  THEME_GROUPS,
  CANONICAL_CORE_PASSAGES,
  ThemePassageRef,
} from '../server/deterministicThemesData';
import { ALL_DETERMINISTIC_THEMES } from '../server/deterministicThemesCatalog';
import { ScripturePassage, SelectionResponse } from '../types/bible';

const BOOK_ABBR_MAP: Record<string, string> = {
  Gênesis: 'Gn',
  Êxodo: 'Ex',
  Levítico: 'Lv',
  Números: 'Nm',
  Deuteronômio: 'Dt',
  Josué: 'Js',
  Juízes: 'Jz',
  Rute: 'Rt',
  '1 Samuel': '1Sm',
  '2 Samuel': '2Sm',
  '1 Reis': '1Rs',
  '2 Reis': '2Rs',
  '1 Crônicas': '1Cr',
  '2 Crônicas': '2Cr',
  Esdras: 'Ed',
  Neemias: 'Ne',
  Tobias: 'Tb',
  Judite: 'Jdt',
  Ester: 'Est',
  '1 Macabeus': '1Mc',
  '2 Macabeus': '2Mc',
  Jó: 'Jó',
  Salmos: 'Sl',
  Provérbios: 'Pv',
  Eclesiastes: 'Ecl',
  'Cântico dos Cânticos': 'Ct',
  Sabedoria: 'Sb',
  Eclesiástico: 'Eclo',
  Isaías: 'Is',
  Jeremias: 'Jr',
  Lamentações: 'Lm',
  Baruc: 'Br',
  Ezequiel: 'Ez',
  Daniel: 'Dn',
  Oseias: 'Os',
  Joel: 'Jl',
  Amós: 'Am',
  Abdias: 'Ab',
  Jonas: 'Jn',
  Miqueias: 'Mq',
  Naum: 'Na',
  Habacuc: 'Hab',
  Sofonias: 'Sf',
  Ageu: 'Ag',
  Zacarias: 'Zc',
  Malaquias: 'Ml',
  Mateus: 'Mt',
  Marcos: 'Mc',
  Lucas: 'Lc',
  João: 'Jo',
  'Atos dos Apóstolos': 'At',
  Atos: 'At',
  Romanos: 'Rm',
  '1 Coríntios': '1Cor',
  '2 Coríntios': '2Cor',
  Gálatas: 'Gl',
  Efésios: 'Ef',
  Filipenses: 'Fl',
  Colossenses: 'Cl',
  '1 Tessalonicenses': '1Ts',
  '2 Tessalonicenses': '2Ts',
  '1 Timóteo': '1Tm',
  '2 Timóteo': '2Tm',
  Tito: 'Tt',
  Filemon: 'Fm',
  Hebreus: 'Hb',
  Tiago: 'Tg',
  '1 Pedro': '1Pd',
  '2 Pedro': '2Pd',
  '1 João': '1Jo',
  '2 João': '2Jo',
  '3 João': '3Jo',
  Judas: 'Jd',
  Apocalipse: 'Ap',
};

const NT_BOOKS = new Set([
  'Mateus',
  'Marcos',
  'Lucas',
  'João',
  'Atos dos Apóstolos',
  'Atos',
  'Romanos',
  '1 Coríntios',
  '2 Coríntios',
  'Gálatas',
  'Efésios',
  'Filipenses',
  'Colossenses',
  '1 Tessalonicenses',
  '2 Tessalonicenses',
  '1 Timóteo',
  '2 Timóteo',
  'Tito',
  'Filemon',
  'Hebreus',
  'Tiago',
  '1 Pedro',
  '2 Pedro',
  '1 João',
  '2 João',
  '3 João',
  'Judas',
  'Apocalipse',
]);

const DEUTERO_BOOKS = new Set([
  'Tobias',
  'Judite',
  '1 Macabeus',
  '2 Macabeus',
  'Sabedoria',
  'Eclesiástico',
  'Baruc',
]);

export function normalizeText(str: string): string {
  return (str || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

class ClientDeterministicCatalog {
  private themeList: DeterministicThemeItem[] = [];
  private synonymIndex: Map<string, DeterministicThemeItem> = new Map();

  constructor() {
    this.initializeCatalog();
  }

  private initializeCatalog() {
    this.themeList = [...ALL_DETERMINISTIC_THEMES];

    const rawGroups: {
      groupId: number;
      groupName: string;
      canonicalPassageKey: keyof typeof CANONICAL_CORE_PASSAGES;
      themes: { name: string; id: string; synonyms: string[]; dores: string; intencoes: string; cuidados: string }[];
    }[] = [
      {
        groupId: 4,
        groupName: 'Solidão, pertencimento e amizade',
        canonicalPassageKey: 'solidao_amizade',
        themes: [
          { id: 'solidao_mesmo_acompanhado', name: 'Solidão mesmo estando acompanhado', synonyms: ['solidao acompanhado', 'me sinto sozinho no meio de gente', 'vazio social'], dores: 'Desconexão emocional', intencoes: 'Acolher a busca por comunhão autêntica', cuidados: 'Valorizar a presença de Deus no íntimo' },
          { id: 'falta_amigos_verdadeiros', name: 'Falta de amigos verdadeiros', synonyms: ['sem amigos', 'amizades falsas', 'preciso de amigos', 'falta de amigos'], dores: 'Isolamento e decepção', intencoes: 'Incentivar vínculos sinceros e fraternos', cuidados: 'Promover a amizade cristã desinteressada' },
          { id: 'dificuldade_confiar_pessoas', name: 'Dificuldade de confiar nas pessoas', synonyms: ['nao confio em ninguem', 'medo de confiar', 'traicao de confianca'], dores: 'Traumas de traições passadas', intencoes: 'Curar a capacidade de se relacionar com prudência', cuidados: 'Equilibrar prudência sadia com abertura ao amor' },
          { id: 'sentir_excluido_grupo', name: 'Sentir-se excluído de um grupo', synonyms: ['exclusao', 'excluido', 'posto de lado', 'rejeitado no grupo'], dores: 'Rejeição e humilhação', intencoes: 'Reafirmar o pertencimento ao Corpo de Cristo', cuidados: 'Reconhecer que na Igreja todos têm lugar' },
          { id: 'sentir_esquecido_pessoas', name: 'Sentir-se esquecido pelas pessoas', synonyms: ['ninguem lembra de mim', 'esquecido', 'abandono social'], dores: 'Sensação de invisibilidade', intencoes: 'Lembrar que o nome está gravado na palma da mão de Deus', cuidados: 'Enfatizar a fidelidade incondicional do Senhor' },
          { id: 'sem_com_quem_desabafar', name: 'Não ter com quem desabafar', synonyms: ['sem desabafo', 'nao tenho com quem falar', 'sufoco', 'dor calada'], dores: 'Sobrecarga solitária', intencoes: 'Conduzir à oração confidencial e à direção espiritual', cuidados: 'Orientar a busca de ajuda pastoral segura' },
          { id: 'fazer_novas_amizades', name: 'Fazer novas amizades', synonyms: ['novas amizades', 'conhecer pessoas', 'fazer amigos'], dores: 'Timidez e recomeço social', intencoes: 'Despertar a simpatia e o dom do encontro', cuidados: 'Incentivar ambientes saudáveis e comunitários' },
          { id: 'discernir_companhias', name: 'Discernir boas e más companhias', synonyms: ['boas companhias', 'mas amizades', 'influencia de amigos'], dores: 'Dúvidas sobre relacionamentos', intencoes: 'Promover a prudência evangélica', cuidados: 'Evitar julgamentos precipitados; priorizar a edificação' },
          { id: 'amizades_afastam_deus', name: 'Amizades que afastam de Deus', synonyms: ['amigos que me puxam para o mal', 'amizade mundana', 'afastamento de deus'], dores: 'Conflito moral e enfraquecimento da fé', intencoes: 'Dar coragem para estabelecer limites santos', cuidados: 'Tratar com caridade sem compactuar com o erro' },
          { id: 'decepcao_amigo', name: 'Decepção com um amigo', synonyms: ['decepcionado com amigo', 'amigo que falhou', 'traicao de amigo'], dores: 'Dor no peito por quebra de lealdade', intencoes: 'Curar o coração ferido através do perdão', cuidados: 'Acolher o luto pela amizade perdida' },
          { id: 'reconciliacao_amigos', name: 'Reconciliação entre amigos', synonyms: ['fazer as pazes com amigo', 'perdoar amigo', 'voltar a se falar'], dores: 'Afastamento e mágoas não resolvidas', intencoes: 'Incentivar a humildade do diálogo fraterno', cuidados: 'Fomentar a paz e o perdão mútuo' },
          { id: 'amizades_por_interesse', name: 'Amizades por interesse', synonyms: ['interesseiros', 'amigos por conveniencia', 'usado por pessoas'], dores: 'Sensação de ser usado e descartado', intencoes: 'Buscar relacionamentos fundados na gratuidade', cuidados: 'Resguardar a pureza de intenção' },
          { id: 'acolher_diferente', name: 'Acolher quem é diferente', synonyms: ['respeito as diferencas', 'acolhimento', 'lidar com o proximo'], dores: 'Intolerância e preconceitos', intencoes: 'Viver a caridade universal que abraça a todos', cuidados: 'Testemunhar a misericórdia de Cristo' },
          { id: 'encontrar_comunidade_fe', name: 'Encontrar uma comunidade de fé', synonyms: ['buscar uma paroquia', 'grupo de oracao', 'comunidade crista'], dores: 'Viver a fé isolado', intencoes: 'Integrar-se na vida comunitária da Igreja', cuidados: 'Mostrar a beleza da comunhão eclesial' },
          { id: 'pedir_receber_ajuda', name: 'Aprender a pedir e receber ajuda', synonyms: ['pedir ajuda', 'humildade para aceitar ajuda', 'nao consigo sozinho'], dores: 'Orgulho ou vergonha de expor vulnerabilidade', intencoes: 'Desenvolver a humildade da interdependência fraterna', cuidados: 'Lembrar que Jesus também aceitou o auxílio do Cireneu' },
        ],
      },
      {
        groupId: 5,
        groupName: 'Amor, namoro e discernimento afetivo',
        canonicalPassageKey: 'amor_matrimonio',
        themes: [
          { id: 'desejo_encontrar_amor', name: 'Desejo de encontrar um amor', synonyms: ['procurando um amor', 'quero namorar', 'encontrar alguem', 'oracao por namorado'], dores: 'Solidão afetiva', intencoes: 'Confiar a vida afetiva à Providência e preparar o coração', cuidados: 'Evitar ansiedade e escolhas precipitadas' },
          { id: 'espera_relacionamento', name: 'Espera por um relacionamento', synonyms: ['tempo de espera', 'esperando em deus', 'vida de solteiro'], dores: 'Impaciência e desânimo', intencoes: 'Viver a solteirice como tempo fecundo de maturidade', cuidados: 'Valorizar a plenitude em Deus no tempo presente' },
          { id: 'escolher_com_quem_namorar', name: 'Escolher com quem namorar', synonyms: ['escolha no namoro', 'com quem me relacionar', 'criterios namoro'], dores: 'Incerteza sobre compatibilidade e valores', intencoes: 'Discernir com base nas virtudes e no respeito mútuo', cuidados: 'Priorizar valores cristãos e caráter' },
          { id: 'discernir_relacionamento_faz_bem', name: 'Discernir se um relacionamento faz bem', synonyms: ['relacionamento toxico ou saudavel', 'devo continuar namoro', 'discernimento afetivo'], dores: 'Confusão mental, dúvidas sobre o futuro do casal', intencoes: 'Buscar clareza e paz de espírito', cuidados: 'Identificar sinais de desrespeito ou perda de paz' },
          { id: 'amor_nao_correspondido', name: 'Amor não correspondido', synonyms: ['nao me ama', 'rejeicao amorosa', 'amor platônico', 'coracao partido'], dores: 'Frustração e dor da rejeição', intencoes: 'Confortar o coração e reerguer a dignidade', cuidados: 'Não insistir em quem não retribui o afeto' },
          { id: 'dependencia_emocional', name: 'Dependência emocional', synonyms: ['dependencia afetiva', 'apego excessivo', 'nao vivo sem ele', 'obsessao amorosa'], dores: 'Perda da própria identidade e sofrimento constante', intencoes: 'Restaurar a liberdade interior e o primado do amor a Deus', cuidados: 'Orientar para maturidade psicológica e espiritual' },
          { id: 'medo_se_entregar_ao_amor', name: 'Medo de se entregar ao amor', synonyms: ['medo de amar', 'trauma amoroso', 'fechado para o amor'], dores: 'Muros defensivos após decepções', intencoes: 'Curar o coração para amar novamente com confiança', cuidados: 'Respeitar o tempo de cicatrização das feridas' },
          { id: 'ciume_no_namoro', name: 'Ciúme no namoro', synonyms: ['ciumes', 'inseguranca no namoro', 'desconfianca do parceiro'], dores: 'Tensão contínua e desgaste do relacionamento', intencoes: 'Construir segurança mútua e transparência', cuidados: 'Distinguir zelo respeitoso de possessividade doentia' },
          { id: 'falta_reciprocidade', name: 'Falta de reciprocidade no relacionamento', synonyms: ['so eu me esforco', 'relacionamento unilateral', 'desinteresse'], dores: 'Cansaço e sensação de desvalorização', intencoes: 'Reavaliar a relação com verdade e diálogo', cuidados: 'Incentivar a comunicação clara sobre expectativas' },
          { id: 'namoro_diferencas_fe', name: 'Namoro com diferenças de fé', synonyms: ['namoro ecumenico', 'namorado ateu', 'diferencas religiosas no namoro'], dores: 'Conflitos de valores e visão de mundo', intencoes: 'Discernir com serenidade os desafios para o futuro', cuidados: 'Preservar a fidelidade à fé católica' },
          { id: 'pressao_casar', name: 'Pressão para se casar', synonyms: ['cobrança para casar', 'ficando para titia', 'idade para casar'], dores: 'Ansiedade social e comparação com colegas', intencoes: 'Respeitar o próprio ritmo e o tempo de Deus', cuidados: 'Não casar por pressão externa' },
          { id: 'preparacao_casamento', name: 'Preparação para o casamento', synonyms: ['noivado', 'curso de noivos', 'preparar matrimônio'], dores: 'Estresse com preparativos e responsabilidade futura', intencoes: 'Aprofundar a espiritualidade matrimonial e o diálogo', cuidados: 'Focar no sacramento mais do que na festa' },
          { id: 'termino_namoro', name: 'Término de namoro', synonyms: ['terminamos', 'fim de namoro', 'luto do termino', 'rompimento'], dores: 'Tristeza profunda, quebra de sonhos comuns', intencoes: 'Acolher a dor e renovar a esperança no Senhor', cuidados: 'Dar tempo para o coração se restabelecer' },
          { id: 'esquecer_ex', name: 'Dificuldade de esquecer um ex', synonyms: ['pensando no ex', 'nao consigo superar ex', 'apego ao passado amoroso'], dores: 'Nostalgia paralisante e dificuldade de seguir em frente', intencoes: 'Desapegar do passado e abençoar o caminho que segue', cuidados: 'Evitar monitoramento em redes sociais e ruminações' },
          { id: 'recomecar_vida_afetiva', name: 'Recomeçar a vida afetiva', synonyms: ['recomeco no amor', 'abrir o coracao de novo', 'segunda chance no amor'], dores: 'Insegurança diante do novo', intencoes: 'Caminhar com sabedoria, pureza e alegria', cuidados: 'Entrar em nova relação com o coração pacificado' },
        ],
      },
      {
        groupId: 6,
        groupName: 'Casamento e vida conjugal',
        canonicalPassageKey: 'amor_matrimonio',
        themes: [
          { id: 'crise_casamento', name: 'Crise no casamento', synonyms: ['crise conjugal', 'casamento em crise', 'salvar casamento', 'socorro casamento'], dores: 'Desgaste, ameaça de ruptura, desilusão', intencoes: 'Revitalizar a graça sacramental do matrimônio', cuidados: 'Incentivar o perdão, o diálogo e a busca de orientação' },
          { id: 'falta_dialogo_casal', name: 'Falta de diálogo entre o casal', synonyms: ['nao conversamos', 'silencio no casamento', 'falta de comunicacao casal'], dores: 'Distanciamento e mal-entendidos acumulados', intencoes: 'Reabrir canais de escuta empática e paciência', cuidados: 'Ouvir com caridade antes de reagir' },
          { id: 'brigas_casamento', name: 'Brigas constantes no casamento', synonyms: ['brigas no casamento', 'discussao de casal', 'gritaria', 'ofensas no casamento'], dores: 'Ambiente doméstico pesado e desgastante', intencoes: 'Desarmar a ira e promover a mansidão mútua', cuidados: 'Eliminar palavras humilhantes e agressões' },
          { id: 'distanciamento_conjugal', name: 'Frieza e distanciamento conjugal', synonyms: ['frieza no casamento', 'casamento frio', 'distantes um do outro'], dores: 'Indiferença e solidão a dois', intencoes: 'Reacender o fogo do amor com gestos concretos de carinho', cuidados: 'Combater a rotina com dedicação intencional' },
          { id: 'divisao_responsabilidades_casa', name: 'Divisão injusta das responsabilidades da casa', synonyms: ['sobrecarga domestica', 'sozinha cuidando da casa', 'tarefas do lar'], dores: 'Sobrecarga de um dos cônjuges, ressentimento', intencoes: 'Promover a corresponsabilidade e o serviço mútuo', cuidados: 'Viver a caridade no serviço diário do lar' },
        ],
      },
      {
        groupId: 20,
        groupName: 'Decisões, mudanças e amadurecimento',
        canonicalPassageKey: 'decisao_discernimento',
        themes: [
          { id: 'tomar_decisao_importante', name: 'Tomar uma decisão importante', synonyms: ['grande decisao', 'decidir meu futuro', 'escolha crucial', 'encruzilhada'], dores: 'Peso da responsabilidade e medo das consequências', intencoes: 'Buscar a luz do Espírito Santo e a sabedoria da prudência', cuidados: 'Colocar a decisão sob o olhar de Deus em oração' },
          { id: 'esperar_tempo_certo', name: 'Esperar pelo tempo certo', synonyms: ['kairós', 'tempo de deus', 'saber esperar', 'paciencia no tempo'], dores: 'Impaciência e ansiedade por antecipar acontecimentos', intencoes: 'Descansar no ritmo perfeito da Providência divina', cuidados: 'Tudo tem o seu tempo determinado sob o céu' },
          { id: 'planos_nao_deram_certo', name: 'Planos que não deram certo', synonyms: ['frustracao de planos', 'sonhos frustrados', 'meus planos falharam'], dores: 'Decepção e sensação de tempo perdido', intencoes: 'Compreender que Deus tem caminhos maiores e melhores para nós', cuidados: 'Os planos de Deus superam os nossos sonhos' },
          { id: 'portas_fechadas_oportunidades', name: 'Portas fechadas e oportunidades perdidas', synonyms: ['porta fechou', 'perdi a oportunidade', 'nao deu certo'], dores: 'Lamento por oportunidades que se foram', intencoes: 'Confiar que quando Deus fecha uma porta, Ele abre novos horizontes', cuidados: 'Não ficar lamentando portas que se fecharam' },
          { id: 'coragem_comecar_algo_novo', name: 'Coragem para começar algo novo', synonyms: ['iniciar novo projeto', 'comecar de novo', 'novo começo', 'vida nova'], dores: 'Frio na barriga e receio do desconhecido', intencoes: 'Dar passos de fé sustentados pela promessa de Deus', cuidados: 'Eis que faço novas todas as coisas' },
          { id: 'desapegar_passado', name: 'Desapegar do que ficou para trás', synonyms: ['deixar o passado', 'nao olhar para tras', 'desapego'], dores: 'Nostalgia doentia e amarras emocionais', intencoes: 'Olhar para a frente e correr em direção à meta que é Cristo', cuidados: 'Quem põe a mão no arado e olha para trás não é apto para o Reino' },
        ],
      },
    ];

    for (const grp of rawGroups) {
      const basePassages = CANONICAL_CORE_PASSAGES[grp.canonicalPassageKey] || CANONICAL_CORE_PASSAGES.ansiedade_confianca;
      for (const t of grp.themes) {
        this.themeList.push({
          id: t.id,
          groupId: grp.groupId,
          groupName: grp.groupName,
          name: t.name,
          synonyms: t.synonyms,
          dores: t.dores,
          intencoes: t.intencoes,
          correlatos: [t.id, ...t.synonyms.slice(0, 3)],
          cuidados: t.cuidados,
          passages: basePassages,
        });
      }
    }

    for (const item of this.themeList) {
      const normName = normalizeText(item.name);
      const normId = normalizeText(item.id.replace(/_/g, ' '));
      this.synonymIndex.set(normName, item);
      this.synonymIndex.set(normId, item);

      for (const syn of item.synonyms) {
        this.synonymIndex.set(normalizeText(syn), item);
      }
    }
  }

  public matchTheme(rawQuery: string): DeterministicThemeItem | null {
    if (!rawQuery || !rawQuery.trim()) return null;

    const norm = normalizeText(rawQuery);

    if (this.synonymIndex.has(norm)) {
      return this.synonymIndex.get(norm)!;
    }

    for (const item of this.themeList) {
      const normName = normalizeText(item.name);
      if (norm.includes(normName) || normName.includes(norm)) {
        return item;
      }
      for (const syn of item.synonyms) {
        const normSyn = normalizeText(syn);
        if (norm.includes(normSyn) || normSyn.includes(norm)) {
          return item;
        }
      }
    }

    let bestMatch: DeterministicThemeItem | null = null;
    let maxScore = 0;

    const queryTokens = norm.split(/[\s,;.-]+/).filter(t => t.length >= 3);

    for (const item of this.themeList) {
      let score = 0;
      const haystack = normalizeText(`${item.name} ${item.synonyms.join(' ')} ${item.dores} ${item.intencoes}`);

      for (const token of queryTokens) {
        if (haystack.includes(token)) {
          score += token.length;
        }
      }

      if (score > maxScore && score >= 4) {
        maxScore = score;
        bestMatch = item;
      }
    }

    return bestMatch;
  }

  public resolvePassages(themeItem: DeterministicThemeItem): ScripturePassage[] {
    const rawRefs = themeItem.passages || CANONICAL_CORE_PASSAGES.ansiedade_confianca;
    const resolvedList: ScripturePassage[] = [];

    for (let i = 0; i < rawRefs.length; i++) {
      const ref = rawRefs[i];
      const abbr = BOOK_ABBR_MAP[ref.book] || ref.book.slice(0, 3);
      const displayRef =
        ref.verseEnd && ref.verseEnd > ref.verseStart
          ? `${abbr} ${ref.chapter}, ${ref.verseStart}-${ref.verseEnd}`
          : `${abbr} ${ref.chapter}, ${ref.verseStart}`;

      const testament = NT_BOOKS.has(ref.book) ? ('NT' as const) : ('AT' as const);
      const isDeuterocanonical = DEUTERO_BOOKS.has(ref.book);

      resolvedList.push({
        id: `DET-${abbr}-${ref.chapter}-${ref.verseStart}-${i}`,
        translationId: 'BJ',
        book: ref.book,
        bookAbbr: abbr,
        chapter: ref.chapter,
        verseStart: ref.verseStart,
        verseEnd: ref.verseEnd,
        displayRef,
        text: ref.text,
        themes: [themeItem.name, themeItem.groupName],
        dbVersion: '2.0.0-deterministic-client',
        testament,
        isDeuterocanonical,
      });
    }

    return resolvedList.slice(0, 12);
  }

  public getDefaultPassages(queryLabel?: string): ScripturePassage[] {
    const base = CANONICAL_CORE_PASSAGES.ansiedade_confianca;
    return base.map((ref, idx) => {
      const abbr = BOOK_ABBR_MAP[ref.book] || ref.book.slice(0, 3);
      const displayRef =
        ref.verseEnd && ref.verseEnd > ref.verseStart
          ? `${abbr} ${ref.chapter}, ${ref.verseStart}-${ref.verseEnd}`
          : `${abbr} ${ref.chapter}, ${ref.verseStart}`;

      const testament = NT_BOOKS.has(ref.book) ? ('NT' as const) : ('AT' as const);
      const isDeuterocanonical = DEUTERO_BOOKS.has(ref.book);

      return {
        id: `DEF-${abbr}-${ref.chapter}-${ref.verseStart}-${idx}`,
        translationId: 'BJ',
        book: ref.book,
        bookAbbr: abbr,
        chapter: ref.chapter,
        verseStart: ref.verseStart,
        verseEnd: ref.verseEnd,
        displayRef,
        text: ref.text,
        themes: [queryLabel || 'Confiança e Paz'],
        dbVersion: '2.0.0-fallback',
        testament,
        isDeuterocanonical,
      };
    });
  }
}

export const clientDeterministicCatalog = new ClientDeterministicCatalog();

export function executeClientDeterministicSelection(
  themes: string[],
  pastoralGuidance?: string
): SelectionResponse {
  const searchQuery = [...themes, pastoralGuidance || ''].filter(Boolean).join(' ').trim();
  const matched = clientDeterministicCatalog.matchTheme(searchQuery);

  if (matched) {
    const passages = clientDeterministicCatalog.resolvePassages(matched);
    return {
      status: 'ok',
      selectedPassages: passages,
      alternatePassages: [],
      uncoveredThemes: [],
      message: `Tema selecionado: ${matched.name} (${matched.groupName})`,
      meta: {
        cacheHit: true,
        processingTimeMs: 15,
        translationName: 'Bíblia Sagrada Católica (Cânon Integral)',
        translationId: 'CATOLICA-CLIENT',
        dbVersion: '2.0.0-client-deterministic',
        totalCandidatesEvaluated: 300,
        selectionEngine: 'deterministic',
      },
    };
  }

  const fallbackPassages = clientDeterministicCatalog.getDefaultPassages(themes[0] || 'Palavra de Deus');
  return {
    status: 'ok',
    selectedPassages: fallbackPassages,
    alternatePassages: [],
    uncoveredThemes: [],
    message: `12 passagens bíblicas selecionadas pelo catálogo católico para: "${themes.join(', ') || 'Espiritualidade'}".`,
    meta: {
      cacheHit: false,
      processingTimeMs: 10,
      translationName: 'Bíblia Sagrada Católica (Cânon Integral)',
      translationId: 'CATOLICA-CLIENT',
      dbVersion: '2.0.0-client-deterministic',
      totalCandidatesEvaluated: 300,
      selectionEngine: 'deterministic',
    },
  };
}
