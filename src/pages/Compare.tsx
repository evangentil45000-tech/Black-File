import { Link } from "react-router-dom";
import { ArrowRight, Crown, ScanLine } from "lucide-react";
import { SAMPLE_REPORTS, VERDICT_META } from "../lib/data";
import { euro, kmFmt } from "../lib/store";
import { CarThumb, RadarChart, VerdictBadge } from "../components/domain";
import { PrimaryButton, Reveal, SectionBadge } from "../components/ui";

const SERIES_COLORS = ["#34d399", "#38bdf8", "#a78bfa"];

export function Compare() {
  const reports = SAMPLE_REPORTS;
  const winner = reports.reduce((a, b) => (b.score > a.score ? b : a));
  const axes = reports[0].subscores.map((s) => s.label);

  return (
    <div className="relative min-h-screen pb-24 pt-36">
      <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
        <div className="bg-grid absolute inset-0" />
        <div
          className="absolute left-1/2 top-[-280px] h-[560px] w-[980px] -translate-x-1/2 rounded-full opacity-45 blur-[130px]"
          style={{ background: "radial-gradient(closest-side, rgba(56,189,248,0.22), rgba(16,185,129,0.12) 60%, transparent)" }}
        />
      </div>

      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="text-center">
          <SectionBadge>Comparateur</SectionBadge>
          <h1 className="text-balance mx-auto mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-metal sm:text-[52px] sm:leading-[1.05]">
            Trois annonces. <span className="font-display italic font-normal text-mint-gradient">Un seul bon choix.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[16px] text-white/55">
            TrustDrive note chaque annonce sur cinq critères et désigne la meilleure affaire — preuves à l'appui.
          </p>
        </Reveal>

        {/* Cartes candidates */}
        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {reports.map((r, i) => {
            const isWinner = r.listing.id === winner.listing.id;
            const meta = VERDICT_META[r.verdict];
            return (
              <Reveal key={r.listing.id} delay={i * 0.1}>
                <div
                  className={`relative h-full rounded-3xl p-6 ${
                    isWinner ? "ring-gradient glass-strong" : "glass opacity-95"
                  }`}
                >
                  {isWinner && (
                    <span className="absolute -top-3.5 left-1/2 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-gradient-to-r from-mint-300 to-mint-500 px-4 py-1.5 text-[12px] font-bold text-night-950 shadow-[0_8px_24px_-6px_rgba(52,211,153,0.6)]">
                      <Crown className="size-3.5" />
                      Meilleur choix TrustDrive
                    </span>
                  )}
                  <CarThumb accent={r.listing.accent} className="h-24 w-full" />
                  <div className="mt-4 flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-[16px] font-semibold leading-snug text-white">{r.listing.title}</h2>
                      <p className="mt-1 text-[12.5px] text-white/45">
                        {r.listing.year} · {kmFmt(r.listing.km)} · {r.listing.location}
                      </p>
                    </div>
                    <span
                      className="flex size-11 shrink-0 items-center justify-center rounded-2xl text-[15px] font-bold tabular-nums"
                      style={{ color: meta.color, background: meta.bg, border: `1px solid ${meta.border}` }}
                    >
                      {r.score}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2.5 border-t border-white/8 pt-4">
                    <CompareRow label="Prix affiché" value={euro(r.listing.price)} strong />
                    <CompareRow
                      label="Écart vs marché"
                      value={`${r.listing.price > r.listing.marketPrice ? "+" : "−"}${euro(Math.abs(r.listing.price - r.listing.marketPrice))}`}
                      color={r.listing.price > r.listing.marketPrice ? "#fb7185" : "#34d399"}
                    />
                    <CompareRow
                      label="Frais cachés"
                      value={euro(r.fees.reduce((s, f) => s + f.amount, 0))}
                      color="#fbbf24"
                    />
                    <CompareRow
                      label="Risques critiques"
                      value={String(r.risks.filter((x) => x.severity === "high").length)}
                      color={r.risks.some((x) => x.severity === "high") ? "#fb7185" : "#34d399"}
                    />
                    <CompareRow label="Propriétaires" value={String(r.listing.owners)} />
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[13px] text-white/50">Verdict</span>
                      <VerdictBadge verdict={r.verdict} size="sm" />
                    </div>
                  </div>

                  <Link
                    to={`/rapport/${r.listing.id}`}
                    className={`mt-5 flex w-full items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-[13.5px] font-semibold transition-all ${
                      isWinner
                        ? "bg-gradient-to-b from-mint-300 to-mint-500 text-night-950 glow-mint hover:brightness-110"
                        : "glass text-white/80 hover:bg-white/10"
                    }`}
                  >
                    Rapport complet <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Radar + lecture */}
        <Reveal className="mt-6">
          <div className="glass grid items-center gap-8 rounded-3xl p-8 lg:grid-cols-[1fr_1.2fr]">
            <div className="flex flex-col items-center">
              <RadarChart
                axes={axes}
                size={340}
                series={reports.map((r, i) => ({
                  name: r.listing.title,
                  color: SERIES_COLORS[i],
                  values: r.subscores.map((s) => s.value),
                }))}
              />
              <div className="mt-2 flex flex-wrap justify-center gap-4">
                {reports.map((r, i) => (
                  <span key={r.listing.id} className="flex items-center gap-2 text-[12.5px] text-white/60">
                    <span className="size-2.5 rounded-full" style={{ background: SERIES_COLORS[i] }} />
                    {r.listing.make} {r.listing.model}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-white">
                Lecture TrustDrive
              </h2>
              <div className="mt-5 space-y-4 text-[14.5px] leading-relaxed text-white/65">
                <p>
                  <strong className="font-semibold text-mint-300">La Clio V domine sur tous les axes</strong> : prix sous
                  la cote, première main, historique limpide. C'est l'achat rationnel — et le rapport fournit déjà les
                  deux arguments pour gratter 400 € de plus.
                </p>
                <p>
                  <strong className="font-semibold text-amber-300">La 208 reste jouable</strong>, mais uniquement à
                  12 700 €. Au prix affiché, elle est dominée par la Clio sur le prix, l'historique et le coût d'usage.
                </p>
                <p>
                  <strong className="font-semibold text-rose-400">La Golf GTD est éliminée d'office</strong> : un
                  kilométrage incohérent est rédhibitoire, quel que soit le prix. Son « avantage » tarifaire est
                  précisément le signal d'alerte.
                </p>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <PrimaryButton to={`/rapport/${winner.listing.id}`}>
                  Voir le rapport du gagnant <ArrowRight className="size-4" />
                </PrimaryButton>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal className="mt-14 text-center">
          <p className="text-[14px] text-white/45">Vous hésitez entre plusieurs annonces trouvées en ligne ?</p>
          <div className="mt-4">
            <PrimaryButton to="/analyse">
              <ScanLine className="size-4" />
              Analyser mes propres annonces
            </PrimaryButton>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

function CompareRow({
  label,
  value,
  color,
  strong,
}: {
  label: string;
  value: string;
  color?: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[13px] text-white/50">{label}</span>
      <span
        className={`text-[13.5px] tabular-nums ${strong ? "font-bold text-white" : "font-semibold"}`}
        style={color ? { color } : { color: strong ? undefined : "rgba(255,255,255,0.8)" }}
      >
        {value}
      </span>
    </div>
  );
}
