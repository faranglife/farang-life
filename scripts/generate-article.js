import fs from "fs";

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
  },
  {
    slug: "escapades-week-end-bangkok",
    title: "Escapades week-end depuis Bangkok : mes 8 destinations préférées",
    category: "Vivre ici",
    kicker: "Week-ends & Escapades",
    lede: "Kanchanaburi, Khao Yai, Hua Hin, Koh Samet... Les destinations à 2-4h de Bangkok que je refais sans me lasser.",
    keywords: ["week-end Bangkok", "escapade Bangkok", "sortie week-end Bangkok", "destination proche Bangkok"],
    affiliate: { name: "Booking.com", desc: "Les meilleures adresses pour chaque destination.", cta: "Voir les hôtels →" }
  },
  {
    slug: "coups-de-coeur-bangkok",
    title: "Mes adresses à Bangkok : les endroits où je reviens depuis des années",
    category: "Vivre ici",
    kicker: "Adresses & Coups de coeur",
    lede: "Café des Stagiaires, Playlys, CALM et d'autres — pas des listes TripAdvisor. Les endroits que je fréquente vraiment.",
    keywords: ["café Bangkok expat", "bar Bangkok", "adresses Bangkok", "où sortir Bangkok expat"],
    affiliate: { name: "Klook", desc: "Pour les activités et expériences à Bangkok.", cta: "Voir les activités →" }
  },
  {
    slug: "restaurants-bangkok-2025",
    title: "Nouveaux restaurants Bangkok 2025 : ceux qui valent vraiment le détour",
    category: "Vivre ici",
    kicker: "Restaurants & Fo
