// 1. Harmonise le branding Farang.io -> Farang.life (texte + logo .io -> .life)
// 2. Retire la newsletter partout (bandeau nl-band, liens nav/CTA/footer)
// 3. index.html : liens d'articles bilingues (data-fr-href / data-en-href),
//    bascules par setLang selon la langue active
const fs = require("fs");

function fixBranding(html) {
  return html
    .replace(/Farang\.io/g, "Farang.life")
    .replace(/farang\.io/g, "farang.life")
    .replace(/\.io<\/span>/g, ".life</span>");
}

function stripNewsletter(html) {
  // élément de liste footer pointant vers la newsletter
  html = html.replace(/[ \t]*<li><a [^>]*#newsletter[^>]*>[\s\S]*?<\/a><\/li>\r?\n?/g, "");
  // liens newsletter isolés (nav-sub, btn-sub)
  html = html.replace(/[ \t]*<a [^>]*#newsletter[^>]*>[\s\S]*?<\/a>\r?\n?/g, "");
  // tout le bandeau newsletter (toujours juste avant <footer>)
  html = html.replace(/[ \t]*<div class="nl-band"[\s\S]*?<\/div>\s*(?=<footer>)/g, "");
  return html;
}

// index.html
{
  let html = fs.readFileSync("index.html", "utf8");
  html = fixBranding(html);
  html = stripNewsletter(html);
  html = html.replace(/href="articles\/fr\/([^"]+)"/g,
    'href="articles/fr/$1" data-fr-href="articles/fr/$1" data-en-href="articles/en/$1"');
  fs.writeFileSync("index.html", html, "utf8");
  console.log("index.html : branding + newsletter retirée + liens bilingues");
}

// articles FR + EN
for (const lang of ["fr", "en"]) {
  const files = fs.readdirSync("articles/" + lang).filter(f => f.endsWith(".html"));
  for (const file of files) {
    const p = `articles/${lang}/${file}`;
    let html = fs.readFileSync(p, "utf8");
    html = stripNewsletter(fixBranding(html));
    fs.writeFileSync(p, html, "utf8");
  }
  console.log(`articles/${lang} : ${files.length} fichiers nettoyés`);
}
