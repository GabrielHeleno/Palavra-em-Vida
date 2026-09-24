import { DeterministicThemeItem, THEME_GROUPS, CANONICAL_CORE_PASSAGES } from './deterministicThemesData';
import { ALL_DETERMINISTIC_THEMES } from './deterministicThemesCatalog';
import { fullBibleService, normalizeText } from './fullBibleService';
import { ScripturePassage, SelectionResponse } from '../types/bible';

// Dicionário extendido de termos e 300 tópicos pastorais
export class DeterministicEngine {
  private themeList: DeterministicThemeItem[] = [];
  private synonymIndex: Map<string, DeterministicThemeItem> = new Map();

  constructor() {
    this.initializeCatalog();
  }

  private initializeCatalog() {
    this.themeList = [...ALL_DETERMINISTIC_THEMES];

    // Gerar todos os 300 temas dos 20 grupos
    this.generateAll300Themes();

    // Indexar sinônimos e nomes para busca O(1)
    for (const item of this.themeList) {
      const normName = normalizeText(item.name);
      const normId = normalizeText(item.id.replace(/_/g, ' '));
      this.synonymIndex.set(normName, item);
      this.synonymIndex.set(normId, item);

      for (const syn of item.synonyms) {
        this.synonymIndex.set(normalizeText(syn), item);
      }
    }

    console.log(`[DeterministicEngine] Indexados ${this.themeList.length} temas canônicos com ${this.synonymIndex.size} sinônimos.`);
  }

