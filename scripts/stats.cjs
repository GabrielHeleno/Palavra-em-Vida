const fs = require("fs");

const bookNames = {
  gn: "Gênesis",
  ex: "Êxodo",
  lv: "Levítico",
  nm: "Números",
  dt: "Deuteronômio",
  js: "Josué",
  jz: "Juízes",
  rt: "Rute",
  "1sm": "1 Samuel",
  "2sm": "2 Samuel",
  "1rs": "1 Reis",
  "2rs": "2 Reis",
  "1cr": "1 Crônicas",
  "2cr": "2 Crônicas",
  ed: "Esdras",
  ne: "Neemias",
  et: "Ester",
  "jó": "Jó",
  sl: "Salmos",
  pv: "Provérbios",
  ec: "Eclesiastes",
  ct: "Cântico dos Cânticos",
  is: "Isaías",
  jr: "Jeremias",
  lm: "Lamentações",
  ez: "Ezequiel",
  dn: "Daniel",
  os: "Oseias",
  jl: "Joel",
  am: "Amós",
  ob: "Obadias",
  jn: "Jonas",
  mq: "Miqueias",
  na: "Naum",
  hc: "Habacuc",
  sf: "Sofonias",
  ag: "Ageu",
  zc: "Zacarias",
  ml: "Malaquias",
  mt: "Mateus",
  mc: "Marcos",
  lc: "Lucas",
  jo: "João",
  atos: "Atos dos Apóstolos",
  rm: "Romanos",
  "1co": "1 Coríntios",
  "2co": "2 Coríntios",
  gl: "Gálatas",
  ef: "Efésios",
  fp: "Filipenses",
  cl: "Colossenses",
  "1ts": "1 Tessalonicenses",
  "2ts": "2 Tessalonicenses",
  "1tm": "1 Timóteo",
  "2tm": "2 Timóteo",
  tt: "Tito",
  fm: "Filemom",
  hb: "Hebreus",
  tg: "Tiago",
  "1pe": "1 Pedro",
  "2pe": "2 Pedro",
  "1jo": "1 João",
  "2jo": "2 João",
  "3jo": "3 João",
  jd: "Judas",
  ap: "Apocalipse"
};

let raw = fs.readFileSync("/tmp/bible.json", "utf8").replace(/^\uFEFF/, "");
const data = JSON.parse(raw);

let totalVerses = 0;
let totalChapters = 0;

for (const b of data) {
  totalChapters += b.chapters.length;
  for (const ch of b.chapters) {
    totalVerses += ch.length;
  }
}

console.log("Books:", data.length, "Chapters:", totalChapters, "Verses:", totalVerses);
