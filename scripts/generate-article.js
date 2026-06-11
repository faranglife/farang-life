import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Liste des articles à générer — dans l'ordre de priorité SEO
const ARTICLE_QUEUE = [
  {
    slug: "compte-bancaire-thailande",
    title: "Kasikorn vs Bangkok Bank : après sept ans, voilà où est mon argent",
    category: "Finance",
    kicker: "Finance & Banque",
    lede: "Les deux comptes les plus courants pour les expats. Lequel ouvrir en premier, lequel garder, et pourquoi j'utilise les deux pour des raisons différentes.",
    keywords: ["compte bancaire Thaïlande", "Kasikorn Bank expat", "Bangkok Bank étranger", "ouvrir compte bancaire Bangkok"],
    affiliate: { name: "Wise", desc: "Pour les transferts internationaux sans frais cachés vers votre compte thaï.", cta: "Ouvrir un compte Wise gratuit →" }
  },
  {
    slug: "creer-societe-thailande",
    title: "Monter une société en Thaïlande : ce que l'avocat ne vous dira pas",
    category: "Business",
    kicker: "Business & Fiscalité",
    lede: "Thai Limited Company, BOI, succursale étrangère — les trois options réelles, avec leurs vrais coûts et leurs vraies contraintes.",
    keywords: ["créer société Thaïlande", "Thai Limited Company", "BOI Thailand", "entreprise Thaïlande étranger"],
    affiliate: { name: "Sunbelt Asia", desc: "Cabinet de référence pour la création de sociétés en Thaïlande. Devis gratuit.", cta: "Obtenir un devis gratuit →" }
  },
  {
    slug: "quartiers-bangkok-expat",
    title: "Louer à Bangkok : les quartiers honnêtement, par quelqu'un qui les a habités",
    category: "Immobilier",
    kicker: "Vivre à Bangkok",
    lede: "Sukhumvit, Silom, Ari, Thonglor, Ladprao — pas les descriptions des agences. Ce que c'est vraiment de vivre dans chacun.",
    keywords: ["quartier Bangkok expat", "où vivre Bangkok", "louer appartement Bangkok", "Sukhumvit Silom Thonglor"],
    affiliate: { name: "DDProperty", desc: "Le meilleur site d'annonces immobilières en Thaïlande.", cta: "Chercher un appartement →" }
  },
  {
    slug: "fiscalite-expat-thailande",
    title: "Fiscalité expat en Thaïlande : ce qui a changé en 2024 et ce que ça change pour vous",
    category: "Business",
    kicker: "Fiscalité",
    lede: "La Thaïlande a modifié ses règles fiscales sur les revenus étrangers en 2024. Ce que ça signifie concrètement pour un expat français.",
    keywords: ["fiscalité expat Thaïlande", "impôts Thaïlande étranger", "résidence fiscale Thaïlande", "revenus étrangers Thaïlande"],
    affiliate: { name: "KPMG Thailand", desc: "Cabinet comptable recommandé pour les expats.", cta: "Consultation gratuite →" }
  },
  {
    slug: "hopitaux-bangkok",
    title: "Bumrungrad vs Samitivej vs Bangkok Hospital : lequel choisir selon votre cas",
    category: "Santé",
    kicker: "Santé & Hôpitaux",
    lede: "Les trois grands hôpitaux privés de Bangkok. Pas le même public, pas les mêmes spécialités, pas les mêmes tarifs.",
    keywords: ["hôpital Bangkok expat", "Bumrungrad International", "Samitivej Hospital", "meilleur hôpital Bangkok"],
    affiliate: { name: "Pacific Cross", desc: "L'assurance avec accords directs dans les trois hôpitaux.", cta: "Devis assurance gratuit →" }
  },
  {
    slug: "cout-vie-bangkok",
    title: "Coût de la vie à Bangkok en 2025 : les vrais chiffres, pas les moyennes",
    category: "Vivre ici",
    kicker: "Budget & Coût de la vie",
    lede: "Les budgets qu'on trouve en ligne sont soit trop bas soit trop hauts. Voilà ce que je dépense vraiment après 7 ans à Bangkok.",
    keywords: ["coût vie Bangkok", "budget expat Bangkok", "prix Bangkok 2025", "vivre à Bangkok budget"],
    affiliate: { name: "Wise", desc: "Pour gérer votre budget entre euros et bahts sans frais.", cta: "Ouvrir Wise gratuit →" }
  },
  {
    slug: "permis-conduire-thailande",
    title: "Permis de conduire en Thaïlande : comment convertir le vôtre sans repasser le code",
    category: "Administratif",
    kicker: "Visa & Admin",
    lede: "La conversion du permis français en permis thaï est possible sans examen. La procédure exacte, les documents, et les pièges à éviter.",
    keywords: ["permis conduire Thaïlande", "convertir permis français Thaïlande", "DLT Bangkok", "permis international Thaïlande"],
    affiliate: { name: "Pacific Cross", desc: "Assurance qui couvre aussi les accidents de la route en Thaïlande.", cta: "Voir les formules →" }
  },
  {
    slug: "tm30-guide",
    title: "Le TM30 expliqué : pourquoi vous devez le faire et comment ne pas l'oublier",
    category: "Administratif",
    kicker: "Visa & Admin",
    lede: "Le TM30 est la déclaration que votre propriétaire doit faire à l'immigration dans les 24h de votre arrivée. La plupart des expats ne savent pas que ça existe.",
    keywords: ["TM30 Thaïlande", "TM30 expat", "déclaration immigration Thaïlande", "TM30 propriétaire locataire"],
    affiliate: { name: "Thailand BOI Partners", desc: "Aide pour toutes les démarches d'immigration.", cta: "Consultation gratuite →" }
  }
];

