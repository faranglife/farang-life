// One-off : patche les fichiers articles/fr/ pour
//  1. ajouter data-page-lang="fr" sur le body
//  2. transformer le toggle FR/EN en vrais liens vers articles/en/<slug>.html
//  3. remplacer la date de publication par une date aléatoire 2023-2024
//     (source unique partagée avec le générateur EN) + "Mis à jour janvier 2025"
const fs = require("fs");
const { dateForSlug } = require("./generate-article.js");

const dir = "articles/fr";
for (const file of fs.readdirSync(dir).filter(f => f.endsWith(".html"))) {
  const slug = file.replace(".html", "");
  const p = `${dir}/${file}`;
  let html = fs.readFileSync(p, "utf8");
  const d = dateForSlug(slug).fr;

  // 1. marqueur de langue de page
  if (!html.includes("data-page-lang")) {
    html = html.replace('<body class="lang-fr">', '<body class="lang-fr" data-page-lang="fr">');
  }

  // 2. toggle -> liens croisés
  html = html.replace(
    /<button class="lang-btn active" onclick="setLang\('fr'\)">FR<\/button>\s*<button class="lang-btn" onclick="setLang\('en'\)">EN<\/button>/,
    `<a class="lang-btn active" data-lang="fr" href="${slug}.html">FR</a>\n      <a class="lang-btn" data-lang="en" href="../en/${slug}.html">EN</a>`
  );

  // 3. barre méta : Marc · Publié le <date 2023-24> · Mis à jour janvier 2025 · X min de lecture
  const rtm = html.match(/(\d+)\s*min de lecture/);
  const rt = rtm ? rtm[1] : "10";
  html = html.replace(
    /<div class="article-meta-bar">[\s\S]*?<\/div>/,
    `<div class="article-meta-bar">\n      <span>Marc</span><span class="meta-sep">·</span>\n      <span>Publié le ${d}</span><span class="meta-sep">·</span>\n      <span>Mis à jour janvier 2025</span><span class="meta-sep">·</span>\n      <span>${rt} min de lecture</span>\n    </div>`
  );

  fs.writeFileSync(p, html, "utf8");
  console.log(`patché ${file} -> Publié le ${d}, ${rt} min`);
}
