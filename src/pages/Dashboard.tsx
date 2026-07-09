import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Bell,
  Car,
  CircleGauge,
  Compass,
  HandCoins,
  LayoutGrid,
  Plus,
  Scale,
  ScanLine,
  Settings,
  Sparkles,
} from "lucide-react";
import { SAMPLE_REPORTS } from "../lib/data";
import { loadHistory, euro, kmFmt } from "../lib/store";
import type { Report } from "../lib/types";
import { CarThumb, VerdictBadge } from "../components/domain";
import { PrimaryButton, Reveal } from "../components/ui";

const NAV = [
  { icon: LayoutGrid, label: "Vue d'ensemble", to: "/dashboard", active: true },
  { icon: ScanLine, label: "Analyser", to: "/analyse" },
  { icon: Scale, label: "Comparateur", to: "/comparateur" },
  { icon: Compass, label: "Ma recherche", to: "/questionnaire" },
  { icon: Bell, label: "Alertes", to: "/dashboard" },
  { icon: Settings, label: "Réglages", to: "/dashboard" },
];

const ALERTS = [
  { title: "Clio V TCe 90 — Nantes", change: -350, note: "Baisse de prix il y a 2 h", tone: "down" as const },
  { title: "Nouvelle 208 comparable à Lyon", change: 12650, note: "290 € sous votre annonce suivie", tone: "new" as const },
  { title: "Golf GTD — Strasbourg", change: 0, note: "Annonce retirée du site", tone: "gone" as const },
];