function getTodaySlug() {
  return new Date().toISOString().split('T')[0];
}

function getNextArticle() {
  // Vérifie quels articles existent déjà
  const existingFiles = fs.readdirSync('articles/fr').map(f => f.replace('.html', ''));
  const next = ARTICLE_QUEUE.find(a => !existingFiles.includes(a.slug));
  return next || ARTICLE_QUEUE[0]; // Si tout est fait, recommence
}

async function generateArticle(meta) {
  console.log(`Génération de l'article : ${meta.title}`);

  const prompt = `Tu es Marc, un expat français qui vit à Bangkok depuis 7 ans. Tu tiens un blog personnel appelé farang.life où tu partages des guides pratiques pour les expats occidentaux en Thaïlande.

Ton style : direct, honnête, à la première personne. Tu partages des vraies opinions, pas des listes génériques. Tu mentionnes des détails concrets et plausibles (noms d'endroits réels, prix approximatifs vrais, procédures réelles). Pas de bullshit, pas de langage corporate.

Génère un article complet en HTML pour cet article :

Titre : ${meta.title}
Catégorie : ${meta.category}
Chapeau : ${meta.lede}
Mots-clés SEO : ${meta.keywords.join(', ')}

Structure requise :
- Introduction à la première personne avec une anecdote concrète et plausible (pas inventée à l'excès)
- 4 à 6 sections H2 avec du vrai contenu utile
- Au moins un tableau HTML comparatif
- Au moins deux encadrés .callout avec des conseils pratiques
- Une section "Ce que j'aurais voulu savoir" en conclusion
- Environ 1200-1500 mots de contenu

Retourne UNIQUEMENT le contenu HTML entre les balises <article-content> et </article-content>, sans DOCTYPE ni balises html/head/body. Juste le contenu de l'article : les titres H2, paragraphes, tableaux, callouts. Pas de nav, pas de footer.

Format des callouts : <div class="callout"><p>contenu</p></div>
Format des tableaux : utilise la classe art-table
Les anecdotes doivent être plausibles et factuelles — pas de détails trop précis inventés.`;

  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 4000,
    messages: [{ role: "user", content: prompt }]
  });

  const raw = response.content[0].text;
  const match = raw.match(/<article-content>([\s\S]*?)<\/article-content>/);
  if (!match) throw new Error("Format de réponse inattendu");
  return match[1].trim();
}

function buildHtmlPage(meta, content) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${meta.title} — Farang.life</title>
  <meta name="description" content="${meta.lede}">
  <link rel="canonical" href="https://farang.life/articles/fr/${meta.slug}.html">
  <link rel="stylesheet" href="../../css/style.css">
</head>
<body class="lang-fr">
<div class="reading-progress" id="reading-progress"></div>