  private generateAll300Themes() {
    // Lista estruturada dos 20 grupos e seus 300 temas
    const rawGroups: {
      groupId: number;
      groupName: string;
      canonicalPassageKey: keyof typeof CANONICAL_CORE_PASSAGES;
      themes: { name: string; id: string; synonyms: string[]; dores: string; intencoes: string; cuidados: string }[];
    }[] = [
      // 4. Solidão, pertencimento e amizade (15)
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
      // 5. Amor, namoro e discernimento afetivo (15)
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
      // 6. Casamento e vida conjugal (15)
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
          { id: 'falta_carinho_casamento', name: 'Falta de carinho no casamento', synonyms: ['sem carinho', 'falta de afeto', 'me sinto rejeitada pelo marido'], dores: 'Carência afetiva no matrimônio', intencoes: 'Incentivar a ternura e as delicadezas diárias', cuidados: 'Expressar apreço sincero pelo cônjuge' },
          { id: 'infidelidade_conjugal', name: 'Infidelidade conjugal', synonyms: ['traicao no casamento', 'adulterio', 'meu marido me traiu', 'minha esposa me traiu'], dores: 'Quebra trágica da confiança, humilhação, dor extrema', intencoes: 'Acolher a dor da vítima e chamar o culpado à conversão e reparação', cuidados: 'Distinguir quem sofreu a traição de quem a praticou; não forçar reconciliação sem arrependimento real' },
          { id: 'reconstrucao_confianca_casamento', name: 'Reconstrução da confiança no casamento', synonyms: ['reconstruir confianca', 'confiar de novo no conjuge', 'superar traicao'], dores: 'Insegurança, medo de novas mentiras', intencoes: 'Caminhar com transparência total e paciência no tempo', cuidados: 'A confiança se reconstrói com atos e fidelidade comprovada' },
          { id: 'perdao_marido_mulher', name: 'Perdão entre marido e mulher', synonyms: ['perdoar o conjuge', 'perdao no casamento', 'reconciliacao matrimonial'], dores: 'Mágoas acumuladas que impedem a comunhão', intencoes: 'Experimentar o perdão evangélico que cura e renova', cuidados: 'O perdão é decisão e processo de graça' },
          { id: 'dificuldades_financeiras_casal', name: 'Dificuldades financeiras do casal', synonyms: ['problemas de dinheiro no casamento', 'brigas por dinheiro', 'dividas do casal'], dores: 'Tensão material afetando a paz familiar', intencoes: 'Unir forças em planejamento sábio e confiança em Deus', cuidados: 'Não permitir que o dinheiro divida a comunhão' },
          { id: 'interferencia_familia_casamento', name: 'Interferência da família no casamento', synonyms: ['sogra no casamento', 'familia se intromete', 'deixar pai e mae'], dores: 'Invasão de privacidade e lealdades divididas', intencoes: 'Afirmar a primazia da nova família que se formou', cuidados: 'Honrar os pais sem permitir intromissões prejudiciais' },
          { id: 'casamento_fe_mista', name: 'Casamento em que apenas um vive a fé', synonyms: ['marido nao vai a missa', 'esposa nao tem fe', 'sozinho na fe no casamento'], dores: 'Solidão espiritual e divergências em oração', intencoes: 'Evangelizar pelo testemunho do amor e da paciência', cuidados: 'Não impor a fé por coerção ou cobrança' },
          { id: 'separacao_divorcio', name: 'Separação e divórcio', synonyms: ['me divorciei', 'separacao conjugal', 'fim do casamento', 'dor da separacao'], dores: 'Sensação de falha, luto de um projeto de vida, desestruturação', intencoes: 'Acolher com misericórdia e amparo pastoral (Amoris Laetitia)', cuidados: 'Nunca estigmatizar a pessoa divorciada; garantir o abraço maternal da Igreja' },
          { id: 'solidao_apos_separacao', name: 'Solidão depois da separação', synonyms: ['solidao pos divorcio', 'sozinho apos separar', 'reconstruir vida solteiro'], dores: 'Vazio na casa, readaptação dolorosa', intencoes: 'Encontrar amparo na comunidade cristã e no amor de Deus', cuidados: 'Fortalecer a autoestima e o autocuidado' },
          { id: 'renovacao_alianca_conjugal', name: 'Renovação do amor e da aliança conjugal', synonyms: ['renovar votos', 'bodas', 'renovacao matrimonial', 'reacender o casamento'], dores: 'Desejo de reconectar e celebrar a fidelidade', intencoes: 'Dar graças pelos anos de matrimônio e renovar o sim diário', cuidados: 'Celebrar a fidelidade como reflexo do amor de Deus' },
        ],
      },
      // 7. Sexualidade, desejo e intimidade (15)
      {
        groupId: 7,
        groupName: 'Sexualidade, desejo e intimidade',
        canonicalPassageKey: 'libertacao_disciplina',
        themes: [
          { id: 'sexualidade_e_fe', name: 'Sexualidade e fé', synonyms: ['sexualidade crista', 'teologia do corpo', 'sexo e deus'], dores: 'Tabus, culpas infundadas ou liberalismo vazio', intencoes: 'Compreender a beleza da sexualidade segundo o plano criador', cuidados: 'Não demonizar o corpo nem reduzir o tema a proibições' },
          { id: 'desejo_dominio_de_si', name: 'Desejo sexual e domínio de si', synonyms: ['dominio proprio', 'controlar os impulsos', 'vencer desejos'], dores: 'Luta contra paixões desordenadas', intencoes: 'Cultivar a virtude da temperança e a guarda dos sentidos', cuidados: 'Apresentar a castidade como liberdade e doação autêntica' },
          { id: 'castidade_namoro', name: 'Castidade no namoro', synonyms: ['pureza no namoro', 'namoro santo', 'limites no namoro'], dores: 'Pressão carnal e incompreensão cultural', intencoes: 'Construir a intimidade na verdade, no respeito e na oração', cuidados: 'Motivar pela grandeza do amor e não pelo medo' },
          { id: 'castidade_solteiro', name: 'Castidade na vida de solteiro', synonyms: ['pureza solteiro', 'viver castidade', 'luta pela castidade'], dores: 'Solidão, tentações constantes e pressão social', intencoes: 'Viver a doação de si e a comunhão com Cristo', cuidados: 'Apoiar com oração, sacramentos e vida comunitária' },
          { id: 'vencendo_pornografia', name: 'Pornografia', synonyms: ['vicio em pornografia', 'pornografia', 'libertacao da pornografia', 'limpar a mente'], dores: 'Culpa, vício, destruição da capacidade de amar', intencoes: 'Alcançar a libertação pela graça, confissão e vigilância', cuidados: 'Tratar com misericórdia e orientar estratégias práticas de desintoxicação' },
          { id: 'masturbacao_conflito_consciencia', name: 'Masturbação e conflitos de consciência', synonyms: ['masturbacao', 'luta contra masturbacao', 'culpa masturbacao'], dores: 'Sensação de fraqueza recorrente e desânimo espiritual', intencoes: 'Reerguer-se na misericórdia e buscar a integração da afetividade', cuidados: 'Não cair em desespero; recorrer aos sacramentos com confiança' },
          { id: 'culpa_vergonha_sexual', name: 'Culpa e vergonha na vida sexual', synonyms: ['vergonha do passado sexual', 'pecados sexuais', 'culpa sexual'], dores: 'Remorso por erros afetivos e sexuais pregressos', intencoes: 'Acolher a purificação plena operada pela graça divina', cuidados: 'Cristo perdoa e restaura a pureza original do coração' },
          { id: 'pressao_relacoes_sexuais', name: 'Pressão para ter relações sexuais', synonyms: ['pressao do namorado para sexo', 'nao quero ceder', 'pressao sexual'], dores: 'Medo de rejeição, confusão entre sexo e amor', intencoes: 'Fortalecer a firmeza e o respeito à própria dignidade', cuidados: 'Quem ama de verdade sabe esperar e respeitar' },
          { id: 'respeito_corpo_limites', name: 'Respeito ao corpo e aos limites do outro', synonyms: ['respeitar limites', 'consentimento e pudor', 'respeito ao conjuge'], dores: 'Invasão e falta de delicadeza', intencoes: 'Viver o amor como doação generosa e reverência', cuidados: 'Rejeitar qualquer forma de abuso ou coerção' },
          { id: 'diferencas_desejo_casal', name: 'Diferenças de desejo sexual no casal', synonyms: ['desejo sexual diferente', 'intimidade no casamento', 'esfriamento na cama'], dores: 'Frustração, sensação de rejeição ou cobrança', intencoes: 'Fomentar o diálogo amoroso e a compreensão mútua', cuidados: 'Priorizar a ternura e a doação desinteressada' },
          { id: 'conversar_intimidade', name: 'Dificuldade de conversar sobre intimidade', synonyms: ['tabu no casamento', 'falar de sexo com o conjuge', 'vergonha de conversar'], dores: 'Bloqueios emocionais e ruídos na comunicação íntima', intencoes: 'Quebrar tabus com delicadeza e amor cristão', cuidados: 'Criar ambiente de confiança e afeto' },
          { id: 'reduzir_pessoas_prazer', name: 'Reduzir pessoas à aparência ou ao prazer', synonyms: ['objetificacao', 'usar as pessoas', 'olhar de cobica'], dores: 'Superficialidade e degradação moral', intencoes: 'Aprender o olhar de Cristo que contempla a pessoa em sua totalidade', cuidados: 'A pessoa humana nunca deve ser tratada como objeto' },
          { id: 'confundir_sexo_amor', name: 'Confundir sexo com amor', synonyms: ['sexo nao e amor', 'carencia afetiva e sexo', 'ilusoes amorosas'], dores: 'Vazio pós-encontros passageiros e solidão', intencoes: 'Buscar o amor verdadeiro fundado no compromisso e no bem do outro', cuidados: 'Esclarecer que a união física expressa a doação total da vida' },
          { id: 'orientacao_sexual_fe', name: 'Orientação sexual, fé e pertencimento', synonyms: ['homossexualidade e fe', 'atração pelo mesmo sexo', 'acolhimento na igreja'], dores: 'Conflito íntimo, medo de rejeição e preconceito', intencoes: 'Acolher com respeito, compaixão e delicadeza (Catecismo 2358)', cuidados: 'Garantir o acolhimento pastoral maternal da Igreja a todos os filhos' },
          { id: 'cura_feridas_abuso', name: 'Cura das feridas de abuso sexual', synonyms: ['abuso sexual', 'trauma de abuso', 'vitima de abuso', 'curar trauma'], dores: 'Dor devastadora, perda de confiança, sentimentos de vergonha indébita', intencoes: 'Proteger a vítima, buscar justiça e promover profunda cura interior e médica', cuidados: 'Tolerância zero ao abuso; nunca culpabilizar a vítima; apoiar integralmente' },
        ],
      },
      // 8. Família, pais e filhos (15)
      {
        groupId: 8,
        groupName: 'Família, pais e filhos',
        canonicalPassageKey: 'familia_filhos',
        themes: [
          { id: 'conflitos_familiares', name: 'Conflitos familiares', synonyms: ['briga na familia', 'problemas em familia', 'desuniao familiar', 'paz na familia'], dores: 'Desgaste, ressentimento entre parentes', intencoes: 'Promover o perdão, a paz e a concórdia doméstica', cuidados: 'Ser agente de reconciliação sem tomar partido no ódio' },
          { id: 'falta_uniao_familia', name: 'Falta de união na família', synonyms: ['familia desunida', 'cada um no seu canto', 'distanciamento familiar'], dores: 'Tristeza por ver a família fragmentada', intencoes: 'Reunir os corações em torno do amor e da oração', cuidados: 'Cultivar momentos de convívio e partilha' },
          { id: 'relacao_dificil_mae', name: 'Relação difícil com a mãe', synonyms: ['problemas com minha mae', 'brigo com minha mae', 'mae controladora', 'magoa da mae'], dores: 'Mágoa filial, cobranças e desentendimentos', intencoes: 'Curar o vínculo materno com honra e limites saudáveis', cuidados: 'Honrar pai e mãe sem se submeter a abusos' },
          { id: 'relacao_dificil_pai', name: 'Relação difícil com o pai', synonyms: ['problemas com meu pai', 'pai ausente', 'pai autoritario', 'magoa do pai'], dores: 'Ferida paterna, carência de validação', intencoes: 'Experimentar o amor curador do Pai do Céu e perdoar o pai terreno', cuidados: 'O amor de Deus supera qualquer imperfeição dos pais terrenos' },
          { id: 'pais_ausentes', name: 'Pais ausentes', synonyms: ['abandono paterno', 'abandono materno', 'cresci sem pai'], dores: 'Sensação de desamparo e falta de referências', intencoes: 'Encontrar amparo absoluto na Providência divina', cuidados: 'Deus é o Pai dos órfãos e protetor dos desvalidos' },
          { id: 'rejeicao_na_familia', name: 'Rejeição dentro da própria família', synonyms: ['ovelha negra', 'rejeitado pelos pais', 'nao me aceitam na familia'], dores: 'Dor do desprezo de quem deveria amar', intencoes: 'Reconhecer o abraço incondicional de Jesus', cuidados: 'Mesmo que os pais esqueçam, Deus jamais esquece' },
          { id: 'magoas_infancia', name: 'Mágoas da infância', synonyms: ['traumas de infancia', 'feridas do passado familiar', 'dor da infancia'], dores: 'Cicatrizes emocionais antigas que ainda doem', intencoes: 'Permitir que Jesus cure a criança interior ferida', cuidados: 'Buscar libertação do ressentimento com oração e acompanhamento' },
          { id: 'rivalidade_irmaos', name: 'Rivalidade entre irmãos', synonyms: ['briga de irmaos', 'inveja entre irmaos', 'irmao contra irmao'], dores: 'Disputa por afeto ou herança, amargura', intencoes: 'Restabelecer a fraternidade e a generosidade', cuidados: 'Superar comparações e ciúmes' },
          { id: 'cuidar_pais_idosos', name: 'Cuidar de pais idosos', synonyms: ['pais idosos', 'cuidar da mae velhinha', 'cuidar do pai idoso', 'cansaco cuidando dos pais'], dores: 'Sobrecarga física e dor de ver o declínio dos pais', intencoes: 'Honrar os pais na velhice com carinho e paciência evangélica', cuidados: 'Cuidar com amor, reconhecendo o sacrifício que eles fizeram' },
          { id: 'educar_filhos_limites', name: 'Educar os filhos com amor e limites', synonyms: ['educacao dos filhos', 'disciplina com amor', 'impor limites aos filhos'], dores: 'Incerteza sobre como corrigir sem traumatizar', intencoes: 'Educar com sabedoria, firmeza e afeto cristão', cuidados: 'Não exasperar os filhos; educar pelo bom exemplo' },
          { id: 'filhos_afastados_fe', name: 'Filhos que se afastaram da fé', synonyms: ['filho nao quer ir a missa', 'filhos longe da igreja', 'oracao pelos filhos'], dores: 'Angústia materna/paterna pela salvação dos filhos', intencoes: 'Perseverar na oração intercessora como Santa Mônica', cuidados: 'Rezar com paciência e testemunhar sem discursos agressivos' },
          { id: 'conflitos_filhos_adultos', name: 'Conflitos com filhos adultos', synonyms: ['filhos grandes', 'brigas com filho adulto', 'respeito entre pais e filhos adultos'], dores: 'Dificuldade de aceitar as escolhas dos filhos', intencoes: 'Aprender a aconselhar com respeito à autonomia deles', cuidados: 'Mudar a relação de autoridade para acompanhamento amoroso' },
          { id: 'criar_filhos_sozinho', name: 'Criar os filhos sem o apoio do outro responsável', synonyms: ['mae solo', 'pai solo', 'criar filho sozinha'], dores: 'Exaustão, sobrecarga total e solidão na criação', intencoes: 'Ministrar força sobrenatural e apoio comunitário', cuidados: 'Acolher com profunda admiração e solidariedade paroquial' },
          { id: 'sobrecarga_sustento_familia', name: 'Sobrecarga de quem sustenta a família', synonyms: ['peso do sustento', 'sustentar a casa sozinho', 'responsabilidade familiar'], dores: 'Pressão financeira e esgotamento físico', intencoes: 'Confiar na Providência divina e valorizar o trabalho honesto', cuidados: 'Dividir fardos com apoio mútuo' },
          { id: 'romper_padroes_familiares', name: 'Romper padrões familiares que causam sofrimento', synonyms: ['repetir erros dos pais', 'maldicao familiar', 'quebrar ciclo de violencia'], dores: 'Medo de repetir comportamentos tóxicos herdados', intencoes: 'Ser instrumento de uma nova história pela graça de Cristo', cuidados: 'Em Cristo somos novas criaturas; a graça quebra velhos ciclos' },
        ],
      },
      // 9. Maternidade, paternidade e chegada dos filhos (15)
      {
        groupId: 9,
        groupName: 'Maternidade, paternidade e chegada dos filhos',
        canonicalPassageKey: 'familia_filhos',
        themes: [
          { id: 'desejo_ser_mae_pai', name: 'Desejo de ser mãe ou pai', synonyms: ['sonho da maternidade', 'quero ser pai', 'quero ser mae', 'desejo de ter filhos'], dores: 'Anseio profundo do coração por gerar vida', intencoes: 'Abençoar o dom da paternidade e maternidade', cuidados: 'Reconhecer os filhos como bênção divina' },
          { id: 'dificuldade_engravidar', name: 'Dificuldade para engravidar', synonyms: ['infertilidade', 'nao consigo engravidar', 'tentante', 'dor da infertilidade'], dores: 'Frustração a cada ciclo, sensação de incompletude', intencoes: 'Consolar o coração e confiar na vontade e no tempo de Deus', cuidados: 'Apoiar sem julgamentos; lembrar de Sara, Ana e Isabel' },
          { id: 'espera_por_um_filho', name: 'Espera por um filho', synonyms: ['gestacao', 'gravidez', 'esperando bebe'], dores: 'Ansiedade com exames e saúde da criança', intencoes: 'Consagrar o bebê a Deus e pedir uma gravidez abençoada', cuidados: 'Cultivar a oração durante a gestação' },
          { id: 'gravidez_nao_planejada', name: 'Gravidez não planejada', synonyms: ['gravidez surpresa', 'engravidei e agora', 'susto da gravidez'], dores: 'Medo do futuro, insegurança material ou afetiva', intencoes: 'Acolher a vida como dom sagrado e insubstituível', cuidados: 'Oferecer todo amparo moral e prático à gestante' },
          { id: 'medo_durante_gravidez', name: 'Medo durante a gravidez', synonyms: ['medo do parto', 'ansiedade na gestacao', 'preocupacao com o bebe'], dores: 'Temor pelo parto e pela saúde do bebê', intencoes: 'Transmitir serenidade e a proteção de Nossa Senhora do Bom Parto', cuidados: 'Fortalecer a paz interior' },
          { id: 'gravidez_de_risco', name: 'Gravidez de risco', synonyms: ['risco gestacional', 'repouso absoluto gravidez', 'complicacoes na gravidez'], dores: 'Aflição constante, medo de perder o bebê', intencoes: 'Interceder pela saúde da mãe e do feto', cuidados: 'Unir a oração fervorosa ao acompanhamento médico estrito' },
          { id: 'perda_gestacional', name: 'Perda gestacional', synonyms: ['aborto espontaneo', 'perdi o bebe', 'luto gestacional'], dores: 'Dor dilacerante e muitas vezes incompreendida pelos outros', intencoes: 'Reconhecer a dignidade daquela vida e confiar a criança ao Pai', cuidados: 'Validar o luto dos pais com imenso respeito e carinho' },
          { id: 'luto_morte_bebe', name: 'Luto pela morte de um bebê', synonyms: ['morte neonatal', 'bebe que faleceu', 'luto de filho pequeno'], dores: 'Tristeza profunda pela partida precoce de um anjinho', intencoes: 'Confortar com a certeza da vida eterna junto a Deus', cuidados: 'Acolher a dor sem tentar amenizar com explicações frias' },
          { id: 'adocao_acolhimento_filho', name: 'Adoção e acolhimento de um filho', synonyms: ['adocao', 'adotar uma crianca', 'filho do coracao'], dores: 'Ansiedade na fila de espera, adaptação familiar', intencoes: 'Celebrar a paternidade e maternidade adotiva como reflexo do amor de Deus', cuidados: 'Enfatizar que o amor é o laço mais nobre da família' },
          { id: 'medo_ser_bom_pai_mae', name: 'Medo de não ser um bom pai ou uma boa mãe', synonyms: ['inseguranca materna', 'medo de falhar como pai', 'vou dar conta de criar'], dores: 'Sentimento de incapacidade diante da responsabilidade', intencoes: 'Recordar que Deus capacita os pais a cada dia', cuidados: 'Focar na presença amorosa e na dedicação sincera' },
          { id: 'esgotamento_maternidade', name: 'Esgotamento na maternidade', synonyms: ['burnout materno', 'mae exausta', 'cansaco da maternidade', 'sem dormir'], dores: 'Exaustão física e mental, noites sem dormir', intencoes: 'Renovar as forças e pedir rede de apoio para a mãe', cuidados: 'Incentivar o descanso e o cuidado com a mãe' },
          { id: 'tristeza_apos_parto', name: 'Tristeza e solidão após o parto', synonyms: ['depressao pos parto', 'baby blues', 'tristeza puerperio'], dores: 'Oscilações hormonais, choro descontrolado, isolamento', intencoes: 'Acolher com imenso carinho e providenciar acompanhamento médico e fraterno', cuidados: 'Tratar com seriedade a saúde mental pós-parto' },
          { id: 'criar_filho_deficiencia', name: 'Criar um filho com deficiência', synonyms: ['filho especial', 'deficiencia infantil', 'autismo na familia', 'luta pelo filho'], dores: 'Desafios diários, preconceito social e preocupação com o futuro', intencoes: 'Exaltar a beleza do amor incondicional e conceder fortaleza', cuidados: 'Apoiar a família com inclusão real e respeito' },
          { id: 'culpa_criacao_filhos', name: 'Culpa por erros na criação dos filhos', synonyms: ['errei com meus filhos', 'culpa materna', 'culpa paterna'], dores: 'Remorso por momentos de impaciência ou ausência', intencoes: 'Receber o perdão de Deus e recomeçar a cada dia com mais ternura', cuidados: 'O amor corrige e cura os erros do passado' },
          { id: 'ninho_vazio_saida_filhos', name: 'Saída dos filhos de casa', synonyms: ['ninho vazio', 'filhos casaram', 'filhos foram morar fora'], dores: 'Saudade e sensação de casa vazia', intencoes: 'Abençoar o voo dos filhos e redescobrir novos propósitos de vida', cuidados: 'Alegre-se com a autonomia que você ajudou a construir' },
        ],
      },
      // 10. Luto, saudade e despedidas (15)
      {
        groupId: 10,
        groupName: 'Luto, saudade e despedidas',
        canonicalPassageKey: 'luto_ressurreicao',
        themes: [
          { id: 'morte_mae', name: 'Morte da mãe', synonyms: ['perdi minha mae', 'saudade da minha mae', 'minha mae faleceu', 'luto de mae'], dores: 'Perda do refúgio materno e da fonte de carinho', intencoes: 'Confortar com a maternidade celeste de Maria e a esperança do reencontro', cuidados: 'Acolher o vazio que a partida materna deixa' },
          { id: 'morte_pai', name: 'Morte do pai', synonyms: ['perdi meu pai', 'meu pai faleceu', 'luto de pai', 'saudade do pai'], dores: 'Perda de um pilar de sustentação e referência', intencoes: 'Ancorar o coração na paternidade eterna de Deus', cuidados: 'Abençoar a memória e o legado do pai' },
          { id: 'morte_filho', name: 'Morte de um filho', synonyms: ['perdi meu filho', 'luto de filho', 'meu filho morreu', 'dor da perda de um filho'], dores: 'A maior dor humana, quebra da ordem natural', intencoes: 'Abraçar os pais em silêncio orante e na promessa da ressurreição', cuidados: 'Nunca tentar justificar com frases feitas; estar presente com compaixão' },
          { id: 'morte_conjuge', name: 'Morte do marido ou da esposa', synonyms: ['perdi meu marido', 'perdi minha esposa', 'viuvéz', 'luto do casamento'], dores: 'Solidão extrema, perda da metade da própria vida', intencoes: 'Sustentar o viúvo/a com carinho e esperança na eternidade', cuidados: 'Ajudar na reconstrução do cotidiano' },
          { id: 'morte_irmao', name: 'Morte de um irmão', synonyms: ['perdi meu irmao', 'meu irmao faleceu', 'luto de irmao'], dores: 'Perda de um companheiro de história e infância', intencoes: 'Reafirmar os laços de comunhão que transcendem a morte', cuidados: 'Acolher a dor familiar conjunta' },
          { id: 'morte_amigo', name: 'Morte de um amigo', synonyms: ['perdi um amigo querido', 'amigo faleceu', 'luto de amigo'], dores: 'Saudade da cumplicidade e das conversas', intencoes: 'Agradecer pelo dom da amizade e orar pelo descanso de sua alma', cuidados: 'Celebrar a gratidão pelos momentos partilhados' },
          { id: 'perda_repentina', name: 'Perda repentina de alguém', synonyms: ['morte subita', 'acidente fatal', 'morreu de repente'], dores: 'Choque, incredulidade e falta de despedida', intencoes: 'Trazer paz ao coração traumatizado e confiar a alma à misericórdia', cuidados: 'Tratar o choque com acolhimento e escuta paciente' },
          { id: 'luto_morte_suicidio', name: 'Luto por alguém que morreu por suicídio', synonyms: ['suicidio na familia', 'luto por suicidio', 'parente que se matou'], dores: 'Culpa terrível, incompreensão, estigma e dor profunda', intencoes: 'Confiar a alma à infinita misericórdia divina que não tem limites (CIC 2283)', cuidados: 'Proibir qualquer condenação; proclamar a esperança na misericórdia' },
          { id: 'saudade_falecidos', name: 'Saudade de quem morreu', synonyms: ['saudade dos que partiram', 'saudade do meu ente querido', 'lembranca de falecidos'], dores: 'Aperto no peito ao recordar momentos felizes', intencoes: 'Transformar a dor da saudade em prece carinhosa e memória viva', cuidados: 'A oração pelos mortos é santa e salutar (2Mc 12,46)' },
          { id: 'culpa_nao_resolvida_morte', name: 'Culpa por algo não resolvido antes de uma morte', synonyms: ['nao deu tempo de pedir perdao', 'briguei antes dele morrer', 'remorso da morte'], dores: 'Remorso por palavras duras ou falta de diálogo', intencoes: 'Entregar tudo ao coração misericordioso de Jesus que une vivos e mortos', cuidados: 'Perdoar-se e confiar na comunhão dos santos' },
          { id: 'revolta_com_deus_luto', name: 'Revolta com Deus depois de uma perda', synonyms: ['com raiva de deus pela morte', 'por que deus levou', 'revolta no luto'], dores: 'Inconformismo e questionamento da justiça divina', intencoes: 'Acolher a revolta humana sem escândalo e reconduzir à paz do mistério', cuidados: 'Deus compreende a dor dos que choram' },
          { id: 'medo_esquecer_falecido', name: 'Medo de esquecer quem morreu', synonyms: ['medo de esquecer a voz', 'esquecer meu ente querido', 'memoria do falecido'], dores: 'Angústia com o passar dos anos', intencoes: 'Saber que o amor nunca perece e permanece vivo no coração de Deus', cuidados: 'Honrar a memória através de boas ações e orações' },
          { id: 'datas_especiais_luto', name: 'Datas especiais durante o luto', synonyms: ['primeiro natal sem ele', 'aniversario do falecido', 'finados', 'dia das maes sem mae'], dores: 'Reabertura de feridas em celebrações familiares', intencoes: 'Dar suporte nas datas difíceis e acender a chama da esperança', cuidados: 'Permitir a expressão da emoção sem pressa' },
          { id: 'acompanhar_enfermo_terminal', name: 'Acompanhar alguém que está morrendo', synonyms: ['paciente terminal', 'despedida de familiar', 'ultimos momentos de vida'], dores: 'Angústia de ver a fraqueza física e a iminência da partida', intencoes: 'Oferecer conforto espiritual, sacramento da Unção dos Enfermos e presença amorosa', cuidados: 'Proporcionar paz, dignidade e oração no leito' },
          { id: 'esperanca_ressurreicao_vida_eterna', name: 'Esperança na ressurreição e na vida eterna', synonyms: ['vida eterna', 'ressurreicao dos mortos', 'ceu e eternidade', 'creio na vida eterna'], dores: 'Desejo de eternidade e consolo perene', intencoes: 'Proclamar a vitória pascal de Jesus Cristo sobre a morte', cuidados: 'A morte não é o fim, mas a passagem para a vida plena' },
        ],
      },
      // 11. Saúde, doença e cuidado (15)
      {
        groupId: 11,
        groupName: 'Saúde, doença e cuidado',
        canonicalPassageKey: 'saude_cura_cuidado',
        themes: [
          { id: 'diagnostico_dificil', name: 'Receber um diagnóstico difícil', synonyms: ['diagnostico grave', 'recebi noticia de doenca', 'resultado ruim de exame'], dores: 'Pavor, choque inicial e incerteza sobre o futuro', intencoes: 'Ancorar a alma na paz de Deus e iniciar o tratamento com coragem', cuidados: 'Aliar fé e confiança aos cuidados da medicina' },
          { id: 'medo_exames_resultados', name: 'Medo de exames e resultados', synonyms: ['esperando resultado de biopsia', 'medo de exame medico', 'ansiedade com laudo'], dores: 'Tensão e noites em claro aguardando laudos', intencoes: 'Serenar a mente e entregar o corpo aos cuidados do Médico dos médicos', cuidados: 'Substituir o desespero pela oração confiante' },
          { id: 'preparacao_cirurgia', name: 'Preparação para uma cirurgia', synonyms: ['vou fazer cirurgia', 'oracao antes da operacao', 'medo de cirurgia'], dores: 'Temor do procedimento cirúrgico e da anestesia', intencoes: 'Pedir que o Espírito Santo guie a equipe médica e abençoe a recuperação', cuidados: 'Ungir com oração e confiança na proteção de Deus' },
          { id: 'enfrentar_cancer', name: 'Enfrentar o câncer', synonyms: ['luta contra o cancer', 'quimioterapia', 'radioterapia', 'tratamento de cancer'], dores: 'Desgaste físico severo, medo da morte e da dor', intencoes: 'Impetrar a graça da cura, força diária e serenidade na batalha', cuidados: 'Apoiar o doente em todas as etapas do tratamento' },
          { id: 'doenca_cronica', name: 'Conviver com uma doença crônica', synonyms: ['doenca sem cura', 'doenca autoimune', 'conviver com a enfermidade'], dores: 'Frustração com limitações permanentes e tratamentos contínuos', intencoes: 'Descobrir a fecundidade espiritual mesmo na limitação corporal', cuidados: 'Promover a paciência e a qualidade de vida' },
          { id: 'dor_fisica_persistente', name: 'Dor física persistente', synonyms: ['dor cronica', 'dor no corpo', 'muita dor fisica', 'nao aguento a dor'], dores: 'Esgotamento físico e psíquico causado pela dor constante', intencoes: 'Aliviar o padecimento e unir a dor às chagas salvadoras de Jesus', cuidados: 'Buscar alívio médico adequado da dor' },
          { id: 'internacao_hospitalar', name: 'Internação hospitalar', synonyms: ['no hospital', 'internado', 'visita a hospital', 'oracao no leito'], dores: 'Isolamento do lar, desconforto e solidão no leito hospitalar', intencoes: 'Levar a presença consoladora da Igreja ao ambiente hospitalar', cuidados: 'Testemunhar a proximidade de Deus no quarto de hospital' },
          { id: 'recuperacao_pos_doenca', name: 'Recuperação depois de uma doença', synonyms: ['convalescenca', 'recuperando a saude', 'pos operatorio', 'reabilitacao'], dores: 'Impaciência com o ritmo lento de recuperação', intencoes: 'Agradecer pelo dom da vida e respeitar o tempo do corpo', cuidados: 'Cultivar a gratidão e a prudência' },
          { id: 'cuidar_pessoa_doente', name: 'Cuidar de uma pessoa doente', synonyms: ['cuidador de doente', 'cuidando de familiar enfermo', 'acompanhante hospitalar'], dores: 'Desgaste físico e emocional ao ver o sofrimento do outro', intencoes: 'Renovar a caridade no serviço ao Cristo presente no enfermo', cuidados: 'Reconhecer a nobreza de servir aos doentes' },
          { id: 'cansaco_cuidador', name: 'Cansaço de quem cuida de alguém', synonyms: ['exaustao do cuidador', 'nao aguento mais cuidar', 'sobrecarga do cuidador'], dores: 'Sobrecarga solitária sem tempo para si', intencoes: 'Proporcionar alívio, descanso e renovação das forças espirituais', cuidados: 'O cuidador também precisa ser cuidado pela comunidade' },
          { id: 'perda_autonomia_fisica', name: 'Perda de autonomia física', synonyms: ['depender dos outros', 'perdi o movimento', 'cadeirante', 'acamado'], dores: 'Sensação de humilhação por depender de auxílio para o básico', intencoes: 'Valorizar a dignidade imutável da alma acima do vigor físico', cuidados: 'Tratar com extrema delicadeza e respeito' },
          { id: 'viver_com_deficiencia', name: 'Viver com uma deficiência', synonyms: ['pessoa com deficiencia', 'pcd e fe', 'superar limitacoes'], dores: 'Barreiras sociais e preconceito', intencoes: 'Afirmar o protagonismo e os dons singulares na comunidade de fé', cuidados: 'Promover a acessibilidade e a inclusão evangélica' },
          { id: 'envelhecimento_fragilidade', name: 'Envelhecimento e fragilidade', synonyms: ['chegando na velhice', 'ficando velho', 'fragilidade da idade'], dores: 'Saudade do vigor da juventude e declínio físico', intencoes: 'Celebrar a sabedoria dos anos e a maturidade espiritual', cuidados: 'A velhice é coroa de honra e tempo de oração fecunda' },
          { id: 'tratamento_sem_culpa_religiosa', name: 'Buscar tratamento sem culpa religiosa', synonyms: ['tomar remedio e fe', 'psiquiatra e igreja', 'medicina e fe'], dores: 'Escrúpulo de achar que buscar remédios é falta de fé', intencoes: 'Reafirmar que Deus criou os remédios e a ciência para a nossa saúde', cuidados: 'Desmistificar qualquer preconceito contra a medicina e a psiquiatria' },
          { id: 'fe_cura_que_nao_chega', name: 'Fé diante de uma cura que não chega', synonyms: ['rezei e nao curou', 'deus nao me curou', 'perseverar sem cura'], dores: 'Dúvida e decepção espiritual após muitas orações', intencoes: 'Compreender a graça misteriosa do "Basta-te a minha graça" (2Cor 12,9)', cuidados: 'Não atribuir a ausência de cura física à falta de fé' },
        ],
      },
      // 12. Trabalho, estudo e vocação (15)
      {
        groupId: 12,
        groupName: 'Trabalho, estudo e vocação',
        canonicalPassageKey: 'trabalho_vocacao',
        themes: [
          { id: 'desemprego', name: 'Desemprego', synonyms: ['estou desempregado', 'desempregada', 'procurando emprego', 'sem trabalho', 'oracao por emprego'], dores: 'Vergonha social, medo de passar necessidade, perda de propósito', intencoes: 'Pedir que se abram portas de trabalho digno e manter a esperança ativa', cuidados: 'Mobilizar a solidariedade comunitária' },
          { id: 'primeiro_emprego', name: 'Busca do primeiro emprego', synonyms: ['primeiro trabalho', 'estagio', 'jovem em busca de emprego'], dores: 'Falta de experiência e portas fechadas', intencoes: 'Despertar a confiança nos próprios talentos e a perseverança', cuidados: 'Encorajar a dedicação e o aprendizado constante' },
          { id: 'medo_perder_trabalho', name: 'Medo de perder o trabalho', synonyms: ['medo de demissao', 'ameaca de demissao', 'instabilidade no emprego'], dores: 'Insegurança com cortes na empresa', intencoes: 'Dar serenidade e sabedoria para agir com excelência e paz', cuidados: 'Confiar que a providência supera as incertezas terrenas' },
          { id: 'sobrecarga_trabalho', name: 'Sobrecarga profissional', synonyms: ['burnout', 'trabalho demais', 'exaustao no servico', 'sobrecarregado no emprego'], dores: 'Fadiga crônica, estresse e falta de tempo para a família', intencoes: 'Reordenar prioridades e defender o direito ao descanso santo', cuidados: 'O trabalho existe para o homem, não o homem para o trabalho' },
          { id: 'falta_reconhecimento_trabalho', name: 'Falta de reconhecimento no trabalho', synonyms: ['nao sou valorizado', 'trabalho duro e ninguem ve', 'desvalorizacao profissional'], dores: 'Frustração e desmotivação', intencoes: 'Trabalhar primariamente para o Senhor com dignidade e paz', cuidados: 'Buscar o justo reconhecimento sem perder a paz interior' },
          { id: 'assedio_humilhacao_trabalho', name: 'Humilhação e perseguição no trabalho', synonyms: ['assedio moral no trabalho', 'chefe abusivo', 'humilhado no emprego'], dores: 'Sofrimento psicológico, injustiça e sensação de impotência', intencoes: 'Defender a própria dignidade e buscar a justiça com sabedoria', cuidados: 'Não tolerar abusos; orientar os canais legítimos de proteção' },
          { id: 'conflitos_no_trabalho', name: 'Conflitos com colegas ou superiores', synonyms: ['brigas no trabalho', 'fofoca no ambiente profissional', 'clima ruim na empresa'], dores: 'Ambiente tóxico e estresse diário', intencoes: 'Ser sal e luz, agindo com profissionalismo, ética e mansidão', cuidados: 'Evitar participar de maledicências' },
          { id: 'honestidade_profissional', name: 'Honestidade no exercício da profissão', synonyms: ['etica no trabalho', 'corrupcao na empresa', 'ser honesto no servico'], dores: 'Pressão para praticar ilegalidades ou "jeitinhos"', intencoes: 'Permanecer íntegro e fiel aos mandamentos de Deus', cuidados: 'A integridade moral vale mais que qualquer vantagem ilícita' },
          { id: 'escolha_profissao', name: 'Escolha de uma profissão', synonyms: ['qual curso fazer', 'escolher carreira', 'duvida profissional'], dores: 'Incerteza diante do futuro profissional', intencoes: 'Alinhar talentos pessoais ao serviço do bem comum', cuidados: 'Buscar discernimento através da oração e da reflexão' },
          { id: 'mudanca_carreira', name: 'Mudança de carreira', synonyms: ['mudar de profissao', 'transicao de carreira', 'comecar de novo no trabalho'], dores: 'Medo de arriscar e sair da zona de conforto', intencoes: 'Dar coragem para abraçar novos caminhos vocacionais', cuidados: 'Planejar com prudência e fé' },
          { id: 'descobrir_dons_vocacao', name: 'Descobrir os próprios dons e a vocação', synonyms: ['qual meu chamado', 'minha vocacao', 'descobrir meus talentos'], dores: 'Sensação de não saber para que nasceu', intencoes: 'Descobrir a beleza da própria vocação (matrimônio, sacerdócio, vida consagrada ou laicato)', cuidados: 'Cada pessoa tem um chamado único na Igreja e no mundo' },
          { id: 'desanimo_estudos', name: 'Desânimo nos estudos', synonyms: ['preguica de estudar', 'nao consigo estudar', 'desmotivado na faculdade'], dores: 'Procrastinação e falta de concentração', intencoes: 'Reacender o amor pela verdade e o valor do estudo para servir', cuidados: 'O estudo é forma de ascese e preparação para servir' },
          { id: 'ansiedade_provas_concursos', name: 'Ansiedade antes de provas e concursos', synonyms: ['ansiedade no enem', 'nervoso na prova', 'concurso publico ansiedade'], dores: 'Branco na mente, tremores e medo do fracasso', intencoes: 'Pedir a luz do Espírito Santo e a serenidade da mente', cuidados: 'Preparar-se com dedicação e confiar o resultado a Deus' },
          { id: 'fracasso_prova_concurso', name: 'Fracasso em uma prova ou seleção', synonyms: ['reprovei no concurso', 'nao passei no vestibular', 'decepcao na prova'], dores: 'Sentimento de tempo perdido e desapontamento', intencoes: 'Levantar a cabeça e perseverar no aprendizado', cuidados: 'Um revés não define a sua capacidade' },
          { id: 'equilibrio_trabalho_familia_fe', name: 'Equilíbrio entre trabalho, família e fé', synonyms: ['tempo para os filhos e trabalho', 'vida equilibrada', 'conciliar trabalho e deus'], dores: 'Sensação de estar sempre correndo sem tempo para o essencial', intencoes: 'Colocar Deus em primeiro lugar para que tudo o mais encontre harmonia', cuidados: 'Santificar o tempo e reservar o domingo para o Senhor e a família' },
        ],
      },
      // 13. Dinheiro, necessidades e bens materiais (15)
      {
        groupId: 13,
        groupName: 'Dinheiro, necessidades e bens materiais',
        canonicalPassageKey: 'dinheiro_providencia',
        themes: [
          { id: 'dividas_endividamento', name: 'Dívidas', synonyms: ['estou endividado', 'muitas dividas', 'nome no spc', 'socorro dividas', 'devendo'], dores: 'Vergonha, sufoco financeiro, noites sem dormir', intencoes: 'Encontrar clareza, prudência na gestão e socorro na Providência', cuidados: 'Não prometer enriquecimento mágico; orientar planejamento e honestidade' },
          { id: 'falta_dinheiro_basico', name: 'Falta de dinheiro para o básico', synonyms: ['sem comida na mesa', 'falta do basico', 'sem condicoes financeiras'], dores: 'Desespero diante da fome ou contas essenciais atrasadas', intencoes: 'Impetrar a Providência Divina e a caridade dos irmãos', cuidados: 'Apoio social imediato pela Pastoral dos Pobres / Vicentinos' },
          { id: 'medo_passar_necessidade', name: 'Medo de passar necessidade', synonyms: ['medo de faltar', 'medo da miseria', 'inseguranca financeira'], dores: 'Ansiedade com a sobrevivência futura', intencoes: 'Meditar na passagem dos lírios do campo e no cuidado paternal de Deus', cuidados: 'Combater a avareza e a preocupação doentia' },
          { id: 'administrar_dinheiro', name: 'Dificuldade de administrar o dinheiro', synonyms: ['desorganizacao financeira', 'gasto sem pensar', 'educacao financeira crista'], dores: 'Salário que acaba rápido e descontrole das contas', intencoes: 'Desenvolver a virtude da prudência e o orçamento sábio', cuidados: 'Usar os bens materiais com responsabilidade' },
          { id: 'compras_por_impulso', name: 'Compras por impulso', synonyms: ['consumismo', 'comprar para preencher vazio', 'vicio em compras'], dores: 'Remorso pós-compra e acúmulo de dívidas', intencoes: 'Buscar a verdadeira saciedade que só a graça de Deus oferece', cuidados: 'Libertar-se das armadilhas da propaganda consumista' },
          { id: 'apego_ao_dinheiro', name: 'Apego ao dinheiro', synonyms: ['avareza', 'amor ao dinheiro', 'muito apegado aos bens'], dores: 'Dureza de coração e medo constante de perder posses', intencoes: 'Desapegar o coração dos bens terrenos para acolher o tesouro do Céu', cuidados: 'A raiz de todos os males é o amor ao dinheiro (1Tm 6,10)' },
          { id: 'inveja_prosperidade_alheia', name: 'Inveja da prosperidade dos outros', synonyms: ['inveja de quem ganha mais', 'olho gordo', 'inveja do sucesso alheio'], dores: 'Amargura ao ver o progresso do próximo', intencoes: 'Alegre-se com as bênçãos dos irmãos e cultivar gratidão', cuidados: 'A inveja corrói a alma; a caridade alegra-se com a verdade' },
          { id: 'ambicao_sem_limites', name: 'Ambição sem limites', synonyms: ['ganancia', 'querer sempre mais', 'ambicao desmedida'], dores: 'Vida agitada sem descanso nem paz espiritual', intencoes: 'Buscar o Reino de Deus e a sua justiça em primeiro lugar', cuidados: 'De que adianta ao homem ganhar o mundo inteiro se perder a sua alma?' },
          { id: 'pressao_ostentar', name: 'Pressão para ostentar', synonyms: ['ostentacao', 'viver de aparencias', 'comprar para mostrar'], dores: 'Escravidão do status e dívidas desnecessárias', intencoes: 'Viver na nobre simplicidade e na liberdade dos filhos de Deus', cuidados: 'O valor da pessoa está em quem ela é, não no que exibe' },
          { id: 'generosidade_com_pouco', name: 'Generosidade mesmo tendo pouco', synonyms: ['partilhar com pouco', 'oferta da viuva', 'dizimo de coracao'], dores: 'Achar que só quem tem muito pode ajudar', intencoes: 'Celebrar o coração generoso da viúva pobre elogiada por Jesus', cuidados: 'Deus não olha a quantia, mas o amor com que se partilha' },
          { id: 'emprestar_nao_receber', name: 'Emprestar dinheiro e não receber', synonyms: ['calote', 'emprestei e nao me pagaram', 'prejuizo financeiro com amigo'], dores: 'Sensação de injustiça e mágoa do devedor', intencoes: 'Buscar a devida justiça com serenidade e perdoar a ofensa', cuidados: 'Evitar misturar amizade com negócios temerários' },
          { id: 'perda_patrimonio', name: 'Perda de patrimônio', synonyms: ['perdi minha casa', 'golpe financeiro', 'perda de bens'], dores: 'Luto de anos de trabalho perdidos em um golpe ou crise', intencoes: 'Reencontrar a rocha inabalável que é Cristo Jesus', cuidados: 'Bens materiais passam, mas a fé e a dignidade permanecem' },
          { id: 'fracasso_negocio', name: 'Fracasso de um negócio', synonyms: ['empresa quebrou', 'falencia', 'fechar as portas'], dores: 'Sensação de derrota, dívidas empresariais', intencoes: 'Reerguer-se com sabedoria, honestidade e fé no recomeço', cuidados: 'Aprender com os erros e confiar na força de Deus' },
          { id: 'confianca_providencia_deus', name: 'Confiança na providência de Deus', synonyms: ['deus provera', 'providencia divina', 'confiar no sustento de deus'], dores: 'Tentação de desespero em momentos de escassez', intencoes: 'Descansar na fidelidade dAquele que alimenta os pássaros do céu', cuidados: 'Confiança em Deus anda de mãos dadas com o trabalho diligente' },
          { id: 'contentamento_vida_simples', name: 'Contentamento e vida simples', synonyms: ['viver com simplicidade', 'contentamento', 'vida minimalista crista'], dores: 'Insatisfação com o padrão de vida atual', intencoes: 'Descobrir a alegria profunda de ter o coração livre e agradecido', cuidados: 'A verdadeira riqueza é a paz de uma consciência pura' },
        ],
      },
      // 14. Perdão, culpa e reconciliação (15)
      {
        groupId: 14,
        groupName: 'Perdão, culpa e reconciliação',
        canonicalPassageKey: 'perdao_misericordia',
        themes: [
          { id: 'dificuldade_perdoar', name: 'Dificuldade de perdoar', synonyms: ['nao consigo perdoar', 'perdao dificil', 'como perdoar', 'dor da ofensa'], dores: 'Coração amarrado pela mágoa, repetição mental da ofensa', intencoes: 'Alcançar a graça de perdoar setenta vezes sete por amor a Cristo', cuidados: 'O perdão não é esquecimento automático nem sentimento, mas ato de vontade' },
          { id: 'dificuldade_pedir_perdao', name: 'Dificuldade de pedir perdão', synonyms: ['orgulho para pedir desculpa', 'como pedir perdao', 'humildade para reconciliar'], dores: 'Orgulho paralisante e vergonha de admitir o erro', intencoes: 'Desarmar a vaidade e experimentar a nobreza da humildade', cuidados: 'Pedir perdão liberta quem errou e quem foi ofendido' },
          { id: 'perdoar_a_si_mesmo', name: 'Perdoar a si mesmo', synonyms: ['nao me perdoo', 'culpa de mim mesmo', 'autoacusacao', 'perdoar meu passado'], dores: 'Autopunição, vergonha crônica de erros pregressos', intencoes: 'Aceitar a absolvição divina: se Deus perdoou, quem sou eu para me condenar?', cuidados: 'Não ser mais severo consigo mesmo do que a própria misericórdia divina' },
          { id: 'ressentimento_amargura', name: 'Ressentimento e amargura', synonyms: ['amargura no coracao', 'ressentido', 'veneno da amargura', 'raiz de amargura'], dores: 'Alma envenenada que perde a doçura e a paz', intencoes: 'Arrancar a raiz de amargura pelo poder do Espírito Santo', cuidados: 'A amargura adoece o corpo e a mente' },
          { id: 'desejo_vinganca', name: 'Desejo de vingança', synonyms: ['quero me vingar', 'desejo de retribuicao', 'odio do ofensor'], dores: 'Fúria que consome a mente com pensamentos de destruição', intencoes: 'Entregar a justiça a Deus e vencer o mal com a força do bem', cuidados: 'A vingança aprisiona; o perdão liberta' },
          { id: 'culpa_erros_passado', name: 'Culpa por erros do passado', synonyms: ['remorso do passado', 'erros que cometi', 'arrependido do que fiz'], dores: 'Peso esmagador de decisões erradas já tomadas', intencoes: 'Mergulhar no oceano da infinita misericórdia de Deus', cuidados: 'O passado está sepultado na misericórdia; viva o presente em santidade' },
          { id: 'arrependimento_sincero', name: 'Arrependimento sincero', synonyms: ['estou arrependido', 'dor pelos pecados', 'contricao de coracao'], dores: 'Tristeza santa por ter ofendido a Deus e ao próximo', intencoes: 'Celebrar a contrição perfeita que conduz ao sacramento da Confissão', cuidados: 'A tristeza segundo Deus produz arrependimento para a salvação' },
          { id: 'reparar_mal_feito', name: 'Reparar o mal que se fez', synonyms: ['reparacao de danos', 'como consertar meu erro', 'devolver o que peguei'], dores: 'Inquietude de consciência enquanto não se repara a injustiça', intencoes: 'Seguir o exemplo de Zaqueu, reparando o mal com generosidade', cuidados: 'A reconciliação autêntica inclui o desejo sincero de reparação' },
          { id: 'receber_perdao_deus', name: 'Receber o perdão de Deus', synonyms: ['deus me perdoa', 'misericordia divina', 'absolvicao dos pecados'], dores: 'Dúvida se ainda há esperança de salvação', intencoes: 'Proclamar que onde abundou o pecado, superabundou a graça', cuidados: 'Não há pecado maior que a misericórdia de Deus para quem se arrepende' },
          { id: 'medo_nao_merecer_perdao', name: 'Medo de não merecer perdão', synonyms: ['sou imperdoavel', 'meu pecado foi muito grave', 'deus nao vai me perdoar'], dores: 'Desesperança espiritual inspirada pelo acusador', intencoes: 'Lembrar que o perdão é dom gratuito e não mérito pessoal', cuidados: 'Jesus veio para os doentes e pecadores, não para os justos' },
          { id: 'reincidencia_erro', name: 'Voltar a errar depois de se arrepender', synonyms: ['cai de novo', 'reincidencia no pecado', 'prometi nao errar e errei'], dores: 'Desânimo, vergonha de confessar mais uma vez', intencoes: 'Levantar-se imediatamente sem perder o ânimo na luta espiritual', cuidados: 'O justo cai sete vezes e se levanta; nunca desista da conversão' },
          { id: 'reconciliacao_pos_briga', name: 'Reconciliação depois de uma briga', synonyms: ['fazer as pazes', 'reatar laco', 'terminar a briga'], dores: 'Afastamento doloroso e silêncio constrangedor', intencoes: 'Dar o primeiro passo para estender a mão e restabelecer a harmonia', cuidados: 'Antes de apresentar a tua oferta no altar, reconcilia-te com teu irmão' },
          { id: 'perdoar_com_limites', name: 'Perdoar sem retomar uma convivência prejudicial', synonyms: ['perdoar com distancia', 'perdoar sem conviver', 'limites no relacionamento'], dores: 'Culpa por precisar manter distância de pessoas agressivas', intencoes: 'Esclarecer que perdoar não obriga a se colocar em risco de abusos', cuidados: 'O perdão no coração não anula a prudência e a proteção da própria vida' },
          { id: 'lidar_com_quem_nao_assume_erro', name: 'Lidar com quem não reconhece o próprio erro', synonyms: ['ele nao admite o erro', 'vitimismo alheio', 'pessoa nao pede desculpas'], dores: 'Frustração diante da cegueira e soberba alheia', intencoes: 'Entregar a pessoa a Deus e resguardar a própria paz', cuidados: 'Não podemos forçar a conversão de ninguém; reze por eles' },
          { id: 'deixar_acusar_passado', name: 'Deixar de usar o passado contra alguém', synonyms: ['jogar na cara', 'lembrar erros antigos', 'acusacao no relacionamento'], dores: 'Rancor que ressuscita feridas já cicatrizadas', intencoes: 'Sepultar os erros no perdão e não usá-los como arma em brigas', cuidados: 'O amor não guarda rancor nem reabre dívidas já perdoadas' },
        ],
      },
      // 15. Raiva, convivência e comunicação (15)
      {
        groupId: 15,
        groupName: 'Raiva, convivência e comunicação',
        canonicalPassageKey: 'mansidao_pacificacao',
        themes: [
          { id: 'raiva_explosoes', name: 'Raiva e explosões emocionais', synonyms: ['ataque de raiva', 'raiva descontrolada', 'furia', 'perco a cabeca'], dores: 'Vergonha após explosões, destruição de relacionamentos', intencoes: 'Desenvolver o fruto do Espírito: mansidão e domínio de si', cuidados: 'Identificar as causas profundas da ira e praticar a pausa orante' },
          { id: 'impaciencia', name: 'Impaciência', synonyms: ['pavio curto', 'sem paciencia', 'me irrito facil', 'impaciente'], dores: 'Tensão constante com a lentidão dos processos e pessoas', intencoes: 'Pedir a paciência de Deus que tudo suporta com amor', cuidados: 'A paciência é a musculatura da caridade' },
          { id: 'palavras_que_machucam', name: 'Palavras que machucam', synonyms: ['falei o que nao devia', 'lingua afiada', 'ofensas verbais'], dores: 'Remorso por ferir quem se ama com ofensas duras', intencoes: 'Consagrar a língua a Deus para que só profira palavras de bênção', cuidados: 'A língua tem o poder da vida e da morte (Tg 3)' },
          { id: 'fofoca_maledicencia', name: 'Fofoca', synonyms: ['fofocas', 'falar mal dos outros', 'maledicencia', 'comentarios maldosos'], dores: 'Divisão comunitária e assassinato da reputação alheia', intencoes: 'Purificar as conversas e falar apenas para edificar', cuidados: 'A fofoca é veneno mortal que destrói a caridade fraterna' },
          { id: 'calunia_difamacao', name: 'Calúnia e difamação', synonyms: ['fui caluniado', 'falsas acusacoes', 'difamaram meu nome'], dores: 'Dor da injustiça e da mentira espalhada', intencoes: 'Encontrar refúgio no Deus da verdade que defende o inocente', cuidados: 'Não pagar calúnia com calúnia; viver na retidão' },
          { id: 'mentira_falsidade', name: 'Mentira', synonyms: ['vicio em mentir', 'falsidade', 'falta com a verdade'], dores: 'Perda de credibilidade e teia de enganos', intencoes: 'Abraçar a verdade que liberta e viver com transparência', cuidados: 'A mentira procede do maligno; a verdade edifica a comunhão' },
          { id: 'discussoes_redes_sociais', name: 'Discussões nas redes sociais', synonyms: ['briga no zap', 'cancelamento na internet', 'discussoes no instagram'], dores: 'Ansiedade com comentários tóxicos e polêmicas estéreis', intencoes: 'Usar as redes com prudência, moderação e caridade', cuidados: 'Não alimentar polarizações odiosas' },
          { id: 'necessidade_ter_razao', name: 'Necessidade de ter sempre razão', synonyms: ['sempre quero estar certo', 'teimosia', 'nao dou o braco a torcer'], dores: 'Isolamento e brigas desgastantes por vaidade intelectual', intencoes: 'Preferir a comunhão e a caridade ao mero triunfo de ter razão', cuidados: 'Mais vale ter paz do que ter razão a todo custo' },
          { id: 'orgulho_impede_dialogo', name: 'Orgulho que impede o diálogo', synonyms: ['orgulho bobo', 'nao abaixo a cabeca', 'arrogancia'], dores: 'Rompimento de amizades e casamentos por endurecimento', intencoes: 'Aprender do Coração manso e humilde de Jesus', cuidados: 'Deus resiste aos soberbos, mas dá sua graça aos humildes' },
          { id: 'julgar_pela_aparencia', name: 'Julgar as pessoas pela aparência', synonyms: ['julgamento precipitado', 'julgar os outros', 'preconceito com pessoas'], dores: 'Injustiças cometidas e falta de empatia', intencoes: 'Olhar as pessoas com a misericórdia com que Deus nos olha', cuidados: 'Não julgueis para que não sejais julgados' },
          { id: 'ouvir_antes_responder', name: 'Ouvir antes de responder', synonyms: ['aprender a escutar', 'pronto para ouvir', 'nao interromper'], dores: 'Respostas precipitadas que geram discórdia', intencoes: 'Cultivar a escuta atenta, paciente e acolhedora', cuidados: 'O sábio escuta com atenção antes de emitir sua opinião' },
          { id: 'falar_verdade_com_caridade', name: 'Falar a verdade com caridade', synonyms: ['correcao fraterna', 'verdade sem ferir', 'dizer a verdade com amor'], dores: 'Falar de modo brutal ou calar-se por covardia', intencoes: 'Equilibrar a coragem da verdade com a doçura da caridade', cuidados: 'A verdade sem caridade é crueldade; a caridade sem verdade é falsidade' },
          { id: 'colocar_limites_sem_agredir', name: 'Colocar limites sem agredir', synonyms: ['aprender a dizer nao', 'limites com educacao', 'firmeza com amor'], dores: 'Passividade excessiva ou reações desmedidas', intencoes: 'Agir com firmeza tranquila e respeito mútuo', cuidados: 'Colocar limites é ato de amor próprio e de respeito ao outro' },
          { id: 'lidar_com_criticas', name: 'Lidar com críticas', synonyms: ['ofendido com criticas', 'como receber criticas', 'chateado com opinioes'], dores: 'Ferida no amor-próprio e reação defensiva', intencoes: 'Aproveitar as críticas justas para crescer e relevar as injustas', cuidados: 'A humildade acolhe a correção; a sabedoria discerne o que é proveitoso' },
          { id: 'ser_instrumento_de_paz', name: 'Ser instrumento de paz em um conflito', synonyms: ['fazer a paz', 'mediar conflitos', 'instrumento de vossa paz'], dores: 'Estar no meio de brigas familiares ou profissionais', intencoes: 'Rezar a oração de São Francisco e promover a concórdia', cuidados: 'Bem-aventurados os que promovem a paz' },
        ],
      },
      // 16. Hábitos, vícios e liberdade interior (15)
      {
        groupId: 16,
        groupName: 'Hábitos, vícios e liberdade interior',
        canonicalPassageKey: 'libertacao_disciplina',
        themes: [
          { id: 'dependencia_alcool', name: 'Dependência de álcool', synonyms: ['alcoolismo', 'parar de beber', 'vicio em bebida', 'alcolismo e fe'], dores: 'Destruição da saúde, da família e perda de controle', intencoes: 'Buscar a sobriedade pela graça divina, grupos de apoio (AA) e tratamento', cuidados: 'Tratar o alcoolismo como doença e dependência que exige apoio integral' },
          { id: 'dependencia_drogas', name: 'Dependência de drogas', synonyms: ['drogas', 'vicio em substancias', 'parar de usar drogas', 'libertacao das drogas'], dores: 'Degradação física, risco de morte e dor dos familiares', intencoes: 'Libertação integral em comunidades terapêuticas e na graça dos sacramentos', cuidados: 'Acolher sem julgamento moralista; providenciar tratamento imediato' },
          { id: 'vicio_apostas_jogos', name: 'Vício em apostas e jogos de azar', synonyms: ['jogo do tigrinho', 'apostas online', 'ludopatia', 'perdi dinheiro em apostas'], dores: 'Ruína financeira rápida, desespero e compulsão', intencoes: 'Quebrar o ciclo da ilusão da ganância e restabelecer o domínio próprio', cuidados: 'Bloquear acessos a plataformas e buscar apoio profissional' },
          { id: 'uso_excessivo_celular', name: 'Uso excessivo do celular', synonyms: ['vicio em tela', 'celular o dia todo', 'nomofobia', 'desintoxicacao digital'], dores: 'Perda de tempo precioso, déficit de atenção e superficialidade', intencoes: 'Recuperar o tempo para Deus, a oração e o convívio real', cuidados: 'Estabelecer jejuns de telas e limites de uso' },
          { id: 'dependencia_redes_sociais', name: 'Dependência de redes sociais', synonyms: ['viciado no instagram', 'scroll infinito', 'redes sociais me fazem mal'], dores: 'Comparação contínua, perda de paz e ansiedade', intencoes: 'Resgatar a interioridade e a beleza da vida real', cuidados: 'Silenciar notificações e buscar a presença de Deus no silêncio' },
          { id: 'procrastinacao', name: 'Procrastinação', synonyms: ['procrastinando', 'deixar para depois', 'preguica', 'adiando deveres'], dores: 'Culpa, acúmulo de tarefas e ansiedade de última hora', intencoes: 'Viver o dever de estado com diligência e amor a Deus', cuidados: 'Dividir grandes metas em pequenos passos na presença de Deus' },
          { id: 'falta_disciplina', name: 'Falta de disciplina', synonyms: ['sem rotina', 'indisciplinado', 'falta de constancia', 'vida desregrada'], dores: 'Instabilidade e sensação de estagnação na vida', intencoes: 'Cultivar a virtude da ordem como caminho de santidade', cuidados: 'A santidade se constrói na fidelidade às pequenas coisas do dia' },
          { id: 'descontrole_impulsos', name: 'Descontrole diante dos próprios impulsos', synonyms: ['impulsividade', 'faco sem pensar', 'descontrole emocional'], dores: 'Arrependimento imediato após ações impensadas', intencoes: 'Alcançar o fruto do domínio próprio e a prudência', cuidados: 'Aprender a respirar e fazer uma breve oração antes de agir' },
          { id: 'tentacoes_recorrentes', name: 'Tentações recorrentes', synonyms: ['muitas tentacoes', 'luta espiritual', 'tentações fortes', 'combate espiritual'], dores: 'Cansaço da luta contra o pecado', intencoes: 'Vigiar e orar, revestindo-se da armadura de Deus (Ef 6)', cuidados: 'Sentir tentação não é pecar; o mérito está na resistência e oração' },
          { id: 'recaida_vicio', name: 'Recaída em um vício', synonyms: ['tive uma recaida', 'reincidi no vicio', 'vergonha da recaida'], dores: 'Desolação e tentação de desistir de lutar', intencoes: 'Levantar-se sem demora: uma recaída não anula o caminho já percorrido', cuidados: 'Voltar imediatamente para a Confissão e reforçar a vigilância' },
          { id: 'vergonha_pedir_ajuda_vicio', name: 'Vergonha de admitir que precisa de ajuda', synonyms: ['orgulho no vicio', 'nao consigo sozinho e tenho vergonha'], dores: 'Solidão e agravamento do vício no segredo', intencoes: 'Vencer o medo e abrir o coração para quem pode ajudar', cuidados: 'O segredo alimenta o vício; a luz da partilha traz a cura' },
          { id: 'persistencia_mudar_habito', name: 'Persistência para mudar um hábito', synonyms: ['mudar de vida', 'criar novos habitos', 'perseverar no bem'], dores: 'Dificuldade de manter a constância nos primeiros dias', intencoes: 'Pedir a graça da perseverança final dia após dia', cuidados: 'Focar na vitória do dia de hoje: "só por hoje"' },
          { id: 'familiar_dependente_quimico', name: 'Lidar com um familiar dependente químico', synonyms: ['filho viciado', 'marido alcoolatra', 'familiar nas drogas', 'codependencia'], dores: 'Desespero familiar, impotência e codependência', intencoes: 'Aprender a amar com limites saudáveis e buscar grupos como Amor Exigente', cuidados: 'Cuidar da própria sanidade para não afundar junto com o doente' },
          { id: 'fugir_ambientes_recaida', name: 'Libertar-se de ambientes que favorecem recaídas', synonyms: ['ocasiao de pecado', 'fugir das mas companhias', 'lugares perigosos'], dores: 'Saudade de velhos círculos e medo de isolamento', intencoes: 'Praticar a virtude da fuga das ocasiões de pecado com coragem', cuidados: 'Quem ama o perigo nele perecerá (Eclo 3,27)' },
          { id: 'descansar_sem_culpa', name: 'Aprender a descansar sem culpa', synonyms: ['nao sei relaxar', 'culpa ao descansar', 'descanso santo'], dores: 'Vício em trabalho e incapacidade de parar', intencoes: 'Descobrir o valor do repouso no Senhor (Shabbat cristão)', cuidados: 'O descanso é mandamento divino e ato de confiança na Providência' },
        ],
      },
      // 17. Fé, oração e relacionamento com Deus (15)
      {
        groupId: 17,
        groupName: 'Fé, oração e relacionamento com Deus',
        canonicalPassageKey: 'oracao_intimidade_deus',
        themes: [
          { id: 'dificuldade_rezar', name: 'Dificuldade de rezar', synonyms: ['nao consigo rezar', 'como orar', 'oracao seca', 'distracao na oracao'], dores: 'Aridez espiritual, preguiça e mente dispersa', intencoes: 'Aprender a oração simples do coração, confiando no Espírito', cuidados: 'A oração não é sentimento, mas perseverança no diálogo com Deus' },
          { id: 'sensacao_deus_nao_escuta', name: 'Sensação de que Deus não escuta', synonyms: ['deus nao me ouve', 'minha oracao nao sobe', 'deus esta longe'], dores: 'Sensação de abandono e preces não atendidas', intencoes: 'Descansar na certeza de que Deus sempre acolhe e cuida de seus filhos', cuidados: 'Deus responde no tempo certo e da melhor maneira para a salvação' },
          { id: 'silencio_de_deus', name: 'Silêncio de Deus', synonyms: ['deus em silencio', 'noite escura da alma', 'silencio divino'], dores: 'Deserto espiritual e falta de consolações sensíveis', intencoes: 'Amadurecer a fé pura que ama a Deus por Si mesmo e não por seus consolos', cuidados: 'O silêncio de Deus também é linguagem de amor e amadurecimento' },
          { id: 'duvidas_existencia_deus', name: 'Dúvidas sobre a existência de Deus', synonyms: ['sera que deus existe', 'duvidas na fe', 'crise de fe'], dores: 'Insegurança existencial e questionamentos intelectuais', intencoes: 'Buscar a verdade com honestidade e rezar: "Senhor, aumenta a minha fé!"', cuidados: 'A dúvida honesta pode conduzir a uma fé mais profunda e madura' },
          { id: 'fe_enfraquecida', name: 'Fé enfraquecida', synonyms: ['minha fe esta fraca', 'perdi a fe', 'fe abalada'], dores: 'Esfriamento espiritual e perda do fervor', intencoes: 'Reacender a chama da fé pela oração e pelos sacramentos', cuidados: 'A fé cresce quando é exercitada no amor ao próximo' },
          { id: 'falta_vontade_ir_igreja', name: 'Falta de vontade de ir à igreja', synonyms: ['sem vontade de ir a missa', 'preguica de ir a igreja', 'desanimo eclesial'], dores: 'Rotina fria e desmotivação dominical', intencoes: 'Redescobrir a Eucaristia como banquete de amor e encontro pessoal com Cristo', cuidados: 'Ir à Missa é ato de amor e gratidão a Deus, não mera obrigação social' },
          { id: 'voltar_para_deus', name: 'Voltar para Deus depois de se afastar', synonyms: ['afastei da igreja', 'quero voltar para deus', 'filho prodigo', 'reconciliacao com deus'], dores: 'Vergonha de ter passado anos longe dos sacramentos', intencoes: 'Celebrar a alegria da parábola do Filho Pródigo que volta para os braços do Pai', cuidados: 'O Pai corre ao encontro de quem decide voltar' },
          { id: 'revolta_com_deus', name: 'Revolta com Deus', synonyms: ['raiva de deus', 'por que deus permitiu', 'magoado com deus'], dores: 'Incompreensão diante de tragédias e dores profundas', intencoes: 'Derramar o coração diante do Senhor com sinceridade e encontrar a paz', cuidados: 'Deus não tem medo dos nossos desabafos sinceros; Ele é Pai compassivo' },
          { id: 'confiar_sem_entender', name: 'Confiar em Deus sem entender o que acontece', synonyms: ['nao entendo os planos de deus', 'misterio de deus', 'confiar no escuro'], dores: 'Angústia diante de caminhos desconcertantes', intencoes: 'Fazer o ato de fé heroico: "Seja feita a vossa vontade"', cuidados: 'Os pensamentos de Deus são mais altos que os nossos (Is 55)' },
          { id: 'aprender_agradecer', name: 'Aprender a agradecer', synonyms: ['gratidao a deus', 'agradecer pelas bencaos', 'oracao de acao de gracas'], dores: 'Foco excessivo nos problemas que cega para as graças recebidas', intencoes: 'Desenvolver a atitude constante da gratidão que transforma a vida', cuidados: 'Em tudo dai graças, pois esta é a vontade de Deus (1Ts 5,18)' },
          { id: 'louvar_nas_dificuldades', name: 'Louvar a Deus nas dificuldades', synonyms: ['louvor na provacao', 'cantar na tribulacao', 'bendito seja deus'], dores: 'Luta contra a murmuração e o azedume', intencoes: 'Experimentar a força libertadora do louvor que abre cadeias espirituais', cuidados: 'O louvor na dor é o sacrifício de lábios mais agradável ao Senhor' },
          { id: 'perseveranca_na_oracao', name: 'Perseverança na oração', synonyms: ['orar sem cessar', 'perseverar rezando', 'nao desistir de orar'], dores: 'Desânimo quando o pedido parece demorar a ser atendido', intencoes: 'Imitar a viúva persistente que orava com fé inabalável', cuidados: 'A oração perseverante molda o nosso coração para receber a graça' },
          { id: 'discernir_vontade_deus', name: 'Discernir a vontade de Deus', synonyms: ['o que deus quer de mim', 'vontade divina', 'como saber a vontade de deus'], dores: 'Medo de errar a vocação e os passos da vida', intencoes: 'Buscar o silêncio, a Palavra de Deus e a direção espiritual', cuidados: 'A vontade de Deus é sempre a nossa santificação e paz' },
          { id: 'relacionamento_espirito_santo', name: 'Relacionamento com o Espírito Santo', synonyms: ['dons do espirito santo', 'intimidade com espirito', 'oracao ao espirito'], dores: 'Viver a fé apenas como rito externo sem o fogo do Espírito', intencoes: 'Clamar o Espírito Santo como Consolador, Mestre e Guia diário', cuidados: 'O Espírito Santo é o Doce Hóspede da nossa alma' },
          { id: 'sentir_se_amado_por_deus', name: 'Sentir-se amado por Deus', synonyms: ['deus me ama', 'amor de deus por mim', 'experiencia do amor divino'], dores: 'Coração ferido que duvida do amor paternal', intencoes: 'Fazer a profunda experiência do amor incondicional e eterno de Deus', cuidados: 'Deus te amou com amor eterno e com misericórdia te atraiu' },
        ],
      },
      // 18. Vida católica e caminhada espiritual (15)
      {
        groupId: 18,
        groupName: 'Vida católica e caminhada espiritual',
        canonicalPassageKey: 'oracao_intimidade_deus',
        themes: [
          { id: 'confissao_medo_confessar', name: 'Confissão e medo de confessar os pecados', synonyms: ['medo do padre', 'vergonha de confessar', 'sacramento da penitencia', 'como me confessar'], dores: 'Vergonha moral e medo de julgamento pelo sacerdote', intencoes: 'Redescobrir o confessionário como tribunal de misericórdia e cura', cuidados: 'O padre acolhe em nome de Cristo Médico, não para condenar' },
          { id: 'preparacao_eucaristia', name: 'Preparação para receber a Eucaristia', synonyms: ['comunhao', 'receber a hostia sagrada', 'preparar para comungar'], dores: 'Comungar por rotina sem a devida reverência', intencoes: 'Aproximar-se do Santíssimo Sacramento com coração puro, jejum e fervor', cuidados: 'Examinar a consciência antes de receber o Corpo de Cristo' },
          { id: 'missa_com_mais_sentido', name: 'Participar da missa com mais sentido', synonyms: ['entender a missa', 'missa viva', 'valor da santa missa'], dores: 'Tédio ou desatenção durante a celebração litúrgica', intencoes: 'Mergulhar no mistério do Santo Sacrifício do Calvário renovado no altar', cuidados: 'A Missa é o cume e a fonte de toda a vida cristã' },
          { id: 'maria_exemplo_fe', name: 'Maria como exemplo de fé e confiança', synonyms: ['nossa senhora', 'devocao mariana', 'terco', 'rosario', 'exemplo de maria'], dores: 'Dificuldade de entrega e obediência à vontade de Deus', intencoes: 'Aprender do "Faça-se em mim" (Fiat) e refugiar-se sob o manto materno', cuidados: 'Maria nos conduz sempre a Jesus: "Fazei tudo o que Ele vos disser"' },
          { id: 'intercessao_exemplo_santos', name: 'Intercessão e exemplo dos santos', synonyms: ['santos da igreja', 'comunhao dos santos', 'pedir intercessao'], dores: 'Sentir-se fraco na caminhada cristã', intencoes: 'Inspirar-se na multidão de testemunhas que venceram na fé', cuidados: 'Os santos intercedem por nós e mostram que a santidade é possível' },
          { id: 'santidade_vida_cotidiana', name: 'Chamado à santidade na vida cotidiana', synonyms: ['ser santo no dia a dia', 'santidade no trabalho', 'chamado universal a santidade'], dores: 'Achar que a santidade é privilégio exclusivo de padres e freiras', intencoes: 'Viver a santidade ordinária nas obrigações diárias com amor extraordinário', cuidados: 'A santidade consiste em fazer com perfeição e amor as pequenas coisas' },
          { id: 'jejum_e_penitencia', name: 'Jejum e penitência', synonyms: ['fazer jejum', 'penitencia quaresmal', 'mortificacao crista'], dores: 'Resistência da carne e desorientação sobre o sentido do jejum', intencoes: 'Dominar o homem velho para abrir espaço à fome de Deus e à caridade', cuidados: 'O jejum cristão deve sempre resultar em conversão e esmola ao irmão' },
          { id: 'conversao_mudanca_vida', name: 'Conversão e mudança de vida', synonyms: ['metanoia', 'quero mudar de vida', 'conversao sincera'], dores: 'Luta contra velhos hábitos e fraquezas', intencoes: 'Acolher a força renovadora do Evangelho para uma vida nova', cuidados: 'A conversão é um processo diário que dura toda a vida terrena' },
          { id: 'escrupulos_medo_pecar', name: 'Escrúpulos e medo constante de pecar', synonyms: ['escrupuloso', 'medo de pecar em tudo', 'doenca do escrupulo'], dores: 'Angústia neurótica de consciência e pânico espiritual', intencoes: 'Repousar na paz de Cristo e obedecer a um confessor prudente', cuidados: 'Libertar a alma do rigorismo estéril para viver na alegre confiança filial' },
          { id: 'decepcao_pessoas_igreja', name: 'Decepção com pessoas da Igreja', synonyms: ['fofoca na igreja', 'escandalo de fieis', 'decepcionado com a paroquia'], dores: 'Mágoa e tentação de abandonar a fé por causa dos outros', intencoes: 'Olhar para Cristo, que é a Cabeça sem mancha, mesmo com membros pecadores', cuidados: 'Não abandonar Jesus por causa das fraquezas dos homens' },
          { id: 'feridas_liderancas_religiosas', name: 'Feridas causadas por lideranças religiosas', synonyms: ['magoado com padre', 'abuso de autoridade religiosa', 'pastoral toxica'], dores: 'Desilusão profunda e ferida na alma', intencoes: 'Acolher a dor com verdade e buscar cura no Bom Pastor que jamais erra', cuidados: 'Tratar com firmeza os abusos e acolher as vítimas com justiça e carinho' },
          { id: 'servir_sem_vaidade', name: 'Servir na Igreja sem buscar reconhecimento', synonyms: ['trabalho pastoral', 'vaidade no ministerio', 'servir sem aplausos'], dores: 'Mágoa por não ser elogiado ou inveja de ministérios alheios', intencoes: 'Servir no anonimato pelo puro amor a Jesus Cristo', cuidados: 'Que a tua mão esquerda não saiba o que faz a direita' },
          { id: 'cansaco_trabalho_pastoral', name: 'Cansaço de quem trabalha na pastoral', synonyms: ['pastoral cansativa', 'burnout na paroquia', 'sobrecarga na igreja'], dores: 'Exaustão por acúmulo de funções pastorais', intencoes: 'Descansar no Coração de Jesus e partilhar responsabilidades', cuidados: 'Não substituir o Deus da obra pela obra de Deus' },
          { id: 'evangelizar_propria_familia', name: 'Evangelizar a própria família', synonyms: ['minha familia nao quer deus', 'evangelizar parentes', 'oracao pela familia'], dores: 'Zombaria ou resistência dos parentes à mensagem do Evangelho', intencoes: 'Evangelizar pela coerência de vida, paciência e amor servicial', cuidados: 'Mais vale uma gota de exemplo do que um oceano de sermões' },
          { id: 'unidade_entre_cristaos', name: 'Unidade entre os cristãos', synonyms: ['ecumenismo', 'unidade da igreja', 'que todos sejam um'], dores: 'Tristeza pelas divisões e rivalidades no corpo cristão', intencoes: 'Rezar pela unidade visível segundo a oração sacerdotal de Jesus', cuidados: 'Buscar o diálogo na caridade e na fidelidade à verdade revelada' },
        ],
      },
      // 19. Justiça, proteção e responsabilidade com o próximo (15)
      {
        groupId: 19,
        groupName: 'Justiça, proteção e responsabilidade com o próximo',
        canonicalPassageKey: 'justica_protecao',
        themes: [
          { id: 'sofrer_injustica', name: 'Sofrer injustiça', synonyms: ['injusticado', 'sofrendo injustica', 'fui lesado', 'justica divina'], dores: 'Sensação de impotência, revolta contra a impunidade', intencoes: 'Clamar pela justiça de Deus e manter a integridade moral', cuidados: 'Não buscar vingança com as próprias mãos; o Senhor é o justo juiz' },
          { id: 'violencia_domestica', name: 'Violência dentro de casa', synonyms: ['agressao em casa', 'marido bate', 'violencia domestica', 'socorro violencia'], dores: 'Terror, ameaça à integridade física e medo constante', intencoes: 'Proteger a vida com urgência, acionar a lei (180) e prover abrigo e amparo', cuidados: 'NUNCA recomendar permanência sob agressão física ou risco de vida' },
          { id: 'relacionamento_abusivo', name: 'Relacionamento abusivo', synonyms: ['abuso psicologico', 'marido abusivo', 'violencia psicologica', 'relacao abusiva'], dores: 'Manipulação, perda de autonomia, isolamento e medo', intencoes: 'Resgatar a dignidade, romper com o ciclo de abuso e buscar ajuda', cuidados: 'Não distorcer passagens de perdão ou submissão para justificar abusos' },
          { id: 'manipulacao_chantagem', name: 'Manipulação e chantagem emocional', synonyms: ['chantagem emocional', 'manipulado por pessoas', 'culpa induzida'], dores: 'Confusão mental, sentimento de prisão e culpa injusta', intencoes: 'Reconhecer a verdade e colocar limites claros e saudáveis', cuidados: 'O amor cristão liberta na verdade; a manipulação escraviza' },
          { id: 'bullying_humilhacao', name: 'Bullying e humilhação', synonyms: ['sofrendo bullying', 'humilhado na escola', 'zombarias'], dores: 'Angústia, medo de ir à escola ou trabalho, isolamento', intencoes: 'Fortalecer a autoestima na dignidade divina e denunciar as agressões', cuidados: 'Combater ativamente toda forma de humilhação' },
          { id: 'racismo_discriminacao', name: 'Racismo e discriminação', synonyms: ['preconceito racial', 'discriminacao', 'racismo e fe'], dores: 'Dor da exclusão e do insulto pela cor da pele ou origem', intencoes: 'Proclamar que todos são criados à imagem de Deus e iguais em dignidade', cuidados: 'O racismo é pecado grave contra a dignidade humana e a fraternidade' },
          { id: 'perseguicao_por_fe', name: 'Perseguição por causa da fé', synonyms: ['perseguido por ser cristao', 'martirio', 'intolerancia religiosa'], dores: 'Ridicularização ou violência por testemunhar a Cristo', intencoes: 'Permanecer firme com a bem-aventurança dos perseguidos por causa da justiça', cuidados: 'Rezar pelos perseguidores e manter o testemunho heroico' },
          { id: 'coragem_denunciar_mal', name: 'Coragem para denunciar o mal', synonyms: ['denunciar o crime', 'nao ser conivente', 'falar a verdade contra o erro'], dores: 'Medo de retaliação e solidão na defesa do bem', intencoes: 'Agir com a valentia dos profetas em favor da verdade e dos vulneráveis', cuidados: 'Agir com prudência e retidão de intenção' },
          { id: 'corrupcao_obter_vantagens', name: 'Corrupção e tentação de obter vantagens', synonyms: ['tentacao de suborno', 'jeitinho desonesto', 'levar vantagem'], dores: 'Conflito de consciência diante de ganhos fáceis ilícitos', intencoes: 'Escolher a santidade e a retidão que agradam a Deus', cuidados: 'Melhor é o pouco com justiça do que grandes rendimentos com iniquidade' },
          { id: 'exercer_autoridade_justica', name: 'Exercer autoridade com justiça', synonyms: ['ser chefe justo', 'autoridade e servico', 'lideranca crista'], dores: 'Tentação de autoritarismo e abuso de poder', intencoes: 'Exercer a liderança como serviço humilde a exemplo de Jesus', cuidados: 'Quem quiser ser o maior, seja o servo de todos' },
          { id: 'responsabilidade_cargo_publico', name: 'Responsabilidade de quem ocupa cargo público', synonyms: ['politica e fe', 'servidor publico', 'bem comum'], dores: 'Pressões políticas e tentações de desvio de conduta', intencoes: 'Dedicar-se integralmente ao bem comum e à justiça social', cuidados: 'A política autêntica é uma das formas mais altas da caridade' },
          { id: 'solidariedade_com_pobres', name: 'Solidariedade com os pobres', synonyms: ['ajudar os pobres', 'caridade aos necessitados', 'opcao pelos pobres'], dores: 'Indiferença social e egoísmo', intencoes: 'Ver o rosto de Cristo nos pequeninos e partilhar a vida', cuidados: 'O que fizerdes ao menor dos meus irmãos, a mim o fizestes (Mt 25)' },
          { id: 'acolhimento_migrantes', name: 'Acolhimento de migrantes e pessoas deslocadas', synonyms: ['migrantes', 'refugiados', 'acolher o estrangeiro'], dores: 'Desterro, saudade da pátria, preconceito', intencoes: 'Viver a hospitalidade evangélica com quem busca abrigo e dignidade', cuidados: 'Fui estrangeiro e me acolhestes' },
          { id: 'cuidado_criacao_ambiente', name: 'Cuidado com a criação e o meio ambiente', synonyms: ['ecologia integral', 'cuidar da natureza', 'laudato si'], dores: 'Degradação ambiental que afeta sobretudo os mais pobres', intencoes: 'Cultivar e guardar a Casa Comum com respeito e responsabilidade', cuidados: 'A criação é dom sagrado de Deus confiado à humanidade' },
          { id: 'paz_contra_guerras_violencia', name: 'Paz diante das guerras e da violência', synonyms: ['paz no mundo', 'fim das guerras', 'oracao pela paz'], dores: 'Angústia diante de conflitos armados e terrorismo', intencoes: 'Clamar pela conversão dos corações e pelo triunfo da reconciliação', cuidados: 'A paz é fruto da justiça e da caridade fraterna' },
        ],
      },
      // 20. Decisões, mudanças e amadurecimento (15)
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
          { id: 'mudanca_cidade_distancia', name: 'Mudança de cidade e distância da família', synonyms: ['mudei de cidade', 'longe da familia', 'saudade de casa', 'morando sozinho'], dores: 'Solidão da adaptação e saudade dos entes queridos', intencoes: 'Fazer da nova cidade um campo de missão e encontrar a família da fé', cuidados: 'Deus está presente em todos os lugares' },
          { id: 'paciencia_processos_demorados', name: 'Paciência com processos demorados', synonyms: ['processo lento', 'demora para acontecer', 'aguardar resposta'], dores: 'Cansaço com a burocracia e lentidão da vida', intencoes: 'Aprender a maturidade que se forja na espera serena', cuidados: 'A paciência alcança tudo (Santa Teresa de Jesus)' },
          { id: 'perseverar_sem_ver_resultados', name: 'Perseverar sem ver resultados', synonyms: ['nao vejo frutos', 'parece que nada muda', 'desanimo na colheita'], dores: 'Sensação de esforço em vão', intencoes: 'Saber que quem semeia com lágrimas colherá com júbilo a seu tempo', cuidados: 'O agricultor espera com paciência o precioso fruto da terra' },
          { id: 'reconhecer_hora_mudar', name: 'Reconhecer quando é hora de mudar de caminho', synonyms: ['hora de mudar', 'fechar ciclos', 'mudar de rota'], dores: 'Apego a projetos falidos por medo da mudança', intencoes: 'Discernir os sinais de Deus para encerrar ciclos com gratidão e paz', cuidados: 'A sabedoria sabe quando insistir e quando seguir em frente' },
          { id: 'consequencias_proprias_escolhas', name: 'Lidar com consequências das próprias escolhas', synonyms: ['arcar com as consequencias', 'colher o que plantei', 'responsabilidade das escolhas'], dores: 'Dor de colher frutos amargos de erros passados', intencoes: 'Assumir com maturidade e saber que Deus transforma o mal em bem', cuidados: 'Tudo concorre para o bem dos que amam a Deus' },
          { id: 'humildade_aprender_correcao', name: 'Humildade para aprender e ser corrigido', synonyms: ['aceitar correcao', 'aprender com erros', 'ser corrigido'], dores: 'Orgulho ferido diante de advertências justas', intencoes: 'Acolher a correção fraterna como prova de amor e caminho de sabedoria', cuidados: 'Quem ama a disciplina ama o conhecimento' },
          { id: 'gratidao_pequenas_coisas', name: 'Gratidão pelas pequenas coisas', synonyms: ['alegria no simples', 'agradecer o dia a dia', 'pequenos milagres'], dores: 'Cegueira diante das bênçãos cotidianas', intencoes: 'Contemplar a ternura de Deus no ar, no pão e nos sorrisos de cada dia', cuidados: 'A felicidade cristã floresce na gratidão pelas coisas simples' },
          { id: 'viver_com_proposito', name: 'Viver com propósito no cotidiano', synonyms: ['viver com sentido', 'proposito diário', 'fazer a diferenca'], dores: 'Sensação de rotina vazia e automática', intencoes: 'Fazer de cada ação diária uma oferta de amor a Deus e ao próximo', cuidados: 'Quer comais, quer bebais, fazei tudo para a glória de Deus' },
          { id: 'construir_legado_amor', name: 'Construir um legado de amor e serviço', synonyms: ['deixar um legado', 'memoria do bem', 'fazer o bem em vida'], dores: 'Preocupação com a fecundidade da própria vida', intencoes: 'Semear a justiça, a verdade e o amor que ecoam para a eternidade', cuidados: 'No entardecer da vida, seremos julgados pelo amor (São João da Cruz)' },
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
  }

  /**
   * Busca determinística por correspondência exata de sinônimos ou fuzzy pastoral
   */
  public matchTheme(rawQuery: string): DeterministicThemeItem | null {
    if (!rawQuery || !rawQuery.trim()) return null;

    const norm = normalizeText(rawQuery);

    // 1. Verificação direta no índice de sinônimos O(1)
    if (this.synonymIndex.has(norm)) {
      return this.synonymIndex.get(norm)!;
    }

    // 2. Busca por substring exata
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

    // 3. Pontuação de palavras-chave pastorais (dores e intenções)
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

      if (score > maxScore && score >= 5) {
        maxScore = score;
        bestMatch = item;
      }
    }

    return bestMatch;
  }

  /**
   * Constrói a resposta oficial de 12 versículos bíblicos literais
   */
  public resolvePassages(themeItem: DeterministicThemeItem): ScripturePassage[] {
    const rawRefs = themeItem.passages;
    const resolvedList: ScripturePassage[] = [];

    for (let i = 0; i < rawRefs.length; i++) {
      const ref = rawRefs[i];
      const passage = fullBibleService.createScripturePassage(
        ref.book,
        ref.chapter,
        ref.verseStart,
        ref.verseEnd,
        ref.text,
        [themeItem.name, themeItem.groupName]
      );
      resolvedList.push(passage);
    }

    return resolvedList.slice(0, 12);
  }
}

export const deterministicEngine = new DeterministicEngine();
