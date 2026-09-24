const fs = require("fs");
const path = require("path");

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

const oldTestamentKeys = [
  "gn", "ex", "lv", "nm", "dt", "js", "jz", "rt", "1sm", "2sm", "1rs", "2rs",
  "1cr", "2cr", "ed", "ne", "et", "jó", "sl", "pv", "ec", "ct", "is", "jr",
  "lm", "ez", "dn", "os", "jl", "am", "ob", "jn", "mq", "na", "hc", "sf",
  "ag", "zc", "ml"
];

let raw = fs.readFileSync("/tmp/bible.json", "utf8").replace(/^\uFEFF/, "");
const data = JSON.parse(raw);

const outPathRoot = path.join(__dirname, "..", "biblia_sagrada_completa.txt");
const outPathPublic = path.join(__dirname, "..", "public", "biblia_sagrada_completa.txt");

const stream = fs.createWriteStream(outPathRoot, { encoding: "utf8" });

stream.write("================================================================================\n");
stream.write("BÍBLIA SAGRADA COMPLETA - TODOS OS LIVROS E VERSÍCULOS PARA CONSULTA\n");
stream.write("================================================================================\n");
stream.write("Tradução: Português (Texto Integral com todos os capítulos e versículos)\n");
stream.write("Finalidade: Consulta permanente para catequese, pastoral e preparação de cartões.\n");
stream.write("Total de Livros: 66 Livros canônicos + Seção Pastoral dos Deuterocanônicos\n");
stream.write("Total de Capítulos: 1.189 capítulos\n");
stream.write("Total de Versículos: 31.104 versículos\n");
stream.write("================================================================================\n\n");

stream.write("ÍNDICE DOS LIVROS:\n");
stream.write("--------------------------------------------------------------------------------\n");
stream.write("ANTIGO TESTAMENTO:\n");
oldTestamentKeys.forEach((key, idx) => {
  stream.write(`  ${(idx + 1).toString().padStart(2, " ")}. ${bookNames[key]} (${key.toUpperCase()})\n`);
});
stream.write("\nNOVO TESTAMENTO:\n");
const newTestamentKeys = Object.keys(bookNames).filter(k => !oldTestamentKeys.includes(k));
newTestamentKeys.forEach((key, idx) => {
  stream.write(`  ${(idx + 1).toString().padStart(2, " ")}. ${bookNames[key]} (${key.toUpperCase()})\n`);
});
stream.write("--------------------------------------------------------------------------------\n\n");

// Iterate over books
for (const book of data) {
  const name = bookNames[book.abbrev] || book.abbrev.toUpperCase();
  const isNT = newTestamentKeys.includes(book.abbrev);
  const testament = isNT ? "NOVO TESTAMENTO" : "ANTIGO TESTAMENTO";

  stream.write("\n================================================================================\n");
  stream.write(`${name.toUpperCase()} (${book.abbrev.toUpperCase()}) - ${testament}\n`);
  stream.write("================================================================================\n\n");

  book.chapters.forEach((chapterVerses, chIdx) => {
    const chNum = chIdx + 1;
    stream.write(`--- ${name} Capítulo ${chNum} ---\n\n`);

    chapterVerses.forEach((verseText, vIdx) => {
      const vNum = vIdx + 1;
      stream.write(`[${name} ${chNum}:${vNum}] ${verseText}\n`);
    });
    stream.write("\n");
  });
}

// Add Catholic Deuterocanonical Pastoral Section from initialBibleDatabase.json
try {
  const initialDbPath = path.join(__dirname, "..", "src", "data", "initialBibleDatabase.json");
  if (fs.existsSync(initialDbPath)) {
    const initialDb = JSON.parse(fs.readFileSync(initialDbPath, "utf8"));
    const deutPassages = initialDb.passages.filter(p => ["Tb", "Jdt", "Sb", "Eclo", "Br", "1Mc", "2Mc"].includes(p.bookAbbr));
    if (deutPassages.length > 0) {
      stream.write("\n================================================================================\n");
      stream.write("LIVROS DEUTEROCANÔNICOS - BÍBLIA DE JERUSALÉM (CÂNON CATÓLICO)\n");
      stream.write("================================================================================\n");
      stream.write("Passagens conferidas ipsis litteris da Bíblia de Jerusalém (Edições Paulus)\n");
      stream.write("Livros: Tobias (Tb), Judite (Jdt), Sabedoria (Sb), Eclesiástico / Ben Sirá (Eclo),\n");
      stream.write("Baruc (Br), 1 Macabeus (1Mc), 2 Macabeus (2Mc).\n\n");

      for (const p of deutPassages) {
        const verseRange = p.verseEnd && p.verseEnd !== p.verseStart ? `-${p.verseEnd}` : "";
        stream.write(`[${p.book} ${p.chapter}:${p.verseStart}${verseRange}] (${p.displayRef})\n`);
        stream.write(`Tema: ${p.themes.join(", ")}\n`);
        stream.write(`Texto: "${p.text}"\n\n`);
      }
    }
  }
} catch (e) {
  console.warn("Could not append deuterocanonical section:", e.message);
}

stream.end(() => {
  console.log("Root file generated:", outPathRoot);
  // Copy to public
  fs.copyFileSync(outPathRoot, outPathPublic);
  console.log("Public file copied:", outPathPublic);
  const stat = fs.statSync(outPathRoot);
  console.log(`Finished successfully! Size: ${(stat.size / (1024 * 1024)).toFixed(2)} MB`);
});
