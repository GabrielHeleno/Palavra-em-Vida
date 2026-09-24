export interface ImpactfulQuote {
  id: number;
  trecho: string;
  referencia: string;
  parcial: boolean;
}

export interface ImpactfulQuotesData {
  traducao: string;
  limite_caracteres_trecho: number;
  observacao_referencias: string;
  passagens: ImpactfulQuote[];
}

export const IMPACTFUL_QUOTES: ImpactfulQuotesData = {
  "traducao": "Pe. Antônio Pereira de Figueiredo, com ortografia e pontuação atualizadas",
  "limite_caracteres_trecho": 130,
  "observacao_referencias": "Mateus segue a numeração corrente. Nos Salmos, a numeração hebraica aparece entre parênteses.",
  "passagens": [
    {
      "id": 1,
      "trecho": "Bem-aventurados os mansos: porque eles possuirão a terra.",
      "referencia": "Mateus 5,5",
      "parcial": false
    },
    {
      "id": 2,
      "trecho": "Bem-aventurados os que têm fome e sede de justiça: porque eles serão fartos.",
      "referencia": "Mateus 5,6",
      "parcial": false
    },
    {
      "id": 3,
      "trecho": "Bem-aventurados os misericordiosos: porque eles alcançarão misericórdia.",
      "referencia": "Mateus 5,7",
      "parcial": false
    },
    {
      "id": 4,
      "trecho": "Bem-aventurados os limpos de coração: porque eles verão a Deus.",
      "referencia": "Mateus 5,8",
      "parcial": false
    },
    {
      "id": 5,
      "trecho": "Bem-aventurados os pacíficos: porque eles serão chamados filhos de Deus.",
      "referencia": "Mateus 5,9",
      "parcial": false
    },
    {
      "id": 6,
      "trecho": "Porque onde está o teu tesouro, aí está também o teu coração.",
      "referencia": "Mateus 6,21",
      "parcial": false
    },
    {
      "id": 7,
      "trecho": "Buscai pois primeiramente o reino de Deus e a sua justiça: e todas estas coisas se vos acrescentarão.",
      "referencia": "Mateus 6,33",
      "parcial": false
    },
    {
      "id": 8,
      "trecho": "Pedi, e dar-se-vos-á: buscai, e achareis: batei, e abrir-se-vos-á.",
      "referencia": "Mateus 7,7",
      "parcial": false
    },
    {
      "id": 9,
      "trecho": "E assim tudo o que vós quereis que vos façam os homens, fazei-o também vós a eles. Porque esta é a lei e os profetas.",
      "referencia": "Mateus 7,12",
      "parcial": false
    },
    {
      "id": 10,
      "trecho": "Vinde a mim todos os que andais em trabalho e vos achais carregados, e eu vos aliviarei.",
      "referencia": "Mateus 11,28",
      "parcial": false
    },
    {
      "id": 11,
      "trecho": "Porque o meu jugo é suave, e o meu ônus é leve.",
      "referencia": "Mateus 11,30",
      "parcial": false
    },
    {
      "id": 12,
      "trecho": "Eu estou convosco todos os dias, até à consumação do século.",
      "referencia": "Mateus 28,20",
      "parcial": true
    },
    {
      "id": 13,
      "trecho": "Eu sou a luz do mundo: o que me segue não anda em trevas, mas terá o lume da vida.",
      "referencia": "João 8,12",
      "parcial": true
    },
    {
      "id": 14,
      "trecho": "E conhecereis a verdade, e a verdade vos livrará.",
      "referencia": "João 8,32",
      "parcial": false
    },
    {
      "id": 15,
      "trecho": "Eu sou o bom pastor. O bom pastor dá a própria vida pelas suas ovelhas.",
      "referencia": "João 10,11",
      "parcial": false
    },
    {
      "id": 16,
      "trecho": "Eu sou a ressurreição e a vida: o que crê em mim, ainda que esteja morto, viverá.",
      "referencia": "João 11,25",
      "parcial": true
    },
    {
      "id": 17,
      "trecho": "Eu dou-vos um novo mandamento: que vos ameis uns aos outros, assim como eu vos amei, para que vós também mutuamente vos ameis.",
      "referencia": "João 13,34",
      "parcial": false
    },
    {
      "id": 18,
      "trecho": "Não se turbe o vosso coração. Credes em Deus, crede também em mim.",
      "referencia": "João 14,1",
      "parcial": false
    },
    {
      "id": 19,
      "trecho": "Eu sou o caminho, e a verdade, e a vida: ninguém vem ao Pai senão por mim.",
      "referencia": "João 14,6",
      "parcial": true
    },
    {
      "id": 20,
      "trecho": "A paz vos deixo, a minha paz vos dou, e eu não vo-la dou como a dá o mundo.",
      "referencia": "João 14,27",
      "parcial": true
    },
    {
      "id": 21,
      "trecho": "Como meu Pai me amou, assim vos amei eu. Permanecei no meu amor.",
      "referencia": "João 15,9",
      "parcial": false
    },
    {
      "id": 22,
      "trecho": "O meu preceito é este, que vos ameis uns aos outros, como eu vos amei.",
      "referencia": "João 15,12",
      "parcial": false
    },
    {
      "id": 23,
      "trecho": "Ninguém tem maior amor do que este, de dar um a própria vida por seus amigos.",
      "referencia": "João 15,13",
      "parcial": false
    },
    {
      "id": 24,
      "trecho": "Vós haveis de ter aflições no mundo: mas tende confiança, eu venci o mundo.",
      "referencia": "João 16,33",
      "parcial": true
    },
    {
      "id": 25,
      "trecho": "Porque a Deus nada é impossível.",
      "referencia": "Lucas 1,37",
      "parcial": false
    },
    {
      "id": 26,
      "trecho": "Sede pois misericordiosos, como também vosso Pai é misericordioso.",
      "referencia": "Lucas 6,36",
      "parcial": false
    },
    {
      "id": 27,
      "trecho": "Antes bem-aventurados aqueles que ouvem a palavra de Deus e a guardam.",
      "referencia": "Lucas 11,28",
      "parcial": true
    },
    {
      "id": 28,
      "trecho": "Se Deus é por nós, quem será contra nós?",
      "referencia": "Romanos 8,31",
      "parcial": true
    },
    {
      "id": 29,
      "trecho": "Na esperança alegres, na tribulação sofridos, na oração perseverantes.",
      "referencia": "Romanos 12,12",
      "parcial": false
    },
    {
      "id": 30,
      "trecho": "Não te deixes vencer do mal, mas vence o mal com o bem.",
      "referencia": "Romanos 12,21",
      "parcial": false
    },
    {
      "id": 31,
      "trecho": "A caridade é paciente, é benigna, a caridade não é invejosa, não obra temerária, nem precipitadamente, não se ensoberbece.",
      "referencia": "1 Coríntios 13,4",
      "parcial": false
    },
    {
      "id": 32,
      "trecho": "Agora pois permanecem a fé, a esperança, a caridade, estas três virtudes; porém, a maior delas é a caridade.",
      "referencia": "1 Coríntios 13,13",
      "parcial": false
    },
    {
      "id": 33,
      "trecho": "Todas as vossas obras sejam feitas em caridade.",
      "referencia": "1 Coríntios 16,14",
      "parcial": false
    },
    {
      "id": 34,
      "trecho": "Se algum pois é de Cristo, é uma nova criatura, passou o que era velho: notai que tudo se fez novo.",
      "referencia": "2 Coríntios 5,17",
      "parcial": false
    },
    {
      "id": 35,
      "trecho": "Não nos cansemos pois de fazer bem: porque a seu tempo segaremos, não desfalecendo.",
      "referencia": "Gálatas 6,9",
      "parcial": false
    },
    {
      "id": 36,
      "trecho": "O Senhor me governa, e nada me faltará.",
      "referencia": "Salmos 22(23),1",
      "parcial": true
    },
    {
      "id": 37,
      "trecho": "Gostai e vede quão suave é o Senhor: ditoso o homem que espera nele.",
      "referencia": "Salmos 33(34),9",
      "parcial": false
    },
    {
      "id": 38,
      "trecho": "Tem confiança no Senhor de todo o teu coração, e não te estribes na tua prudência.",
      "referencia": "Provérbios 3,5",
      "parcial": false
    },
    {
      "id": 39,
      "trecho": "Bem-aventurados os que choram: porque eles serão consolados.",
      "referencia": "Mateus 5,4",
      "parcial": false
    },
    {
      "id": 40,
      "trecho": "E assim não andeis inquietos pelo dia de amanhã.",
      "referencia": "Mateus 6,34",
      "parcial": true
    },
    {
      "id": 41,
      "trecho": "Eu sou o pão da vida: o que vem a mim não terá jamais fome, e o que crê em mim não terá jamais sede.",
      "referencia": "João 6,35",
      "parcial": true
    },
    {
      "id": 42,
      "trecho": "Todo o que meu Pai me dá virá a mim: e o que vem a mim, eu não o lançarei fora.",
      "referencia": "João 6,37",
      "parcial": false
    },
    {
      "id": 43,
      "trecho": "Em verdade, em verdade vos digo: o que crê em mim tem a vida eterna.",
      "referencia": "João 6,47",
      "parcial": false
    },
    {
      "id": 44,
      "trecho": "Ora nós sabemos que aos que amam a Deus, todas as coisas lhes contribuem para seu bem.",
      "referencia": "Romanos 8,28",
      "parcial": true
    },
    {
      "id": 45,
      "trecho": "O amor seja sem fingimento. Aborrecei o mal, aderi ao bem.",
      "referencia": "Romanos 12,9",
      "parcial": false
    },
    {
      "id": 46,
      "trecho": "Amai-vos reciprocamente com amor fraternal: adiantai-vos em honrar uns aos outros.",
      "referencia": "Romanos 12,10",
      "parcial": false
    },
    {
      "id": 47,
      "trecho": "Alegrai-vos com os que se alegram, chorai com os que choram.",
      "referencia": "Romanos 12,15",
      "parcial": false
    },
    {
      "id": 48,
      "trecho": "Se pode ser, quanto estiver da vossa parte, tende paz com todos os homens.",
      "referencia": "Romanos 12,18",
      "parcial": false
    },
    {
      "id": 49,
      "trecho": "Perto está o Senhor daqueles que têm o coração atribulado: e aos humildes de espírito os salvará.",
      "referencia": "Salmos 33(34),19",
      "parcial": false
    },
    {
      "id": 50,
      "trecho": "Traze-o no pensamento em todos os teus caminhos, e ele mesmo dirigirá os teus passos.",
      "referencia": "Provérbios 3,6",
      "parcial": false
    }
  ]
};
