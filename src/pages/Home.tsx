import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  BadgeEuro,
  Bell,
  CheckCheck,
  ClipboardPaste,
  FileSearch,
  Gauge,
  HandCoins,
  MessagesSquare,
  ScanLine,
  Scale,
  ShieldCheck,
  Sparkles,
  TrendingDown,
} from "lucide-react";
import { Link } from "react-router-dom";
import { CountUp, GhostButton, PrimaryButton, Reveal, SectionBadge, SpotlightCard } from "../components/ui";
import { ScoreGauge, VerdictBadge } from "../components/domain";
import { TESTIMONIALS, VERDICT_META } from "../lib/data";

export function Home() {
  return (
    <div className="relative">
      <Hero />
      <PlatformsBand />
      <HowItWorks />
      <BentoFeatures />
      <VerdictTrio />
      <Testimonials />
      <PricingTeaser />
      <FinalCTA />
    </div>
  );
}

/* ================= HERO ================= */

function Hero() {
  return (
    <section className="relative overflow-hidden pb-24 pt-36 sm:pt-44">
      {/* Fond aurora */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="bg-grid absolute inset-0" />
        <div
          className="absolute left-1/2 top-[-320px] h-[680px] w-[1100px] -translate-x-1/2 rounded-full opacity-60 blur-[120px]"
          style={{
            background:
              "radial-gradient(closest-side, rgba(16,185,129,0.28), rgba(56,189,248,0.14) 55%, transparent)",
          }}
        />
        <div
          className="absolute right-[-200px] top-[280px] h-[420px] w-[560px] rounded-full opacity-40 blur-[110px]"
          style={{ background: "radial-gradient(closest-side, rgba(56,189,248,0.22), transparent)" }}
        />
      </div>

      <div className="mx-auto max-w-6xl px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <SectionBadge>
            Nouveau — moteur d'analyse v2
            <span className="text-white/50 max-sm:hidden">· frais cachés région par région</span>
          </SectionBadge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08 }}
          className="text-balance mx-auto mt-7 max-w-4xl text-5xl font-semibold leading-[1.04] tracking-tight sm:text-6xl md:text-[76px]"
        >
          <span className="text-metal">Analysez avant</span>
          <br />
          <span className="font-display italic font-normal text-mint-gradient">de signer.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.16 }}
          className="text-balance mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/60"
        >
          Collez n'importe quelle annonce auto. TrustDrive identifie le véhicule, débusque les risques et les frais
          cachés, compare au marché — puis vous dit clairement s'il faut{" "}
          <strong className="font-semibold text-mint-300">acheter</strong>,{" "}
          <strong className="font-semibold text-amber-300">négocier</strong> ou{" "}
          <strong className="font-semibold text-rose-400">éviter</strong>.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.24 }}
          className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <PrimaryButton to="/analyse" size="lg">
            <ScanLine className="size-[18px]" />
            Analyser une annonce gratuitement
          </PrimaryButton>
          <GhostButton to="/rapport/clio-v-2021" size="lg">
            Voir un rapport d'exemple
            <ArrowRight className="size-4" />
          </GhostButton>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 text-[13px] text-white/40"
        >
          Sans carte bancaire · 2 analyses offertes · Résultat en 30 secondes
        </motion.p>
      </div>

      <HeroMockup />
      <StatsRow />
    </section>
  );
}

