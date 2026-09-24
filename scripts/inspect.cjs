const fs = require("fs");
let content = fs.readFileSync("/tmp/bible.json", "utf8");
content = content.replace(/^\uFEFF/, "");
const data = JSON.parse(content);
console.log("Total books:", data.length);
const sample = data.map(b => b.abbrev);
console.log("Books:", sample.join(", "));
console.log("Genesis 1:1 ->", data[0].chapters[0][0]);
