import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  AlertOctagon,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BadgeEuro,
  CalendarDays,
  Check,
  ClipboardCheck,
  Copy,
  Fuel,
  Gauge as GaugeIcon,
  Info,
  MapPin,
  MessagesSquare,
  Route,
  ScanLine,
  Settings2,
  UserRound,
  Zap,
} from "lucide-react";
import { SAMPLE_REPORTS, VERDICT_META } from "../lib/data";
import { findReport, euro, kmFmt } from "../lib/store";
import type { Report as ReportType, RiskItem } from "../lib/types";
import { CarThumb, MarketChart, ScoreGauge, SubscoreBar, VerdictBadge } from "../components/domain";
import { GhostButton, PrimaryButton, Reveal } from "../components/ui";

const SEVERITY = {
  high: { label: "Critique", color: "#fb7185", icon: AlertOctagon },
  medium: { label: "Vigilance", color: "#fbbf24", icon: AlertTriangle },
  low: { label: "Mineur", color: "#38bdf8", icon: Info },
} as const;

export function Report() {
  const { id } = useParams();
  const report = useMemo(
    () => SAMPLE_REPORTS.find((r) => r.listing.id === id) ?? findReport(id ?? "") ?? SAMPLE_REPORTS[0],
    [id],
  );
  const { listing: l } = report;
  const meta = VERDICT_META[report.verdict];
  const delta = l.price - l.marketPrice;
  const deltaPct = ((delta / l.marketPrice) * 100).toFixed(1).replace(".", ",");
  const feesTotal = report.fees.reduce((s, f) => s + f.amount, 0);
  const mandatoryFees = report.fees.filter((f) => f.mandatory).reduce((s, f) => s + f.amount, 0);

  return (
    <div className="relative min-h-screen pb-24 pt-32">
      <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
        <div
          className="absolute left-1/2 top-[-260px] h-[520px] w-[900px] -translate-x-1/2 rounded-full opacity-40 blur-[130px]"
          style={{ background: `radial-gradient(closest-side, ${meta.color}38, transparent)` }}
        />
      </div>

      <div className="mx-auto max-w-6xl px-6">
        {/* fil d'ariane */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between">
          <Link
            to="/analyse"
            className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-white/50 transition-colors hover:text-white"
          >
            <ArrowLeft className="size-4" />
            Nouvelle analyse
          </Link>
          <p className="text-[12.5px] text-white/35">
            Rapport TrustDrive · source : {l.source} · en ligne depuis {l.postedDays} j
          </p>
        </motion.div>

        {/* ===== Bandeau verdict ===== */}
        <motion.section
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.21, 0.65, 0.32, 1] }}
          className="ring-gradient glass-strong mt-6 overflow-hidden rounded-[28px]"
        >
          <div className="grid lg:grid-cols-[1.5fr_1fr]">
            {/* Infos véhicule */}
            <div className="p-8">
              <div className="flex flex-wrap items-center gap-3">
                <VerdictBadge verdict={report.verdict} size="lg" />
                <span className="text-[13px] font-medium" style={{ color: meta.color }}>
                  {meta.headline}
                </span>
              </div>
              <h1 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl">{l.title}</h1>
              <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[14px] text-white/50">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="size-3.5" /> {l.location}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <UserRound className="size-3.5" /> {l.sellerType}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="size-3.5" /> {l.owners} propriétaire{l.owners > 1 ? "s" : ""}
                </span>
              </p>

              <div className="mt-6 flex items-end gap-5">
                <div>
                  <p className="text-[12px] uppercase tracking-wider text-white/40">Prix affiché</p>
                  <p className="text-[36px] font-bold leading-tight tracking-tight text-white">{euro(l.price)}</p>
                </div>
                <div className="pb-1">
                  <p className="text-[12px] uppercase tracking-wider text-white/40">vs marché</p>
                  <p
                    className="text-xl font-bold tabular-nums"
                    style={{ color: delta > 0 ? "#fb7185" : "#34d399" }}
                  >
                    {delta > 0 ? "+" : "−"}
                    {euro(Math.abs(delta))} ({delta > 0 ? "+" : "−"}
                    {deltaPct.replace("-", "")} %)
                  </p>
                </div>
              </div>

              <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {[
                  { icon: CalendarDays, label: "Année", value: String(l.year) },
                  { icon: Route, label: "Kilométrage", value: kmFmt(l.km) },
                  { icon: Fuel, label: "Carburant", value: l.fuel },
                  { icon: Settings2, label: "Boîte", value: l.gearbox },
                  { icon: Zap, label: "Puissance", value: l.power },
                  { icon: GaugeIcon, label: "Cote estimée", value: euro(l.marketPrice) },
                ].map((s) => (
                  <div key={s.label} className="rounded-2xl border border-white/6 bg-white/[0.03] px-4 py-3">
                    <p className="flex items-center gap-1.5 text-[11.5px] uppercase tracking-wide text-white/40">
                      <s.icon className="size-3.5" /> {s.label}
                    </p>
                    <p className="mt-1 text-[15px] font-semibold text-white">{s.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Score */}
            <div
              className="flex flex-col items-center justify-center gap-5 border-t border-white/8 p-8 lg:border-l lg:border-t-0"
              style={{ background: `radial-gradient(80% 90% at 50% 0%, ${meta.color}14, transparent 70%)` }}
            >
              <CarThumb accent={l.accent} className="h-28 w-full max-w-[240px]" />
              <ScoreGauge score={report.score} verdict={report.verdict} />
              <p className="max-w-[280px] text-center text-[13.5px] leading-relaxed text-white/60">{report.summary}</p>
            </div>
          </div>
        </motion.section>

        {/* ===== Corps du rapport ===== */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-6">
            {/* Risques */}
            <Reveal>
              <section className="glass rounded-3xl p-7">
                <SectionTitle icon={AlertTriangle} title="Risques détectés" badge={`${report.risks.length}`} />
                <div className="mt-5 space-y-3">
                  {report.risks.map((r) => (
                    <RiskRow key={r.title} risk={r} />
                  ))}
                </div>
              </section>
            </Reveal>

            {/* Marché */}
            <Reveal>
              <section className="glass rounded-3xl p-7">
                <SectionTitle icon={GaugeIcon} title="Positionnement marché" />
                <p className="mt-2 text-[13.5px] text-white/50">
                  Annonces comparables actuellement en ligne (même modèle, même génération).
                </p>
                <div className="mt-6">
                  <MarketChart samples={report.market} />
                </div>
              </section>
            </Reveal>

            {/* Négociation */}
            <Reveal>
              <NegotiationCard report={report} />
            </Reveal>
          </div>

          <div className="space-y-6">
            {/* Sous-scores */}
            <Reveal>
              <section className="glass rounded-3xl p-7">
                <SectionTitle icon={GaugeIcon} title="Détail du score" />
                <div className="mt-5 space-y-4">
                  {report.subscores.map((s) => (
                    <SubscoreBar key={s.label} label={s.label} value={s.value} />
                  ))}
                </div>
              </section>
            </Reveal>

            {/* Frais cachés */}
            <Reveal>
              <section className="glass rounded-3xl p-7">
                <SectionTitle icon={BadgeEuro} title="Frais au-delà du prix" />
                <div className="mt-5 space-y-3">
                  {report.fees.map((f) => (
                    <div key={f.label} className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[14px] font-medium text-white/85">
                          {f.label}
                          {f.mandatory && (
                            <span className="ml-2 rounded-full border border-rose-400/25 bg-rose-400/10 px-2 py-0.5 text-[10.5px] font-semibold text-rose-300">
                              obligatoire
                            </span>
                          )}
                        </p>
                        <p className="text-[12px] text-white/40">{f.note}</p>
                      </div>
                      <p className="shrink-0 text-[15px] font-semibold tabular-nums text-white">{euro(f.amount)}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-5 space-y-1.5 border-t border-white/8 pt-4">
                  <div className="flex justify-between text-[13px] text-white/55">
                    <span>Dont incompressibles</span>
                    <span className="tabular-nums">{euro(mandatoryFees)}</span>
                  </div>
                  <div className="flex justify-between text-[15px] font-bold text-amber-300">
                    <span>Budget réel estimé</span>
                    <span className="tabular-nums">{euro(l.price + feesTotal)}</span>
                  </div>
                </div>
              </section>
            </Reveal>

            {/* Checklist */}
            <Reveal>
              <ChecklistCard items={report.checklist} />
            </Reveal>
          </div>
        </div>

        {/* ===== Pied de rapport ===== */}
        <Reveal className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <PrimaryButton to="/analyse">
            <ScanLine className="size-4" />
            Analyser une autre annonce
          </PrimaryButton>
          <GhostButton to="/comparateur">
            Comparer avec d'autres annonces
            <ArrowRight className="size-4" />
          </GhostButton>
        </Reveal>
      </div>
    </div>
  );
}

function SectionTitle({
  icon: Icon,
  title,
  badge,
}: {
  icon: typeof AlertTriangle;
  title: string;
  badge?: string;
}) {
  return (
    <h2 className="flex items-center gap-3 text-[17px] font-semibold text-white">
      <span className="flex size-9 items-center justify-center rounded-xl border border-white/10 bg-white/5">
        <Icon className="size-4 text-mint-300" />
      </span>
      {title}
      {badge && (
        <span className="rounded-full bg-white/8 px-2.5 py-0.5 text-[12px] font-semibold text-white/60">{badge}</span>
      )}
    </h2>
  );
}

function RiskRow({ risk }: { risk: RiskItem }) {
  const s = SEVERITY[risk.severity];
  return (
    <div
      className="flex items-start gap-3.5 rounded-2xl border border-white/6 bg-white/[0.03] p-4"
      style={{ borderLeft: `3px solid ${s.color}` }}
    >
      <s.icon className="mt-0.5 size-4.5 shrink-0" style={{ color: s.color }} />
      <div>
        <p className="flex flex-wrap items-center gap-2 text-[14.5px] font-semibold text-white">
          {risk.title}
          <span
            className="rounded-full px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wide"
            style={{ color: s.color, background: `${s.color}18`, border: `1px solid ${s.color}40` }}
          >
            {s.label}
          </span>
        </p>
        <p className="mt-1 text-[13.5px] leading-relaxed text-white/55">{risk.detail}</p>
      </div>
    </div>
  );
}

function NegotiationCard({ report }: { report: ReportType }) {
  const [copied, setCopied] = useState(false);
  const meta = VERDICT_META[report.verdict];
  const isAvoid = report.verdict === "avoid";

  const copyScript = () => {
    const script = report.negotiation.args.map((a: string, i: number) => `${i + 1}. ${a}`).join("\n");
    navigator.clipboard?.writeText(`Arguments TrustDrive — ${report.listing.title}\n${script}`).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="glass rounded-3xl p-7">
      <SectionTitle icon={MessagesSquare} title={isAvoid ? "Notre recommandation" : "Plan de négociation"} />
      {!isAvoid && (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 text-center">
            <p className="text-[12px] uppercase tracking-wider text-white/40">Prix cible</p>
            <p className="mt-1 text-[26px] font-bold tabular-nums" style={{ color: meta.color }}>
              {euro(report.negotiation.target)}
            </p>
          </div>
          <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 text-center">
            <p className="text-[12px] uppercase tracking-wider text-white/40">Économie visée</p>
            <p className="mt-1 text-[26px] font-bold tabular-nums text-mint-300">
              −{euro(report.negotiation.savings)}
            </p>
          </div>
        </div>
      )}
      <ol className="mt-5 space-y-2.5">
        {report.negotiation.args.map((a: string, i: number) => (
          <li key={a} className="flex items-start gap-3 rounded-xl border border-white/6 bg-white/[0.03] px-4 py-3">
            <span className="mt-0.5 flex size-5.5 shrink-0 items-center justify-center rounded-full bg-white/8 text-[11px] font-bold text-white/60">
              {i + 1}
            </span>
            <span className="text-[14px] leading-relaxed text-white/75">{a}</span>
          </li>
        ))}
      </ol>
      {!isAvoid && (
        <button
          onClick={copyScript}
          className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-full glass px-4 py-2 text-[13px] font-medium text-white/80 transition-colors hover:bg-white/10"
        >
          {copied ? <Check className="size-3.5 text-mint-400" /> : <Copy className="size-3.5" />}
          {copied ? "Script copié !" : "Copier le script de négociation"}
        </button>
      )}
    </section>
  );
}

function ChecklistCard({ items }: { items: string[] }) {
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const toggle = (i: number) =>
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <section className="glass rounded-3xl p-7">
      <SectionTitle icon={ClipboardCheck} title="Checklist de rendez-vous" badge={`${checked.size}/${items.length}`} />
      <div className="mt-5 space-y-2">
        {items.map((item, i) => {
          const done = checked.has(i);
          return (
            <button
              key={item}
              onClick={() => toggle(i)}
              className="flex w-full cursor-pointer items-start gap-3 rounded-xl border border-white/6 bg-white/[0.03] px-4 py-3 text-left transition-colors hover:bg-white/6"
            >
              <span
                className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border transition-all ${
                  done ? "border-mint-400 bg-mint-400 text-night-950" : "border-white/20"
                }`}
              >
                {done && <Check className="size-3.5" strokeWidth={3} />}
              </span>
              <span className={`text-[13.5px] leading-relaxed ${done ? "text-white/35 line-through" : "text-white/75"}`}>
                {item}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
