import { useState } from "react";
import { motion } from "framer-motion";
import { Check, ChevronDown, Minus, ShieldCheck, Sparkles } from "lucide-react";
import { GhostButton, PrimaryButton, Reveal, SectionBadge } from "../components/ui";

interface Tier {
  name: string;
  tagline: string;
  monthly: number;
  featured?: boolean;
  cta: string;
  features: { text: string; included: boolean }[];
}

const TIERS: Tier[] = [
  {
    name: "Découverte",
    tagline: "Pour tester sur une vraie annonce",
    monthly: 0,
    cta: "Commencer gratuitement",
    features: [
      { text: "2 analyses complètes / mois", included: true },
      { text: "Verdict acheter · négocier · éviter", included: true },
      { text: "Détection des frais cachés", included: true },
      { text: "Script de négociation", included: false },
      { text: "Comparateur d'annonces", included: false },
      { text: "Alertes prix", included: false },
      { text: "Vérification historique approfondie", included: false },
    ],
  },
  {
    name: "Pilote",
    tagline: "Pour acheter sereinement dans les 3 mois",
    monthly: 9.9,
    featured: true,
    cta: "Essayer 14 jours gratuits",
    features: [
      { text: "Analyses illimitées", included: true },
      { text: "Verdict acheter · négocier · éviter", included: true },
      { text: "Détection des frais cachés", included: true },
      { text: "Script de négociation personnalisé", included: true },
      { text: "Comparateur jusqu'à 3 annonces", included: true },
      { text: "Alertes prix & nouveaux comparables", included: true },
      { text: "Vérification historique approfondie", included: false },
    ],
  },
  {
    name: "Copilote+",
    tagline: "Pour être accompagné jusqu'à la signature",
    monthly: 24.9,
    cta: "Découvrir Copilote+",
    features: [
      { text: "Tout Pilote, sans limite", included: true },
      { text: "Vérification historique approfondie", included: true },
      { text: "Contre-expertise par un expert auto", included: true },
      { text: "Appel de 20 min avant la signature", included: true },
      { text: "Relecture du bon de commande / contrat", included: true },
      { text: "Assistance litige 30 jours", included: true },
      { text: "Support prioritaire 7j/7", included: true },
    ],
  },
];

const FAQ = [
  {
    q: "Comment TrustDrive détecte-t-il les risques d'une annonce ?",
    a: "Nous croisons l'annonce avec les pannes connues du modèle, les cotes du marché, les incohérences internes du texte (kilométrage, année, prix) et les signaux vendeur. Chaque risque est expliqué et hiérarchisé — jamais de boîte noire.",
  },
  {
    q: "Est-ce que ça marche avec toutes les plateformes ?",
    a: "Oui. Collez le lien ou le texte d'une annonce Leboncoin, La Centrale, AutoScout24, Facebook Marketplace ou même d'un vendeur pro : l'analyse est identique.",
  },
  {
    q: "Puis-je annuler à tout moment ?",
    a: "Oui, en deux clics depuis votre dashboard. L'abonnement Pilote est sans engagement, et les 14 premiers jours sont gratuits — vous ne payez que si TrustDrive vous est réellement utile.",
  },
  {
    q: "Que contient la vérification historique de Copilote+ ?",
    a: "Rapport administratif complet (gages, oppositions, sinistres déclarés), cohérence des contrôles techniques successifs et vérification du kilométrage — le tout relu par un expert avant votre rendez-vous.",
  },
  {
    q: "Et si l'analyse me fait éviter un achat… il ne se passe rien ?",
    a: "C'est justement notre métier : une arnaque évitée vaut souvent plusieurs milliers d'euros. Nos utilisateurs économisent en moyenne 743 € par négociation — et bien davantage quand ils passent leur chemin au bon moment.",
  },
];

