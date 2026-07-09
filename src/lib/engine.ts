import { SAMPLE_REPORTS } from "./data";
import type { Report, Verdict } from "./types";

const MAKES = [
  "Renault", "Peugeot", "Citroën", "Volkswagen", "Toyota", "Ford", "Opel",
  "Fiat", "BMW", "Mercedes", "Audi", "Skoda", "Seat", "Dacia", "Nissan",
  "Hyundai", "Kia", "Mini", "Volvo", "Tesla", "DS", "Suzuki", "Mazda", "Honda",
];

export interface ParsedAd {
  make: string | null;
  price: number | null;
  km: number | null;
  year: number | null;
  fuel: string | null;
}

/** Extraction légère des champs d'une annonce collée (prix, km, année, marque, carburant). */
export function parseAd(text: string): ParsedAd {
  const t = text.toLowerCase();

  const make = MAKES.find((m) => t.includes(m.toLowerCase())) ?? null;

  const priceMatch = text.match(/(\d{1,3}(?:[\s.]\d{3})+|\d{4,6})\s*€/);
  const price = priceMatch ? Number(priceMatch[1].replace(/[\s.]/g, "")) : null;

  const kmMatch = text.match(/(\d{1,3}(?:[\s.]\d{3})+|\d{4,6})\s*km/i);
  const km = kmMatch ? Number(kmMatch[1].replace(/[\s.]/g, "")) : null;

  const yearMatch = text.match(/\b(20[0-2]\d|199\d)\b/);
  const year = yearMatch ? Number(yearMatch[1]) : null;

  const fuel = /électrique|electrique|ev\b/i.test(t)
    ? "Électrique"
    : /hybride/i.test(t)
      ? "Hybride"
      : /diesel|tdi|hdi|dci|cdi|bluehdi/i.test(t)
        ? "Diesel"
        : /essence|tce|puretech|tsi|tfsi|vti/i.test(t)
          ? "Essence"
          : null;

  return { make, price, km, year, fuel };
}

/** Trouve le rapport d'exemple qui correspond le mieux au texte collé, sinon en génère un. */
export function analyzeAd(text: string): Report {
  const t = text.toLowerCase();
  const direct = SAMPLE_REPORTS.find(
    (r) => t.includes(r.listing.make.toLowerCase()) && t.includes(r.listing.model.split(" ")[0].toLowerCase()),
  );
  if (direct) return direct;

  const parsed = parseAd(text);
  const byMake = parsed.make
    ? SAMPLE_REPORTS.find((r) => r.listing.make.toLowerCase() === parsed.make!.toLowerCase())
    : null;
  if (byMake) return byMake;

  return generateReport(text, parsed);
}

