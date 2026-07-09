import type { Report } from "./types";

export const VERDICT_META = {
  buy: {
    label: "Acheter",
    tone: "Feu vert",
    color: "#34d399",
    bg: "rgba(52,211,153,0.12)",
    border: "rgba(52,211,153,0.35)",
    headline: "Bonne affaire détectée",
  },
  negotiate: {
    label: "Négocier",
    tone: "Feu orange",
    color: "#fbbf24",
    bg: "rgba(251,191,36,0.12)",
    border: "rgba(251,191,36,0.35)",
    headline: "Correct, mais surpayé",
  },
  avoid: {
    label: "Éviter",
    tone: "Feu rouge",
    color: "#fb7185",
    bg: "rgba(251,113,133,0.12)",
    border: "rgba(251,113,133,0.35)",
    headline: "Signaux d'alerte sérieux",
  },
} as const;

export const SAMPLE_REPORTS: Report[] = [
  {
    listing: {
      id: "clio-v-2021",
      title: "Renault Clio V 1.0 TCe 90 Intens",
      make: "Renault",
      model: "Clio V",
      year: 2021,
      km: 32400,
      fuel: "Essence",
      gearbox: "Manuelle",
      price: 13900,
      marketPrice: 14750,
      location: "Nantes (44)",
      sellerType: "Particulier",
      power: "90 ch",
      source: "Leboncoin",
      postedDays: 2,
      owners: 1,
      accent: "#f59e0b",
    },
    score: 87,
    verdict: "buy",
    summary:
      "Première main, carnet complet chez Renault et prix 5,8 % sous la cote. Les seuls points de vigilance sont mineurs. À ce tarif, l'annonce partira vite.",
    risks: [
      {
        severity: "low",
        title: "Pneus avant à 40 %",
        detail: "Visible sur les photos. Comptez ~180 € à prévoir d'ici 15 000 km — un argument, pas un défaut.",
      },
      {
        severity: "low",
        title: "Révision des 4 ans à venir",
        detail: "Prévue dans 4 mois. Demandez au vendeur s'il la fait avant la vente.",
      },
    ],
    fees: [
      { label: "Carte grise (44)", amount: 281, mandatory: true, note: "5 CV fiscaux, région Pays de la Loire" },
      { label: "Plaques d'immatriculation", amount: 30, mandatory: true, note: "Pose comprise en centre auto" },
      { label: "Révision + pneus avant", amount: 340, mandatory: false, note: "À prévoir dans les 6 mois" },
    ],
    negotiation: {
      target: 13500,
      savings: 400,
      args: [
        "Les pneus avant sont à 40 % : environ 180 € à prévoir rapidement.",
        "La révision des 4 ans arrive dans 4 mois (~160 €).",
        "Proposez 13 300 € pour conclure à 13 500 € — toujours sous la cote.",
      ],
    },
    checklist: [
      "Vérifier le carnet d'entretien Renault (tampons + factures)",
      "Contrôler l'historique HistoVec avant le rendez-vous",
      "Essai à froid : démarrage, boîte, direction",
      "Vérifier l'usure des pneus et des plaquettes",
      "Contrôle technique de moins de 6 mois pour la vente",
    ],
    market: [
      { label: "Clio V TCe 90 — 28 000 km", price: 15200, km: 28000 },
      { label: "Cette annonce", price: 13900, km: 32400, isCurrent: true },
      { label: "Clio V TCe 90 — 35 000 km", price: 14600, km: 35000 },
      { label: "Clio V TCe 90 — 41 000 km", price: 14290, km: 41000 },
      { label: "Clio V TCe 90 — 47 000 km", price: 13990, km: 47000 },
    ],
    subscores: [
      { label: "Prix", value: 92 },
      { label: "Historique", value: 90 },
      { label: "État déclaré", value: 84 },
      { label: "Coût d'usage", value: 88 },
      { label: "Revente", value: 81 },
    ],
  },
  {
    listing: {
      id: "peugeot-208-2019",
      title: "Peugeot 208 1.2 PureTech 100 Allure",
      make: "Peugeot",
      model: "208",
      year: 2019,
      km: 45800,
      fuel: "Essence",
      gearbox: "Manuelle",
      price: 13490,
      marketPrice: 12650,
      location: "Lyon (69)",
      sellerType: "Professionnel",
      power: "100 ch",
      source: "La Centrale",
      postedDays: 18,
      owners: 2,
      accent: "#38bdf8",
    },
    score: 64,
    verdict: "negotiate",
    summary:
      "Véhicule sain et bien équipé, mais affiché 6,6 % au-dessus de la cote et en ligne depuis 18 jours. Le moteur PureTech impose une vérification précise de la courroie. Marge de négociation réelle : ~800 €.",
    risks: [
      {
        severity: "medium",
        title: "Courroie de distribution PureTech",
        detail:
          "Ce moteur est concerné par une usure prématurée de la courroie humide. Exigez la facture du remplacement ou provisionnez ~800 €.",
      },
      {
        severity: "medium",
        title: "En ligne depuis 18 jours",
        detail: "Une annonce qui ne part pas à ce prix confirme qu'il est trop haut. Levier de négociation direct.",
      },
      {
        severity: "low",
        title: "2ᵉ main, historique partiel",
        detail: "Carnet suivi mais 2 factures manquantes entre 2021 et 2022. À demander au vendeur.",
      },
    ],
    fees: [
      { label: "Carte grise (69)", amount: 331, mandatory: true, note: "6 CV fiscaux, région Auvergne-Rhône-Alpes" },
      { label: "Frais de dossier concession", amount: 249, mandatory: false, note: "Négociables — souvent offerts si vous le demandez" },
      { label: "Courroie de distribution", amount: 800, mandatory: false, note: "Si non remplacée : à provisionner" },
    ],
    negotiation: {
      target: 12700,
      savings: 790,
      args: [
        "La cote Argus pour ce modèle et ce kilométrage est à 12 650 €.",
        "L'annonce est en ligne depuis 18 jours sans acheteur.",
        "La courroie PureTech non remplacée représente ~800 € de risque.",
        "Demandez le retrait des frais de dossier (249 €) en cas d'accord rapide.",
      ],
    },
    checklist: [
      "Exiger la facture de remplacement de la courroie de distribution",
      "Demander les 2 factures d'entretien manquantes (2021-2022)",
      "Vérifier la consommation d'huile à l'essai (jauge avant/après)",
      "Contrôler les rappels constructeur sur le site Peugeot",
      "Faire chiffrer la reprise ailleurs pour comparer",
    ],
    market: [
      { label: "208 PureTech 100 — 38 000 km", price: 13290, km: 38000 },
      { label: "208 PureTech 100 — 42 000 km", price: 12890, km: 42000 },
      { label: "Cette annonce", price: 13490, km: 45800, isCurrent: true },
      { label: "208 PureTech 100 — 51 000 km", price: 12490, km: 51000 },
      { label: "208 PureTech 100 — 58 000 km", price: 11990, km: 58000 },
    ],
    subscores: [
      { label: "Prix", value: 48 },
      { label: "Historique", value: 66 },
      { label: "État déclaré", value: 78 },
      { label: "Coût d'usage", value: 62 },
      { label: "Revente", value: 74 },
    ],
  },
  {
    listing: {
      id: "golf-7-gtd-2017",
      title: "Volkswagen Golf 7 2.0 TDI 184 GTD",
      make: "Volkswagen",
      model: "Golf 7 GTD",
      year: 2017,
      km: 89000,
      fuel: "Diesel",
      gearbox: "DSG7",
      price: 15990,
      marketPrice: 18400,
      location: "Strasbourg (67)",
      sellerType: "Professionnel",
      power: "184 ch",
      source: "AutoScout24",
      postedDays: 4,
      owners: 3,
      accent: "#a78bfa",
    },
    score: 29,
    verdict: "avoid",
    summary:
      "Prix 13 % sous la cote sans justification : c'est le premier signal d'alerte. Import allemand récent, 3 propriétaires, historique kilométrique incohérent entre 2021 et 2023, et un vendeur pro immatriculé depuis 5 mois. Trop de drapeaux rouges cumulés.",
    risks: [
      {
        severity: "high",
        title: "Kilométrage incohérent",
        detail:
          "Le contrôle technique de 2021 indique 91 000 km, l'annonce affiche 89 000 km en 2024. Suspicion forte de compteur trafiqué.",
      },
      {
        severity: "high",
        title: "Prix anormalement bas (-13 %)",
        detail:
          "Une GTD DSG sous la cote de 2 400 € sans défaut déclaré n'existe pas. Le « prix cassé » est la technique classique pour presser la décision.",
      },
      {
        severity: "high",
        title: "Vendeur pro créé il y a 5 mois",
        detail: "SIRET récent, adresse en zone résidentielle, aucune garantie mentionnée dans l'annonce. Profil typique du négociant éphémère.",
      },
      {
        severity: "medium",
        title: "Import Allemagne non documenté",
        detail: "Pas de carnet d'entretien fourni, quitus fiscal à votre charge. L'historique réel du véhicule est invérifiable.",
      },
    ],
    fees: [
      { label: "Carte grise (67)", amount: 611, mandatory: true, note: "11 CV fiscaux, région Grand Est" },
      { label: "Quitus fiscal (import)", amount: 0, mandatory: true, note: "Gratuit mais démarche obligatoire avant immatriculation" },
      { label: "Malus au premier enregistrement FR", amount: 740, mandatory: true, note: "Véhicule importé jamais immatriculé en France" },
      { label: "Expertise indépendante", amount: 120, mandatory: false, note: "Indispensable vu les incohérences relevées" },
    ],
    negotiation: {
      target: 0,
      savings: 2400,
      args: [
        "Ne négociez pas : passez votre chemin.",
        "Un compteur suspect rend le prix « attractif » hors de propos.",
        "L'économie apparente de 2 400 € peut coûter 6 000 € en litige.",
      ],
    },
    checklist: [
      "Ne versez aucun acompte, même « pour réserver »",
      "Signalez l'annonce si le vendeur presse la décision",
      "Une GTD saine se trouve entre 17 900 € et 19 500 € en France",
      "Relancez TrustDrive sur 2-3 annonces équivalentes françaises",
    ],
    market: [
      { label: "Golf GTD — 76 000 km (FR)", price: 19200, km: 76000 },
      { label: "Golf GTD — 84 000 km (FR)", price: 18600, km: 84000 },
      { label: "Golf GTD — 92 000 km (FR)", price: 17900, km: 92000 },
      { label: "Cette annonce", price: 15990, km: 89000, isCurrent: true },
      { label: "Golf GTD — 105 000 km (FR)", price: 16900, km: 105000 },
    ],
    subscores: [
      { label: "Prix", value: 35 },
      { label: "Historique", value: 12 },
      { label: "État déclaré", value: 41 },
      { label: "Coût d'usage", value: 55 },
      { label: "Revente", value: 30 },
    ],
  },
];