export function Pricing() {
  const [annual, setAnnual] = useState(true);

  return (
    <div className="relative min-h-screen pb-24 pt-36">
      <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
        <div className="bg-grid absolute inset-0" />
        <div
          className="absolute left-1/2 top-[-280px] h-[560px] w-[980px] -translate-x-1/2 rounded-full opacity-50 blur-[130px]"
          style={{ background: "radial-gradient(closest-side, rgba(16,185,129,0.24), rgba(56,189,248,0.1) 60%, transparent)" }}
        />
      </div>

      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="text-center">
          <SectionBadge>Tarifs</SectionBadge>
          <h1 className="text-balance mx-auto mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-metal sm:text-[52px] sm:leading-[1.05]">
            Une erreur d'achat coûte 3 000 €.
            <br />
            <span className="font-display italic font-normal text-mint-gradient">TrustDrive, 9,90 €.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[16px] text-white/55">
            Commencez gratuitement. Passez à Pilote le temps de votre recherche. Résiliez quand vous avez les clés.
          </p>

          {/* Toggle */}
          <div className="mt-9 inline-flex items-center gap-1 rounded-full glass p-1.5">
            <button
              onClick={() => setAnnual(false)}
              className={`cursor-pointer rounded-full px-5 py-2 text-[13.5px] font-semibold transition-all ${
                !annual ? "bg-white/12 text-white" : "text-white/50 hover:text-white/80"
              }`}
            >
              Mensuel
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`flex cursor-pointer items-center gap-2 rounded-full px-5 py-2 text-[13.5px] font-semibold transition-all ${
                annual ? "bg-white/12 text-white" : "text-white/50 hover:text-white/80"
              }`}
            >
              Annuel
              <span className="rounded-full bg-mint-400/15 px-2 py-0.5 text-[11px] font-bold text-mint-300">−20 %</span>
            </button>
          </div>
        </Reveal>

        {/* Cartes */}
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {TIERS.map((tier, i) => {
            const price = tier.monthly === 0 ? 0 : annual ? tier.monthly * 0.8 : tier.monthly;
            return (
              <Reveal key={tier.name} delay={i * 0.1}>
                <div
                  className={`relative flex h-full flex-col rounded-3xl p-7 ${
                    tier.featured ? "ring-gradient glass-strong lg:scale-[1.03]" : "glass"
                  }`}
                >
                  {tier.featured && (
                    <span className="absolute -top-3.5 left-1/2 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-gradient-to-r from-mint-300 to-mint-500 px-4 py-1.5 text-[12px] font-bold text-night-950 shadow-[0_8px_24px_-6px_rgba(52,211,153,0.6)]">
                      <Sparkles className="size-3.5" />
                      Le plus choisi
                    </span>
                  )}
                  <p className="text-[14px] font-semibold uppercase tracking-wider text-white/50">{tier.name}</p>
                  <p className="mt-1 text-[13px] text-white/45">{tier.tagline}</p>
                  <p className="mt-5 flex items-baseline gap-1.5">
                    <motion.span
                      key={`${tier.name}-${annual}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-[44px] font-bold leading-none tracking-tight text-white tabular-nums"
                    >
                      {price === 0 ? "0 €" : `${price.toFixed(2).replace(".", ",")} €`}
                    </motion.span>
                    <span className="text-[13.5px] text-white/40">/mois</span>
                  </p>
                  {tier.monthly > 0 && (
                    <p className="mt-1 text-[12px] text-white/35">
                      {annual ? "facturé annuellement · sans engagement" : "sans engagement, résiliable en 2 clics"}
                    </p>
                  )}
                  <ul className="mt-7 flex-1 space-y-3">
                    {tier.features.map((f) => (
                      <li key={f.text} className="flex items-start gap-2.5">
                        {f.included ? (
                          <Check className="mt-0.5 size-4 shrink-0 text-mint-400" strokeWidth={3} />
                        ) : (
                          <Minus className="mt-0.5 size-4 shrink-0 text-white/20" />
                        )}
                        <span className={`text-[13.5px] leading-relaxed ${f.included ? "text-white/80" : "text-white/30"}`}>
                          {f.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    {tier.featured ? (
                      <PrimaryButton to="/analyse" className="w-full">{tier.cta}</PrimaryButton>
                    ) : (
                      <GhostButton to="/analyse" className="w-full">{tier.cta}</GhostButton>
                    )}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Garanties */}
        <Reveal className="mt-10">
          <div className="glass flex flex-col items-center justify-center gap-x-10 gap-y-3 rounded-3xl px-8 py-6 sm:flex-row">
            {[
              "Satisfait ou remboursé 14 jours",
              "Paiement sécurisé Stripe",
              "Données hébergées en France",
              "Résiliation en 2 clics",
            ].map((g) => (
              <p key={g} className="flex items-center gap-2 text-[13.5px] font-medium text-white/60">
                <ShieldCheck className="size-4 text-mint-400" />
                {g}
              </p>
            ))}
          </div>
        </Reveal>

        {/* FAQ */}
        <div className="mx-auto mt-24 max-w-3xl">
          <Reveal className="text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-metal sm:text-4xl">Questions fréquentes</h2>
          </Reveal>
          <div className="mt-10 space-y-3">
            {FAQ.map((item, i) => (
              <Reveal key={item.q} delay={i * 0.05}>
                <FaqItem q={item.q} a={item.a} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="glass overflow-hidden rounded-2xl">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full cursor-pointer items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <span className="text-[15px] font-semibold text-white">{q}</span>
        <ChevronDown className={`size-4.5 shrink-0 text-white/40 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3, ease: [0.21, 0.65, 0.32, 1] }}
        className="overflow-hidden"
      >
        <p className="px-6 pb-5 text-[14px] leading-relaxed text-white/60">{a}</p>
      </motion.div>
    </div>
  );
}