/** Génère un rapport plausible et déterministe à partir des champs détectés. */
function generateReport(text: string, parsed: ParsedAd): Report {
  const seed = hash(text);
  const price = parsed.price ?? 9000 + (seed % 14) * 750;
  const km = parsed.km ?? 30000 + (seed % 90) * 1000;
  const year = parsed.year ?? 2017 + (seed % 7);
  const make = parsed.make ?? "Véhicule";
  const fuel = parsed.fuel ?? "Essence";

  // Écart au marché simulé, déterministe : entre -12 % et +12 %
  const deltaPct = ((seed % 25) - 12) / 100;
  const marketPrice = Math.round(price / (1 + deltaPct) / 10) * 10;

  const age = Math.max(0, 2026 - year);
  const kmPenalty = Math.min(30, Math.floor(km / 10000) * 2.2);
  const pricePenalty = Math.max(0, deltaPct * 220);
  const score = Math.max(8, Math.min(95, Math.round(88 - pricePenalty - kmPenalty * 0.4 - age * 1.4)));
  const verdict: Verdict = score >= 75 ? "buy" : score >= 45 ? "negotiate" : "avoid";

  const overpriced = price > marketPrice;
  const gap = Math.abs(price - marketPrice);

  return {
    listing: {
      id: `custom-${seed.toString(36)}`,
      title: `${make} — annonce analysée`,
      make,
      model: "",
      year,
      km,
      fuel,
      gearbox: seed % 3 === 0 ? "Automatique" : "Manuelle",
      price,
      marketPrice,
      location: "France",
      sellerType: seed % 2 === 0 ? "Particulier" : "Professionnel",
      power: "—",
      source: "Annonce collée",
      postedDays: (seed % 20) + 1,
      owners: (seed % 3) + 1,
      accent: "#38bdf8",
    },
    score,
    verdict,
    summary: overpriced
      ? `Annonce affichée ${fmtEuro(gap)} au-dessus du prix de marché estimé pour ce kilométrage. La marge de négociation est réelle : appuyez-vous sur les points relevés ci-dessous.`
      : `Annonce positionnée ${fmtEuro(gap)} sous le prix de marché estimé. Vérifiez les points de contrôle ci-dessous avant de vous engager : un bon prix ne dispense jamais de l'inspection.`,
    risks: [
      {
        severity: overpriced ? "medium" : "low",
        title: overpriced ? `Prix ${fmtEuro(gap)} au-dessus du marché` : "Prix sous le marché : vérifier pourquoi",
        detail: overpriced
          ? "Les annonces comparables se vendent moins cher. Utilisez le script de négociation pour ramener le prix dans le marché."
          : "Un prix attractif doit être justifié (vente rapide, défaut mineur…). Posez la question directement au vendeur.",
      },
      {
        severity: km > 120000 ? "medium" : "low",
        title: km > 120000 ? "Kilométrage élevé" : "Entretien à documenter",
        detail:
          km > 120000
            ? "Au-delà de 120 000 km, exigez les factures des entretiens lourds (distribution, embrayage, amortisseurs)."
            : "Demandez le carnet d'entretien et les dernières factures avant le rendez-vous.",
      },
      {
        severity: "low",
        title: "Historique administratif à contrôler",
        detail: "Demandez le rapport HistoVec (gratuit) : gages, oppositions, sinistres déclarés.",
      },
    ],
    fees: [
      { label: "Carte grise (estimation)", amount: Math.round((price > 15000 ? 6 : 5) * 55), mandatory: true, note: "Selon région et puissance fiscale" },
      { label: "Plaques + démarches", amount: 45, mandatory: true, note: "Pose en centre auto" },
      { label: "Entretien de mise à niveau", amount: 150 + (seed % 4) * 60, mandatory: false, note: "Vidange + filtres si non justifiés" },
    ],
    negotiation:
      verdict === "avoid"
        ? { target: 0, savings: gap, args: ["Trop de signaux défavorables : ne pas donner suite.", "Relancez une analyse sur des annonces comparables."] }
        : {
            target: overpriced ? marketPrice : Math.round(price * 0.97 / 10) * 10,
            savings: overpriced ? gap : Math.round(price * 0.03),
            args: [
              overpriced
                ? `Le prix de marché constaté est de ${fmtEuro(marketPrice)} pour ce profil.`
                : "Proposez un règlement rapide contre un geste sur le prix.",
              `L'annonce est en ligne depuis ${(seed % 20) + 1} jours.`,
              "Tout entretien non justifié par facture se déduit du prix.",
            ],
          },
    checklist: [
      "Vérifier le rapport HistoVec avant le déplacement",
      "Essai à froid : démarrage, bruits moteur, boîte",
      "Cohérence kilométrage / usure (volant, pédales, sièges)",
      "Contrôle technique de moins de 6 mois",
      "Ne jamais verser d'acompte avant d'avoir vu le véhicule",
    ],
    market: [
      { label: "Comparable — km inférieur", price: Math.round(marketPrice * 1.05), km: Math.round(km * 0.85) },
      { label: "Cette annonce", price, km, isCurrent: true },
      { label: "Comparable — km équivalent", price: marketPrice, km: Math.round(km * 1.02) },
      { label: "Comparable — km supérieur", price: Math.round(marketPrice * 0.93), km: Math.round(km * 1.2) },
    ],
    subscores: [
      { label: "Prix", value: clamp(Math.round(70 - deltaPct * 320), 10, 96) },
      { label: "Historique", value: clamp(60 + (seed % 30) - 10, 15, 92) },
      { label: "État déclaré", value: clamp(75 - age * 3, 20, 90) },
      { label: "Coût d'usage", value: clamp(80 - Math.floor(km / 15000) * 4, 25, 92) },
      { label: "Revente", value: clamp(65 + (seed % 20) - age * 2, 20, 88) },
    ],
  };
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function fmtEuro(n: number) {
  return `${n.toLocaleString("fr-FR")} €`;
}

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export const SCAN_STEPS = [
  { label: "Lecture de l'annonce", detail: "Extraction du texte et des champs structurés" },
  { label: "Identification du véhicule", detail: "Marque, modèle, finition, motorisation" },
  { label: "Confrontation au marché", detail: "Cote, annonces comparables, tension du segment" },
  { label: "Détection des risques", detail: "Fiabilité connue, incohérences, signaux vendeur" },
  { label: "Calcul des frais cachés", detail: "Carte grise, malus, entretien à prévoir" },
  { label: "Rédaction du verdict", detail: "Score, plan de négociation, checklist" },
];
