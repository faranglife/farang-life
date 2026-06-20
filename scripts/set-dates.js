// Assigne des dates de publication (2023 -> aujourd'hui) et de mise à jour
// (2025 -> aujourd'hui, toujours après la publication, cohérentes avec le contenu)
// à chaque article FR + EN, puis régénère sitemap.xml avec les bons lastmod.
const fs = require("fs");

const MONTHS_FR = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
const MONTHS_EN = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// pub/upd : [année, mois (1-12), jour]. Choix manuels, variés et cohérents avec
// le contenu (ex. fiscalité publiée après le changement de 2024 ; visa mis à
// jour après la réforme LTR d'octobre 2024 ; articles "2025" publiés en 2025).
const DATES = {
  "visa-thailande":                      { pub: [2023, 2, 14],  upd: [2025, 2, 3]  },
  "assurance-sante-expatrie-thailande":  { pub: [2023, 5, 22],  upd: [2026, 2, 18] },
  "compte-bancaire-thailande":           { pub: [2024, 1, 18],  upd: [2025, 6, 10] },
  "quartiers-bangkok-expat":             { pub: [2023, 3, 9],   upd: [2025, 4, 21] },
  "fiscalite-expat-thailande":           { pub: [2024, 3, 19],  upd: [2025, 2, 27] },
  "hopitaux-bangkok":                    { pub: [2023, 10, 29], upd: [2025, 8, 12] },
  "cout-vie-bangkok":                    { pub: [2025, 1, 15],  upd: [2025, 11, 8] },
  "permis-conduire-thailande":           { pub: [2023, 6, 6],   upd: [2025, 3, 30] },
  "tm30-guide":                          { pub: [2023, 9, 9],   upd: [2025, 5, 19] },
  "escapades-week-end-bangkok":          { pub: [2023, 7, 19],  upd: [2025, 7, 2]  },
  "coups-de-coeur-bangkok":              { pub: [2023, 5, 1],   upd: [2025, 10, 17] },
  "restaurants-bangkok-2025":            { pub: [2025, 2, 8],   upd: [2026, 1, 12] },
  "scooter-bangkok-guide":               { pub: [2024, 5, 18],  upd: [2026, 3, 5]  },
  "scooter-bangkok-verite":              { pub: [2023, 2, 4],   upd: [2025, 6, 15] }
};

const TODAY = "2026-06-20";
const fmtFr = ([y, m, d]) => `${d} ${MONTHS_FR[m - 1]} ${y}`;
const fmtEn = ([y, m, d]) => `${d} ${MONTHS_EN[m - 1]} ${y}`;
const iso = ([y, m, d]) => `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

const sitemap = [];

for (const lang of ["fr", "en"]) {
  const dir = "articles/" + lang;
  for (const file of fs.readdirSync(dir).filter(f => f.endsWith(".html"))) {
    const slug = file.replace(".html", "");
    const dates = DATES[slug];
    if (!dates) { console.warn("Pas de date pour", slug, "- ignoré"); continue; }
    const p = dir + "/" + file;
    let html = fs.readFileSync(p, "utf8");

    if (lang === "fr") {
      const rt = (html.match(/(\d+)\s*min de lecture/) || [, "10"])[1];
      html = html.replace(/<div class="article-meta-bar">[\s\S]*?<\/div>/,
        `<div class="article-meta-bar">\n      <span>Marc</span><span class="meta-sep">·</span>\n      <span>Publié le ${fmtFr(dates.pub)}</span><span class="meta-sep">·</span>\n      <span>Mis à jour le ${fmtFr(dates.upd)}</span><span class="meta-sep">·</span>\n      <span>${rt} min de lecture</span>\n    </div>`);
    } else {
      const rt = (html.match(/(\d+)\s*min read/) || [, "10"])[1];
      html = html.replace(/<div class="article-meta-bar">[\s\S]*?<\/div>/,
        `<div class="article-meta-bar">\n      <span>Marc</span><span class="meta-sep">·</span>\n      <span>Published ${fmtEn(dates.pub)}</span><span class="meta-sep">·</span>\n      <span>Updated ${fmtEn(dates.upd)}</span><span class="meta-sep">·</span>\n      <span>${rt} min read</span>\n    </div>`);
    }

    fs.writeFileSync(p, html, "utf8");
    sitemap.push({ loc: `https://farang.life/articles/${lang}/${file}`, lastmod: iso(dates.upd), changefreq: "monthly", priority: lang === "fr" ? "0.8" : "0.7" });
    console.log(`${lang}/${file} -> pub ${iso(dates.pub)} | upd ${iso(dates.upd)}`);
  }
}

// sitemap.xml
const urls = [{ loc: "https://farang.life/", lastmod: TODAY, changefreq: "weekly", priority: "1.0" }, ...sitemap];
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join("\n")}
</urlset>
`;
fs.writeFileSync("sitemap.xml", xml, "utf8");
console.log(`\nsitemap.xml écrit (${urls.length} URLs).`);
