const fs = require("fs");
let problems = 0;
const langs = ["fr", "en"];

for (const lang of langs) {
  const other = lang === "fr" ? "en" : "fr";
  const dir = "articles/" + lang;
  for (const file of fs.readdirSync(dir).filter(f => f.endsWith(".html"))) {
    const html = fs.readFileSync(dir + "/" + file, "utf8");

    if (!html.includes('data-page-lang="' + lang + '"')) { console.log("MISS page-lang:", lang, file); problems++; }
    if (html.includes('onclick="setLang')) { console.log("LEFTOVER setLang button:", lang, file); problems++; }

    const cross = html.match(new RegExp('href="\\.\\./' + other + '/([^"]+\\.html)"'));
    if (!cross) { console.log("MISS cross-link toggle:", lang, file); problems++; }
    else if (!fs.existsSync("articles/" + other + "/" + cross[1])) { console.log("BROKEN toggle target:", lang, file, "->", cross[1]); problems++; }

    const links = [...html.matchAll(/href="([a-z0-9-]+\.html)"/g)].map(x => x[1]);
    for (const l of new Set(links)) {
      if (!fs.existsSync(dir + "/" + l)) { console.log("BROKEN internal link:", lang, file, "->", l); problems++; }
    }
  }
}

for (const file of fs.readdirSync("articles/fr").filter(f => f.endsWith(".html"))) {
  const html = fs.readFileSync("articles/fr/" + file, "utf8");
  if (!/Publié le \d+ [^<]+ 202[34]/.test(html)) { console.log("FR no 2023-24 pub date:", file); problems++; }
  if (/20 juin 2026/.test(html)) { console.log("FR still has today date:", file); problems++; }
}

console.log(problems === 0 ? "\nALL CHECKS PASSED (28 pages)" : "\n" + problems + " PROBLEM(S)");
process.exit(problems === 0 ? 0 : 1);