<nav>
  <div class="nav-inner">
    <a href="../../index.html" class="nav-logo"><em>farang</em><span>.life</span></a>
    <ul class="nav-links">
      <li><a href="#">Visa & admin</a></li>
      <li><a href="#">Vivre ici</a></li>
      <li><a href="#">Business</a></li>
    </ul>
    <div class="nav-right">
      <button class="lang-btn active" onclick="setLang('fr')">FR</button>
      <button class="lang-btn" onclick="setLang('en')">EN</button>
      <a href="../../index.html#newsletter" class="nav-sub">Newsletter →</a>
    </div>
  </div>
</nav>

<div class="article-header">
  <div class="article-header-inner">
    <div class="breadcrumb">
      <a href="../../index.html">Farang.life</a>
      <span>›</span>
      <a href="#">${meta.category}</a>
    </div>
    <div class="article-kicker">${meta.kicker}</div>
    <h1 class="article-h1">${meta.title}</h1>
    <p class="article-lede">${meta.lede}</p>
    <div class="article-meta-bar">
      <span>Marc</span>
      <span class="meta-sep">·</span>
      <span>Publié le ${new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
      <span class="meta-sep">·</span>
      <span>10 min de lecture</span>
    </div>
  </div>
</div>

<div class="article-layout">
  <div class="article-content">
    ${content}
  </div>

  <aside class="sidebar">
    <div class="aff-box">
      <div class="aff-lbl">Ressource recommandée</div>
      <h4>${meta.affiliate.name}</h4>
      <p>${meta.affiliate.desc}</p>
      <a href="#" class="aff-btn">${meta.affiliate.cta}</a>
    </div>
    <div class="sb">
      <h4>Articles liés</h4>
      <div class="toc">
        <a href="visa-thailande.html">Quel visa choisir ?</a>
        <a href="assurance-sante-expatrie-thailande.html">Assurance santé expat</a>
        <a href="compte-bancaire-thailande.html">Compte bancaire</a>
      </div>
    </div>
  </aside>
</div>

<div class="nl-band">
  <div class="nl-inner">
    <div class="nl-left">
      <h2 class="nl-title">Une fois par semaine.<br><em>Rien que l'utile.</em></h2>
      <p class="nl-desc">Alertes immigration, comparatifs mis à jour, questions de lecteurs.</p>
    </div>
    <div class="nl-right">
      <form class="nl-form" onsubmit="return false;">
        <div class="nl-inputs">
          <input type="email" class="nl-input" placeholder="votre@email.com">
          <button type="submit" class="nl-btn">S'abonner →</button>
        </div>
        <p class="nl-note">Gratuit. Désinscription en un clic.</p>
      </form>
    </div>
  </div>
</div>

<footer>
  <div class="footer-inner">
    <div class="footer-brand">
      <div class="nav-logo"><em>farang</em><span style="color:var(--accent)">.life</span></div>
      <p>Notes d'un expat à Bangkok. Indépendant depuis 2017.</p>
    </div>
    <div class="footer-col">
      <h4>Guides</h4>
      <ul>
        <li><a href="visa-thailande.html">Visa Thaïlande</a></li>
        <li><a href="assurance-sante-expatrie-thailande.html">Assurance santé</a></li>
        <li><a href="compte-bancaire-thailande.html">Compte bancaire</a></li>
      </ul>
    </div>
  </div>
  <div class="footer-bottom">
    <span>© 2025 Farang.life</span>
    <span>Fait à Bangkok 🇹🇭 — Les liens affiliés ne changent pas vos prix</span>
  </div>
</footer>

<script src="../../js/main.js"></script>
</body>
</html>`;
}

async function main() {
  const meta = getNextArticle();
  console.log(`Article sélectionné : ${meta.slug}`);

  const content = await generateArticle(meta);
  const html = buildHtmlPage(meta, content);

  const filePath = `articles/fr/${meta.slug}.html`;
  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`Fichier créé : ${filePath}`);

  // Variables pour GitHub Actions
  fs.appendFileSync(process.env.GITHUB_ENV || '/dev/null',
    `ARTICLE_TITLE=${meta.title}\nARTICLE_FILE=${filePath}\nARTICLE_SLUG=${meta.slug}\n`
  );
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