export function Dashboard() {
  const history = useMemo(loadHistory, []);
  const seen = new Set(history.map((r) => r.listing.id));
  const analyses: Report[] = [...history, ...SAMPLE_REPORTS.filter((r) => !seen.has(r.listing.id))];
  const avgScore = Math.round(analyses.reduce((s, r) => s + r.score, 0) / analyses.length);
  const savings = analyses.reduce((s, r) => s + (r.verdict === "avoid" ? 0 : r.negotiation.savings), 0);

  const stats = [
    { icon: Car, label: "Annonces analysées", value: String(analyses.length), sub: "+2 cette semaine", up: true },
    { icon: HandCoins, label: "Économies identifiées", value: euro(savings), sub: "via négociation", up: true },
    { icon: Bell, label: "Alertes actives", value: "3", sub: "1 baisse de prix aujourd'hui", up: true },
    { icon: CircleGauge, label: "Score moyen du marché", value: `${avgScore}/100`, sub: "sur vos recherches", up: false },
  ];

  return (
    <div className="relative min-h-screen pb-24 pt-28">
      <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
        <div
          className="absolute right-[-220px] top-[-180px] h-[480px] w-[640px] rounded-full opacity-30 blur-[130px]"
          style={{ background: "radial-gradient(closest-side, rgba(16,185,129,0.3), transparent)" }}
        />
      </div>

      <div className="mx-auto flex max-w-7xl gap-6 px-4 sm:px-6">
        {/* Sidebar */}
        <aside className="sticky top-28 hidden h-fit w-56 shrink-0 lg:block">
          <div className="glass rounded-3xl p-3">
            {NAV.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-[13.5px] font-medium transition-colors ${
                  item.active ? "bg-white/10 text-white" : "text-white/55 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon className={`size-4 ${item.active ? "text-mint-300" : ""}`} />
                {item.label}
              </Link>
            ))}
          </div>
          <div className="ring-gradient glass mt-4 rounded-3xl p-5">
            <p className="flex items-center gap-2 text-[13px] font-bold text-white">
              <Sparkles className="size-4 text-mint-300" />
              Plan Pilote
            </p>
            <p className="mt-1.5 text-[12px] leading-relaxed text-white/50">Analyses illimitées jusqu'au 14 août.</p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/8">
              <div className="h-full w-[64%] rounded-full bg-gradient-to-r from-mint-400 to-sky-400" />
            </div>
            <p className="mt-1.5 text-[11px] text-white/35">23 jours restants</p>
          </div>
        </aside>

        {/* Contenu */}
        <main className="min-w-0 flex-1">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-[13px] font-medium text-mint-300">Jeudi 9 juillet</p>
                <h1 className="mt-1 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  Bonjour, Evan 👋
                </h1>
                <p className="mt-1.5 text-[14px] text-white/50">
                  Une baisse de prix sur une annonce suivie — c'est le moment d'appeler.
                </p>
              </div>
              <PrimaryButton to="/analyse">
                <Plus className="size-4" />
                Nouvelle analyse
              </PrimaryButton>
            </div>
          </Reveal>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-2 gap-4 xl:grid-cols-4">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.06}>
                <div className="glass rounded-3xl p-5">
                  <div className="flex items-center justify-between">
                    <span className="flex size-9 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                      <s.icon className="size-4 text-mint-300" />
                    </span>
                    {s.up ? (
                      <ArrowUpRight className="size-4 text-mint-400" />
                    ) : (
                      <ArrowDownRight className="size-4 text-white/30" />
                    )}
                  </div>
                  <p className="mt-4 text-[24px] font-bold tracking-tight text-white tabular-nums">{s.value}</p>
                  <p className="text-[12.5px] text-white/45">{s.label}</p>
                  <p className="mt-1 text-[11.5px] text-mint-400/80">{s.sub}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
            {/* Analyses récentes */}
            <Reveal>
              <section className="glass rounded-3xl p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-[16px] font-semibold text-white">Mes analyses récentes</h2>
                  <Link to="/analyse" className="text-[12.5px] font-medium text-mint-300 hover:text-mint-400">
                    Tout voir
                  </Link>
                </div>
                <div className="mt-4 space-y-3">
                  {analyses.slice(0, 5).map((r) => (
                    <Link
                      key={r.listing.id}
                      to={`/rapport/${r.listing.id}`}
                      className="group flex items-center gap-4 rounded-2xl border border-white/6 bg-white/[0.03] p-3.5 transition-all hover:-translate-y-0.5 hover:bg-white/6"
                    >
                      <CarThumb accent={r.listing.accent} className="h-14 w-20 shrink-0 max-sm:hidden" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[14px] font-semibold text-white">{r.listing.title}</p>
                        <p className="mt-0.5 text-[12px] text-white/45">
                          {r.listing.year} · {kmFmt(r.listing.km)} · {euro(r.listing.price)}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-3">
                        <span className="text-[15px] font-bold tabular-nums text-white/85 max-sm:hidden">
                          {r.score}
                          <span className="text-[11px] font-medium text-white/35">/100</span>
                        </span>
                        <VerdictBadge verdict={r.verdict} size="sm" />
                        <ArrowRight className="size-4 text-white/25 transition-all group-hover:translate-x-0.5 group-hover:text-mint-300" />
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            </Reveal>

            <div className="space-y-6">
              {/* Alertes */}
              <Reveal delay={0.05}>
                <section className="glass rounded-3xl p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="flex items-center gap-2 text-[16px] font-semibold text-white">
                      Alertes
                      <span className="flex size-5 items-center justify-center rounded-full bg-mint-400/15 text-[11px] font-bold text-mint-300">
                        3
                      </span>
                    </h2>
                  </div>
                  <div className="mt-4 space-y-3">
                    {ALERTS.map((a) => (
                      <div key={a.title} className="rounded-2xl border border-white/6 bg-white/[0.03] p-4">
                        <div className="flex items-start justify-between gap-3">
                          <p className="text-[13px] font-semibold leading-snug text-white/85">{a.title}</p>
                          {a.tone === "down" && (
                            <span className="shrink-0 rounded-full border border-mint-400/25 bg-mint-400/10 px-2 py-0.5 text-[11px] font-bold text-mint-300">
                              −{Math.abs(a.change)} €
                            </span>
                          )}
                          {a.tone === "new" && (
                            <span className="shrink-0 rounded-full border border-sky-400/25 bg-sky-400/10 px-2 py-0.5 text-[11px] font-bold text-sky-300">
                              Nouveau
                            </span>
                          )}
                          {a.tone === "gone" && (
                            <span className="shrink-0 rounded-full border border-white/12 bg-white/6 px-2 py-0.5 text-[11px] font-bold text-white/45">
                              Retirée
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-[12px] text-white/40">{a.note}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </Reveal>

              {/* Veille marché */}
              <Reveal delay={0.1}>
                <section className="glass rounded-3xl p-6">
                  <h2 className="text-[16px] font-semibold text-white">Veille marché — Clio V TCe</h2>
                  <p className="mt-1 text-[12px] text-white/40">Prix médian sur 6 semaines</p>
                  <Sparkline />
                  <div className="mt-3 flex items-baseline justify-between">
                    <p className="text-[22px] font-bold tabular-nums text-white">14 450 €</p>
                    <p className="flex items-center gap-1 text-[13px] font-semibold text-mint-400">
                      <ArrowDownRight className="size-4" />
                      −2,1 % ce mois
                    </p>
                  </div>
                  <p className="mt-2 text-[12px] leading-relaxed text-white/45">
                    Le marché se détend sur ce modèle : bonne fenêtre d'achat dans les 3 prochaines semaines.
                  </p>
                </section>
              </Reveal>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function Sparkline() {
  const points = [14850, 14790, 14820, 14680, 14560, 14510, 14450];
  const min = Math.min(...points);
  const max = Math.max(...points);
  const W = 280;
  const H = 64;
  const coords = points.map((p, i) => [
    (i / (points.length - 1)) * W,
    H - 6 - ((p - min) / (max - min)) * (H - 16),
  ]);
  const path = coords.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${path} L${W},${H} L0,${H} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mt-4 w-full">
      <defs>
        <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#34d399" stopOpacity="0.28" />
          <stop offset="1" stopColor="#34d399" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#spark-fill)" />
      <path d={path} fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx={coords[coords.length - 1][0]} cy={coords[coords.length - 1][1]} r="4" fill="#34d399" />
      <circle cx={coords[coords.length - 1][0]} cy={coords[coords.length - 1][1]} r="8" fill="#34d399" opacity="0.2" />
    </svg>
  );
}