/* Mockup produit : annonce scannée → verdict */
function HeroMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, delay: 0.35, ease: [0.21, 0.65, 0.32, 1] }}
      className="relative mx-auto mt-16 max-w-5xl px-6"
    >
      <div className="ring-gradient glass-strong relative rounded-[28px] p-3 sm:p-4">
        {/* barre fenêtre */}
        <div className="flex items-center gap-2 px-3 pb-3 pt-1">
          <span className="size-2.5 rounded-full bg-white/15" />
          <span className="size-2.5 rounded-full bg-white/15" />
          <span className="size-2.5 rounded-full bg-white/15" />
          <span className="ml-3 flex items-center gap-2 rounded-lg bg-white/5 px-3 py-1 text-[11.5px] text-white/45">
            <ShieldCheck className="size-3.5 text-mint-400" />
            app.trustdrive.fr/analyse
          </span>
        </div>

        <div className="grid gap-3 rounded-2xl md:grid-cols-[1.15fr_1fr]">
          {/* Annonce scannée */}
          <div className="relative overflow-hidden rounded-2xl border border-white/8 bg-night-900/80 p-5 text-left">
            <div className="scan-line" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/35">
              Annonce détectée · La Centrale
            </p>
            <h3 className="mt-2 text-[17px] font-semibold text-white">Peugeot 208 1.2 PureTech 100 Allure</h3>
            <p className="mt-1 text-sm text-white/50">2019 · 45 800 km · Essence · Lyon (69)</p>
            <p className="mt-4 text-[28px] font-bold tracking-tight text-white">
              13 490 € <span className="align-middle text-[13px] font-medium text-rose-400">+6,6 % vs marché</span>
            </p>
            <div className="mt-5 space-y-2.5">
              {[
                { icon: AlertTriangle, text: "Courroie PureTech : facture à exiger", tone: "#fbbf24" },
                { icon: BadgeEuro, text: "Frais cachés détectés : 1 380 €", tone: "#fb7185" },
                { icon: TrendingDown, text: "En ligne depuis 18 jours : levier de négo", tone: "#38bdf8" },
              ].map((r) => (
                <div
                  key={r.text}
                  className="flex items-center gap-2.5 rounded-xl border border-white/6 bg-white/[0.03] px-3 py-2.5"
                >
                  <r.icon className="size-4 shrink-0" style={{ color: r.tone }} />
                  <span className="text-[13px] text-white/75">{r.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Verdict */}
          <div className="flex flex-col items-center justify-center rounded-2xl border border-white/8 bg-night-900/80 p-6">
            <VerdictBadge verdict="negotiate" />
            <div className="mt-4">
              <ScoreGauge score={64} verdict="negotiate" size={150} />
            </div>
            <div className="mt-4 w-full rounded-xl border border-amber-300/20 bg-amber-300/8 px-4 py-3 text-center">
              <p className="text-[12px] uppercase tracking-wider text-amber-200/70">Objectif de négociation</p>
              <p className="mt-0.5 text-xl font-bold text-amber-300">
                12 700 € <span className="text-[13px] font-semibold text-white/50">soit −790 €</span>
              </p>
            </div>
            <Link
              to="/rapport/peugeot-208-2019"
              className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-mint-300 hover:text-mint-400"
            >
              Ouvrir le rapport complet <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* chips flottantes */}
      <motion.div
        aria-hidden
        className="glass-strong absolute -bottom-6 left-10 z-10 hidden items-center gap-2 rounded-2xl px-4 py-3 lg:flex animate-float"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
      >
        <HandCoins className="size-5 text-mint-400" />
        <div>
          <p className="text-[13px] font-semibold text-white">743 € économisés</p>
          <p className="text-[11px] text-white/45">en moyenne par négociation</p>
        </div>
      </motion.div>
      <motion.div
        aria-hidden
        className="glass-strong absolute -top-6 right-10 z-10 hidden items-center gap-2 rounded-2xl px-4 py-3 lg:flex animate-float"
        style={{ animationDelay: "-3.5s" }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
      >
        <ShieldCheck className="size-5 text-sky-400" />
        <div>
          <p className="text-[13px] font-semibold text-white">1 annonce sur 11</p>
          <p className="text-[11px] text-white/45">présente un signal d'alerte majeur</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

function StatsRow() {
  const stats = [
    { value: 128400, suffix: "", label: "annonces analysées" },
    { value: 743, suffix: " €", label: "d'économie moyenne négociée" },
    { value: 9, suffix: " %", label: "d'annonces à risque détectées" },
    { value: 30, suffix: " s", label: "pour un verdict complet" },
  ];
  return (
    <Reveal className="mx-auto mt-20 max-w-5xl px-6">
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl glass md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-night-900/40 px-6 py-7 text-center">
            <p className="text-[30px] font-bold tracking-tight text-white tabular-nums">
              <CountUp value={s.value} suffix={s.suffix} />
            </p>
            <p className="mt-1 text-[13px] text-white/45">{s.label}</p>
          </div>
        ))}
      </div>
    </Reveal>
  );
}

/* ================= BANDEAU PLATEFORMES ================= */

