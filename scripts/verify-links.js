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

// Dates : pub présente (2023-2026), update présente, pas de date "aujourd'hui" 2026-06
for (const lang of langs) {
  const pubRe = lang === "fr" ? /Publié le \d+ [^<]+ 202\d/ : /Published \d+ [^<]+ 202\d/;
  const updRe = lang === "fr" ? /Mis à jour le \d+ [^<]+ 202\d/ : /Updated \d+ [^<]+ 202\d/;
  for (const file of fs.readdirSync("articles/" + lang).filter(f => f.endsWith(".html"))) {
    const html = fs.readFileSync("articles/" + lang + "/" + file, "utf8");
    if (!pubRe.test(html)) { console.log("no pub date:", lang, file); problems++; }
    if (!updRe.test(html)) { console.log("no update date:", lang, file); problems++; }
    if (/20 juin 2026/.test(html)) { console.log("leftover today date:", lang, file); problems++; }
  }
}

// CheckDi : liens posés, plus aucun bouton d'affiliation en href="#"
const checkdi = {
  "assurance-sante-expatrie-thailande": "checkdi.com/th/health/main",
  "scooter-bangkok-guide": "checkdi.com/th/motorbike/main"
};
for (const [slug, needle] of Object.entries(checkdi)) {
  for (const lang of langs) {
    const html = fs.readFileSync(`articles/${lang}/${slug}.html`, "utf8");
    if (!html.includes(needle)) { console.log("MISS checkdi link:", lang, slug); problems++; }
    if (/href="#"\s+class="aff-(btn|inline)"/.test(html)) { console.log("affiliate button still href=#:", lang, slug); problems++; }
    if (html.includes("affid=AG12836") === false) { console.log("MISS affid:", lang, slug); problems++; }
  }
}

// Sitemap
if (!fs.existsSync("sitemap.xml")) { console.log("sitemap.xml manquant"); problems++; }
else {
  const sm = fs.readFileSync("sitemap.xml", "utf8");
  const n = (sm.match(/<url>/g) || []).length;
  if (n !== 29) { console.log("sitemap: attendu 29 <url>, trouvé", n); problems++; }
  for (const lang of langs) {
    for (const file of fs.readdirSync("articles/" + lang).filter(f => f.endsWith(".html"))) {
      if (!sm.includes(`articles/${lang}/${file}`)) { console.log("sitemap manque:", lang, file); problems++; }
    }
  }
}

console.log(problems === 0 ? "\nALL CHECKS PASSED" : "\n" + problems + " PROBLEM(S)");
process.exit(problems === 0 ? 0 : 1);
