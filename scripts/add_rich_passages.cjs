const fs = require('fs');
const path = require('path');

const dbPath = path.resolve(__dirname, '../src/data/initialBibleDatabase.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

const additionalPassages = [
  {
    id: "BJ-1COR-13-4-7",
    translationId: "BJ",
    book: "1 Coríntios",
    bookAbbr: "1Cor",
    chapter: 13,
    verseStart: 4,
    verseEnd: 7,
    displayRef: "1Cor 13, 4-7",
    text: "O amor é paciente, é prestativo; não é invejoso, não se orgulha. Não busca seu interesse, não se irrita, não guarda rancor. Tudo desculpa, tudo crê, tudo espera, tudo suporta. O amor jamais acabará.",
    themes: ["Serviço e caridade", "Amor de Deus", "Paz e serenidade", "Família e matrimônio"],
    dbVersion: "1.3.0-nexa",
    testament: "NT"
  },
  {
    id: "BJ-SL-23-1-3",
    translationId: "BJ",
    book: "Salmos",
    bookAbbr: "Sl",
    chapter: 23,
    verseStart: 1,
    verseEnd: 3,
    displayRef: "Sl 23, 1-3",
    text: "O Senhor é o meu pastor: nada me falta. Em verdes pastagens me faz repousar; conduz-me junto às águas tranquilas e restaura as minhas forças; guia-me pelos caminhos retos por amor do seu nome.",
    themes: ["Esperança nas dificuldades", "Paz e serenidade", "Amor de Deus", "Confiança"],
    dbVersion: "1.3.0-nexa",
    testament: "AT"
  },
  {
    id: "BJ-LC-1-46-49",
    translationId: "BJ",
    book: "Lucas",
    bookAbbr: "Lc",
    chapter: 1,
    verseStart: 46,
    verseEnd: 49,
    displayRef: "Lc 1, 46-49",
    text: "A minha alma engrandece o Senhor, e o meu espírito se alegra em Deus, meu Salvador, porque olhou para a humildade de sua serva. Doravante todas as gerações me chamarão bem-aventurada, porque o Poderoso fez por mim maravilhas.",
    themes: ["Oração e intimidade com Deus", "Humildade", "Disponibilidade e vocação", "Ação de graças"],
    dbVersion: "1.3.0-nexa",
    testament: "NT"
  },
  {
    id: "BJ-EF-4-31-32",
    translationId: "BJ",
    book: "Efésios",
    bookAbbr: "Ef",
    chapter: 4,
    verseStart: 31,
    verseEnd: 32,
    displayRef: "Ef 4, 31-32",
    text: "Toda amargura, ira, cólera, clamor e calúnia sejam banidos do meio de vós, bem como toda malícia. Sede bondosos e compassivos, perdoando-vos mutuamente, como Deus vos perdoou em Cristo.",
    themes: ["Perdão e reconciliação", "Paz e serenidade", "Misericórdia", "Conversão e mudança de vida"],
    dbVersion: "1.3.0-nexa",
    testament: "NT"
  },
  {
    id: "BJ-MT-5-3-6",
    translationId: "BJ",
    book: "Mateus",
    bookAbbr: "Mt",
    chapter: 5,
    verseStart: 3,
    verseEnd: 6,
    displayRef: "Mt 5, 3-6",
    text: "Bem-aventurados os pobres de espírito, porque deles é o Reino dos Céus. Bem-aventurados os mansos, porque herdarão a terra. Bem-aventurados os que choram, porque serão consolados. Bem-aventurados os que têm fome de justiça.",
    themes: ["Santidade", "Esperança nas dificuldades", "Sabedoria e discernimento", "Justiça"],
    dbVersion: "1.3.0-nexa",
    testament: "NT"
  },
  {
    id: "BJ-JO-15-9-11",
    translationId: "BJ",
    book: "João",
    bookAbbr: "Jo",
    chapter: 15,
    verseStart: 9,
    verseEnd: 11,
    displayRef: "Jo 15, 9-11",
    text: "Como o Pai me amou, também eu vos amei: permanecei no meu amor. Se guardardes os meus mandamentos, permanecereis no meu amor. Disse-vos estas coisas para que a minha alegria esteja em vós e a vossa alegria seja completa.",
    themes: ["Amor de Deus", "Paz e serenidade", "Fidelidade", "Comunhão"],
    dbVersion: "1.3.0-nexa",
    testament: "NT"
  },
  {
    id: "BJ-ECLO-2-1-3",
    translationId: "BJ",
    book: "Eclesiástico",
    bookAbbr: "Eclo",
    chapter: 2,
    verseStart: 1,
    verseEnd: 3,
    displayRef: "Eclo 2, 1-3",
    text: "Meu filho, se te apresentas para servir ao Senhor, prepara a tua alma para a provação. Tem o coração reto e sê constante; não te perturbes no tempo da adversidade. Une-te a Deus e não te afastes, para seres cumulado de bens.",
    themes: ["Fortaleza e perseverança", "Esperança nas dificuldades", "Sabedoria e discernimento", "Fidelidade"],
    dbVersion: "1.3.0-nexa",
    testament: "AT",
    isDeuterocanonical: true
  },
  {
    id: "BJ-TB-4-7-8",
    translationId: "BJ",
    book: "Tobias",
    bookAbbr: "Tb",
    chapter: 4,
    verseStart: 7,
    verseEnd: 8,
    displayRef: "Tb 4, 7-8",
    text: "Dá esmola de teus bens; se vires um pobre, não desvies o teu rosto, para que Deus não desvie o seu de ti. Conforme as tuas posses, sê generoso: se tiveres muito, dá com abundância; se tiveres pouco, reparte de bom coração.",
    themes: ["Serviço e caridade", "Solidariedade", "Generosidade", "Misericórdia"],
    dbVersion: "1.3.0-nexa",
    testament: "AT",
    isDeuterocanonical: true
  },
  {
    id: "BJ-SB-7-26-27",
    translationId: "BJ",
    book: "Sabedoria",
    bookAbbr: "Sb",
    chapter: 7,
    verseStart: 26,
    verseEnd: 27,
    displayRef: "Sb 7, 26-27",
    text: "A Sabedoria é o reflexo da luz eterna, espelho sem mancha da atividade de Deus e imagem da sua bondade. Sendo única, tudo pode; permanecendo em si mesma, tudo renova e, passando às almas santas, forma amigos de Deus.",
    themes: ["Sabedoria e discernimento", "Santidade", "Luz divina", "Graça"],
    dbVersion: "1.3.0-nexa",
    testament: "AT",
    isDeuterocanonical: true
  },
  {
    id: "BJ-MT-6-25-26",
    translationId: "BJ",
    book: "Mateus",
    bookAbbr: "Mt",
    chapter: 6,
    verseStart: 25,
    verseEnd: 26,
    displayRef: "Mt 6, 25-26",
    text: "Não vos preocupeis com a vossa vida, pelo que haveis de comer, nem com o vosso corpo, pelo que haveis de vestir. Olhai as aves do céu: não semeiam, não colhem, nem ajuntam em celeiros; e vosso Pai celeste as alimenta.",
    themes: ["Paz e serenidade", "Esperança nas dificuldades", "Confiança", "Amor de Deus"],
    dbVersion: "1.3.0-nexa",
    testament: "NT"
  },
  {
    id: "BJ-FP-4-6-7",
    translationId: "BJ",
    book: "Filipenses",
    bookAbbr: "Fp",
    chapter: 4,
    verseStart: 6,
    verseEnd: 7,
    displayRef: "Fp 4, 6-7",
    text: "Não vos inquieteis com nada; apresentai as vossas súplicas a Deus com orações e ações de graças. E a paz de Deus, que excede todo entendimento, guardará os vossos corações e vossos pensamentos em Cristo Jesus.",
    themes: ["Paz e serenidade", "Oração e intimidade com Deus", "Confiança"],
    dbVersion: "1.3.0-nexa",
    testament: "NT"
  },
  {
    id: "BJ-RM-8-38-39",
    translationId: "BJ",
    book: "Romanos",
    bookAbbr: "Rm",
    chapter: 8,
    verseStart: 38,
    verseEnd: 39,
    displayRef: "Rm 8, 38-39",
    text: "Tenho certeza de que nem a morte, nem a vida, nem presentes nem futuros, nem qualquer outra criatura poderá nos separar do amor de Deus que está em Cristo Jesus, nosso Senhor.",
    themes: ["Amor de Deus", "Fortaleza e perseverança", "Esperança nas dificuldades", "Fé"],
    dbVersion: "1.3.0-nexa",
    testament: "NT"
  },
  {
    id: "BJ-SL-103-1-3",
    translationId: "BJ",
    book: "Salmos",
    bookAbbr: "Sl",
    chapter: 103,
    verseStart: 1,
    verseEnd: 3,
    displayRef: "Sl 103, 1-3",
    text: "Bendize, ó minha alma, ao Senhor, e todo o meu ser bendiga o seu santo nome! Bendize, ó minha alma, ao Senhor, e não esqueças nenhum de seus benefícios! É ele quem perdoa todas as tuas culpas e cura as tuas enfermidades.",
    themes: ["Perdão e reconciliação", "Oração e intimidade com Deus", "Ação de graças", "Misericórdia"],
    dbVersion: "1.3.0-nexa",
    testament: "AT"
  },
  {
    id: "BJ-MT-11-28-30",
    translationId: "BJ",
    book: "Mateus",
    bookAbbr: "Mt",
    chapter: 11,
    verseStart: 28,
    verseEnd: 30,
    displayRef: "Mt 11, 28-30",
    text: "Vinde a mim, todos vós que estais cansados e fatigados pelo peso do fardo, e eu vos darei descanso. Tomai sobre vós o meu jugo e aprendei de mim, porque sou manso e humilde de coração, e encontrareis repouso para as vossas almas.",
    themes: ["Esperança nas dificuldades", "Paz e serenidade", "Acolhimento", "Humildade"],
    dbVersion: "1.3.0-nexa",
    testament: "NT"
  }
];

const existingIds = new Set(db.passages.map(p => p.id));
let addedCount = 0;

for (const p of additionalPassages) {
  if (p.text.length > 240) {
    console.error(`Passagem ${p.id} excede 240 caracteres: ${p.text.length}`);
    process.exit(1);
  }
  if (!existingIds.has(p.id)) {
    db.passages.push(p);
    existingIds.add(p.id);
    addedCount++;
  }
}

db.metadata.version = "1.3.0-nexa";
db.metadata.totalPassages = db.passages.length;
db.metadata.licenseNote = "Acervo pastoral católico completo com tipografia Nexa e limite de até 240 caracteres com sentido completo.";

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8');
console.log(`Sucesso! ${addedCount} passagens adicionadas. Total no acervo: ${db.passages.length}. Todas <= 240 caracteres.`);