function PlatformsBand() {
  const platforms = [
    "Leboncoin", "La Centrale", "AutoScout24", "ParuVendu", "L'Argus",
    "Aramisauto", "Spoticar", "Autohero", "Facebook Marketplace", "Ouest France Auto",
  ];
  const row = [...platforms, ...platforms];
  return (
    <section className="border-y border-white/6 bg-night-900/40 py-9">
      <p className="mb-6 text-center text-[12.5px] font-medium uppercase tracking-[0.2em] text-white/35">
        Fonctionne avec les annonces de toutes les plateformes
      </p>
      <div className="relative overflow-hidden" style={{ maskImage: "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)" }}>
        <div className="flex w-max animate-marquee gap-14 pr-14">
          {row.map((p, i) => (
            <span key={i} className="whitespace-nowrap text-[17px] font-semibold tracking-tight text-white/30">
              {p}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= COMMENT ÇA MARCHE ================= */

function HowItWorks() {
  const steps = [
    {
      icon: ClipboardPaste,
      step: "01",
      title: "Collez l'annonce",
      text: "Le lien ou le texte de n'importe quelle annonce — Leboncoin, La Centrale, un pro, un particulier.",
    },
    {
      icon: FileSearch,
      step: "02",
      title: "TrustDrive inspecte",
      text: "Véhicule identifié, prix confronté au marché, risques connus du modèle, incohérences et frais cachés relevés.",
    },
    {
      icon: CheckCheck,
      step: "03",
      title: "Décidez en confiance",
      text: "Un verdict limpide — acheter, négocier, éviter — avec le script de négociation et la checklist de rendez-vous.",
    },
  ];
  return (
    <section className="mx-auto max-w-6xl px-6 py-28">
      <Reveal className="text-center">
        <SectionBadge>Comment ça marche</SectionBadge>
        <h2 className="text-balance mx-auto mt-5 max-w-2xl text-4xl font-semibold tracking-tight text-metal sm:text-5xl">
          De l'annonce au verdict, <span className="font-display italic font-normal text-mint-gradient">en 30 secondes</span>
        </h2>
      </Reveal>
      <div className="mt-14 grid gap-5 md:grid-cols-3">
        {steps.map((s, i) => (
          <Reveal key={s.step} delay={i * 0.12}>
            <SpotlightCard className="h-full p-7">
              <div className="flex items-center justify-between">
                <span className="flex size-12 items-center justify-center rounded-2xl border border-mint-400/25 bg-mint-400/10">
                  <s.icon className="size-5 text-mint-300" />
                </span>
                <span className="font-display text-4xl italic text-white/12">{s.step}</span>
              </div>
              <h3 className="mt-5 text-lg font-semibold text-white">{s.title}</h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-white/55">{s.text}</p>
            </SpotlightCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ================= BENTO FEATURES ================= */

function BentoFeatures() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-28">
      <Reveal className="text-center">
        <SectionBadge>Ce que TrustDrive voit à votre place</SectionBadge>
        <h2 className="text-balance mx-auto mt-5 max-w-2xl text-4xl font-semibold tracking-tight text-metal sm:text-5xl">
          Un expert automobile, <span className="font-display italic font-normal text-mint-gradient">dans votre poche</span>
        </h2>
      </Reveal>

      <div className="mt-14 grid gap-5 md:grid-cols-3">
        {/* Grande tuile : détection des risques */}
        <Reveal className="md:col-span-2 md:row-span-2">
          <SpotlightCard className="flex h-full flex-col p-8">
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-2xl border border-rose-400/25 bg-rose-400/10">
                <AlertTriangle className="size-5 text-rose-400" />
              </span>
              <h3 className="text-xl font-semibold text-white">Détection des risques</h3>
            </div>
            <p className="mt-3 max-w-md text-[14.5px] leading-relaxed text-white/55">
              Pannes connues du modèle, kilométrage incohérent, vendeur douteux, import non documenté : chaque signal est
              relevé, expliqué et hiérarchisé.
            </p>
            <div className="mt-6 flex-1 space-y-3">
              {[
                { sev: "Critique", color: "#fb7185", text: "CT 2021 : 91 000 km — annonce 2024 : 89 000 km. Compteur suspect." },
                { sev: "Vigilance", color: "#fbbf24", text: "Courroie humide PureTech : remplacement à vérifier avant 60 000 km." },
                { sev: "Mineur", color: "#38bdf8", text: "Pneus avant à 40 % : ~180 € à prévoir, bon argument de négociation." },
              ].map((r) => (
                <div key={r.text} className="flex items-start gap-3 rounded-2xl border border-white/6 bg-white/[0.03] p-4">
                  <span
                    className="mt-0.5 shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-bold"
                    style={{ color: r.color, background: `${r.color}1a`, border: `1px solid ${r.color}40` }}
                  >
                    {r.sev}
                  </span>
                  <p className="text-[13.5px] leading-relaxed text-white/70">{r.text}</p>
                </div>
              ))}
            </div>
          </SpotlightCard>
        </Reveal>

        <Reveal delay={0.08}>
          <SpotlightCard className="h-full p-7">
            <BadgeEuro className="size-6 text-amber-300" />
            <h3 className="mt-4 text-lg font-semibold text-white">Frais cachés chiffrés</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-white/55">
              Carte grise selon votre région, malus, courroie, frais de dossier : le vrai prix, pas celui de l'annonce.
            </p>
            <p className="mt-4 rounded-xl border border-amber-300/20 bg-amber-300/8 px-3.5 py-2.5 text-[13px] font-semibold text-amber-300">
              + 1 380 € au-delà du prix affiché
            </p>
          </SpotlightCard>
        </Reveal>

        <Reveal delay={0.16}>
          <SpotlightCard className="h-full p-7">
            <Gauge className="size-6 text-mint-300" />
            <h3 className="mt-4 text-lg font-semibold text-white">Prix confronté au marché</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-white/55">
              Cote et annonces comparables en temps réel : vous savez si le prix est juste, gonflé, ou trop beau pour être
              honnête.
            </p>
          </SpotlightCard>
        </Reveal>

        <Reveal delay={0.1}>
          <SpotlightCard className="h-full p-7">
            <MessagesSquare className="size-6 text-sky-400" />
            <h3 className="mt-4 text-lg font-semibold text-white">Script de négociation</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-white/55">
              Des arguments factuels prêts à l'emploi et un prix cible : vous négociez comme un pro, preuves à l'appui.
            </p>
          </SpotlightCard>
        </Reveal>

        <Reveal delay={0.18}>
          <SpotlightCard className="h-full p-7">
            <Scale className="size-6 text-violet-400" />
            <h3 className="mt-4 text-lg font-semibold text-white">Comparateur d'annonces</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-white/55">
              Jusqu'à trois annonces côte à côte, notées sur cinq critères. Le meilleur choix devient une évidence.
            </p>
            <Link to="/comparateur" className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-mint-300 hover:text-mint-400">
              Essayer le comparateur <ArrowRight className="size-3.5" />
            </Link>
          </SpotlightCard>
        </Reveal>

        <Reveal delay={0.26}>
          <SpotlightCard className="h-full p-7">
            <Bell className="size-6 text-mint-300" />
            <h3 className="mt-4 text-lg font-semibold text-white">Alertes prix</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-white/55">
              L'annonce baisse, un modèle équivalent apparaît moins cher : vous êtes prévenu avant les autres.
            </p>
          </SpotlightCard>
        </Reveal>
      </div>
    </section>
  );
}

/* ================= VERDICTS ================= */

function VerdictTrio() {
  const items = [
    {
      verdict: "buy" as const,
      example: "Clio V 2021, 1ʳᵉ main, 5,8 % sous la cote, carnet complet.",
      note: "Foncez — avec la checklist de rendez-vous en poche.",
    },
    {
      verdict: "negotiate" as const,
      example: "208 affichée 840 € au-dessus du marché, en ligne depuis 18 jours.",
      note: "Négociez avec nos arguments chiffrés. Objectif : −790 €.",
    },
    {
      verdict: "avoid" as const,
      example: "Golf GTD importée, −13 % sous la cote, kilométrage incohérent.",
      note: "Passez votre chemin. L'économie apparente est un piège.",
    },
  ];
  return (
    <section className="relative border-y border-white/6 bg-night-900/40 py-28">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="text-center">
          <SectionBadge>Le verdict TrustDrive</SectionBadge>
          <h2 className="text-balance mx-auto mt-5 max-w-2xl text-4xl font-semibold tracking-tight text-metal sm:text-5xl">
            Trois réponses possibles. <span className="font-display italic font-normal text-mint-gradient">Zéro ambiguïté.</span>
          </h2>
        </Reveal>
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {items.map((item, i) => {
            const meta = VERDICT_META[item.verdict];
            return (
              <Reveal key={item.verdict} delay={i * 0.12}>
                <div
                  className="glass h-full rounded-3xl p-7 transition-transform duration-300 hover:-translate-y-1.5"
                  style={{ boxShadow: `inset 0 1px 0 rgba(255,255,255,0.05), 0 24px 60px -28px ${meta.color}30` }}
                >
                  <VerdictBadge verdict={item.verdict} size="lg" />
                  <p className="mt-5 text-[13px] font-semibold uppercase tracking-wider" style={{ color: meta.color }}>
                    {meta.headline}
                  </p>
                  <p className="mt-3 text-[14.5px] leading-relaxed text-white/70">{item.example}</p>
                  <p className="mt-4 border-t border-white/8 pt-4 text-[13.5px] leading-relaxed text-white/50">
                    {item.note}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ================= TÉMOIGNAGES ================= */

function Testimonials() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-28">
      <Reveal className="text-center">
        <SectionBadge>Ils ont signé en confiance</SectionBadge>
        <h2 className="text-balance mx-auto mt-5 max-w-2xl text-4xl font-semibold tracking-tight text-metal sm:text-5xl">
          Des acheteurs <span className="font-display italic font-normal text-mint-gradient">mieux armés</span> que les vendeurs
        </h2>
      </Reveal>
      <div className="mt-14 grid gap-5 md:grid-cols-3">
        {TESTIMONIALS.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.12}>
            <SpotlightCard className="flex h-full flex-col p-7">
              <div className="flex gap-1 text-mint-400">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Sparkles key={j} className="size-3.5 fill-current" />
                ))}
              </div>
              <p className="mt-4 flex-1 text-[15px] leading-relaxed text-white/75">« {t.text} »</p>
              <div className="mt-6 flex items-center justify-between border-t border-white/8 pt-5">
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-[12.5px] text-white/45">{t.role}</p>
                </div>
                <span className="rounded-full border border-mint-400/25 bg-mint-400/10 px-3 py-1 text-[12px] font-semibold text-mint-300">
                  {t.saving}
                </span>
              </div>
            </SpotlightCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ================= PRICING TEASER ================= */

function PricingTeaser() {
  const tiers = [
    { name: "Découverte", price: "0 €", note: "2 analyses / mois", cta: "Commencer" },
    { name: "Pilote", price: "9,90 €", note: "Analyses illimitées + comparateur + alertes", cta: "Essayer 14 jours", featured: true },
    { name: "Copilote+", price: "24,90 €", note: "Vérification historique + expert au téléphone", cta: "Découvrir" },
  ];
  return (
    <section className="border-t border-white/6 bg-night-900/40 py-28">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="text-center">
          <SectionBadge>Tarifs</SectionBadge>
          <h2 className="text-balance mx-auto mt-5 max-w-2xl text-4xl font-semibold tracking-tight text-metal sm:text-5xl">
            Moins cher qu'une <span className="font-display italic font-normal text-mint-gradient">seule erreur</span> d'achat
          </h2>
        </Reveal>
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {tiers.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.1}>
              <div
                className={`h-full rounded-3xl p-7 text-center ${
                  t.featured ? "ring-gradient glass-strong scale-[1.02]" : "glass"
                }`}
              >
                <p className="text-[13px] font-semibold uppercase tracking-wider text-white/45">{t.name}</p>
                <p className="mt-3 text-4xl font-bold tracking-tight text-white">
                  {t.price}
                  <span className="text-[14px] font-medium text-white/40"> /mois</span>
                </p>
                <p className="mt-2 text-[13.5px] text-white/55">{t.note}</p>
                <div className="mt-6">
                  {t.featured ? (
                    <PrimaryButton to="/tarifs" className="w-full">{t.cta}</PrimaryButton>
                  ) : (
                    <GhostButton to="/tarifs" className="w-full">{t.cta}</GhostButton>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-8 text-center">
          <Link to="/tarifs" className="inline-flex items-center gap-1.5 text-sm font-medium text-mint-300 hover:text-mint-400">
            Comparer les offres en détail <ArrowRight className="size-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

/* ================= CTA FINAL ================= */

function FinalCTA() {
  return (
    <section className="relative overflow-hidden py-32">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div
          className="absolute left-1/2 top-1/2 h-[420px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-50 blur-[110px]"
          style={{ background: "radial-gradient(closest-side, rgba(16,185,129,0.3), rgba(56,189,248,0.12) 60%, transparent)" }}
        />
      </div>
      <Reveal className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-balance text-4xl font-semibold tracking-tight text-metal sm:text-[54px] sm:leading-[1.05]">
          La prochaine annonce que vous ouvrez,{" "}
          <span className="font-display italic font-normal text-mint-gradient">faites-la analyser.</span>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg text-white/55">
          30 secondes pour savoir si c'est une bonne affaire, un coup à négocier — ou un piège à éviter.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <PrimaryButton to="/analyse" size="lg">
            <ScanLine className="size-[18px]" />
            Analyser ma première annonce
          </PrimaryButton>
        </div>
        <p className="mt-4 text-[13px] text-white/40">Gratuit. Sans carte bancaire. Verdict immédiat.</p>
      </Reveal>
    </section>
  );
}