export const SAMPLE_ADS: Record<string, string> = {
  "clio-v-2021": `Renault Clio V 1.0 TCe 90ch Intens — 13 900 €
Année : 2021 · 32 400 km · Essence · Boîte manuelle
Première main, non fumeur, carnet d'entretien complet Renault.
CT OK, aucun frais à prévoir. Vendue cause passage à l'électrique.
Visible à Nantes (44). Particulier.`,
  "peugeot-208-2019": `PEUGEOT 208 1.2 PureTech 100ch Allure — 13 490 €
2019 · 45 800 km · Essence · Manuelle · 5 portes
GPS, CarPlay, caméra de recul, régulateur adaptatif.
Véhicule révisé, garantie 6 mois. Frais de dossier : 249 €.
Concession à Lyon (69). Professionnel.`,
  "golf-7-gtd-2017": `Volkswagen Golf 7 GTD 2.0 TDI 184 DSG — 15 990 € PRIX SACRIFIÉ
2017 · 89 000 km · Diesel · Automatique
Import Allemagne, dédouanée. Full options : cuir, toit ouvrant, Dynaudio.
Premier arrivé premier servi, prix net, pas d'échange.
Strasbourg (67). Professionnel.`,
};

export const QUESTIONNAIRE_RESULTS = [
  {
    profile: "citadin",
    cars: [
      { name: "Toyota Yaris Hybride", match: 94, reason: "Fiabilité record, sobre en ville, décote lente", budget: "13 000 – 17 000 €" },
      { name: "Renault Clio V TCe", match: 88, reason: "Confort et équipement au meilleur prix du segment", budget: "11 500 – 15 000 €" },
      { name: "Peugeot 208 PureTech", match: 82, reason: "Agrément et look, à condition de vérifier la courroie", budget: "11 000 – 14 500 €" },
    ],
  },
  {
    profile: "familial",
    cars: [
      { name: "Skoda Octavia Combi", match: 95, reason: "Coffre géant, coûts maîtrisés, très fiable", budget: "16 000 – 22 000 €" },
      { name: "Peugeot 3008 II", match: 87, reason: "Confort premium, forte demande à la revente", budget: "17 500 – 24 000 €" },
      { name: "Dacia Duster", match: 81, reason: "Imbattable en budget global, entretien économique", budget: "12 000 – 16 500 €" },
    ],
  },
  {
    profile: "routier",
    cars: [
      { name: "Skoda Superb TDI", match: 96, reason: "Reine de l'autoroute, sobriété diesel exemplaire", budget: "18 000 – 25 000 €" },
      { name: "Volkswagen Passat SW", match: 89, reason: "Confort de roulage et coffre XXL", budget: "16 500 – 23 000 €" },
      { name: "Toyota Corolla Hybride", match: 84, reason: "Zéro entretien lourd, idéale mixte route/ville", budget: "17 000 – 23 500 €" },
    ],
  },
];

export const TESTIMONIALS = [
  {
    name: "Sophie M.",
    role: "A acheté une Clio V à Rennes",
    text: "TrustDrive a repéré que la courroie n'avait jamais été faite. J'ai négocié 900 € de moins en citant leurs arguments, mot pour mot.",
    saving: "900 € économisés",
  },
  {
    name: "Karim B.",
    role: "Cherchait un SUV familial",
    text: "Le rapport a classé l'annonce « à éviter » : compteur incohérent. Trois semaines plus tard, le vendeur était signalé sur le site. Glaçant.",
    saving: "Arnaque évitée",
  },
  {
    name: "Julien R.",
    role: "Premier achat auto",
    text: "Je n'y connais rien en voiture. Le verdict clair + la checklist de rendez-vous m'ont donné confiance. Achat conclu sans stress.",
    saving: "650 € économisés",
  },
];
