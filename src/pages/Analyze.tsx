import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ClipboardPaste, Link2, Loader2, ScanLine, Sparkles } from "lucide-react";
import { SAMPLE_ADS, SAMPLE_REPORTS } from "../lib/data";
import { analyzeAd, parseAd, SCAN_STEPS } from "../lib/engine";
import { saveReport } from "../lib/store";
import { PrimaryButton, SectionBadge } from "../components/ui";

export function Analyze() {
  const [text, setText] = useState("");
  const [scanning, setScanning] = useState(false);
  const parsed = parseAd(text);
  const detected = [
    parsed.make && `Marque : ${parsed.make}`,
    parsed.price && `Prix : ${parsed.price.toLocaleString("fr-FR")} €`,
    parsed.km && `Kilométrage : ${parsed.km.toLocaleString("fr-FR")} km`,
    parsed.year && `Année : ${parsed.year}`,
    parsed.fuel && `Carburant : ${parsed.fuel}`,
  ].filter(Boolean) as string[];

  return (
    <div className="relative min-h-screen overflow-hidden pb-24 pt-36">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="bg-grid absolute inset-0" />
        <div
          className="absolute left-1/2 top-[-260px] h-[560px] w-[900px] -translate-x-1/2 rounded-full opacity-50 blur-[120px]"
          style={{ background: "radial-gradient(closest-side, rgba(16,185,129,0.25), rgba(56,189,248,0.1) 60%, transparent)" }}
        />
      </div>

      <AnimatePresence mode="wait">
        {scanning ? (
          <ScanStage key="scan" text={text} />
        ) : (
          <motion.div
            key="input"
            className="mx-auto max-w-3xl px-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30, transition: { duration: 0.3 } }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center">
              <SectionBadge>Analyse d'annonce</SectionBadge>
              <h1 className="text-balance mt-6 text-4xl font-semibold tracking-tight text-metal sm:text-[52px] sm:leading-[1.05]">
                Collez l'annonce.
                <br />
                <span className="font-display italic font-normal text-mint-gradient">On s'occupe du reste.</span>
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-[16px] text-white/55">
                Lien ou texte complet de l'annonce — TrustDrive identifie le véhicule, vérifie le prix et détecte les
                pièges avant votre premier appel au vendeur.
              </p>
            </div>

            <div className="ring-gradient glass-strong mt-10 rounded-3xl p-2">
              <div className="flex items-center gap-2 px-4 pb-1 pt-3 text-[12px] text-white/40">
                <Link2 className="size-3.5" />
                Collez un lien Leboncoin, La Centrale… ou le texte intégral de l'annonce
              </div>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={`Exemple :\nPeugeot 208 1.2 PureTech 100 Allure — 13 490 €\n2019 · 45 800 km · Essence · Lyon (69)…`}
                rows={7}
                className="w-full resize-none rounded-2xl bg-transparent px-4 py-3 text-[15px] leading-relaxed text-white placeholder:text-white/25 focus:outline-none"
              />
              <div className="flex flex-col gap-3 border-t border-white/8 p-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-h-7 flex-wrap items-center gap-1.5 px-1">
                  <AnimatePresence>
                    {detected.map((d) => (
                      <motion.span
                        key={d}
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.85 }}
                        className="inline-flex items-center gap-1.5 rounded-full border border-mint-400/25 bg-mint-400/10 px-2.5 py-1 text-[11.5px] font-medium text-mint-300"
                      >
                        <Check className="size-3" />
                        {d}
                      </motion.span>
                    ))}
                  </AnimatePresence>
                  {text.length > 0 && detected.length === 0 && (
                    <span className="text-[12px] text-white/35">Lecture de l'annonce en direct…</span>
                  )}
                </div>
                <PrimaryButton
                  onClick={() => text.trim().length >= 12 && setScanning(true)}
                  className={text.trim().length < 12 ? "pointer-events-none opacity-40" : ""}
                >
                  <ScanLine className="size-4" />
                  Lancer l'analyse
                </PrimaryButton>
              </div>
            </div>

            <div className="mt-10">
              <p className="flex items-center justify-center gap-2 text-[13px] font-medium text-white/40">
                <Sparkles className="size-3.5 text-mint-400" />
                Pas d'annonce sous la main ? Essayez avec un exemple réel :
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {SAMPLE_REPORTS.map((r) => (
                  <button
                    key={r.listing.id}
                    onClick={() => setText(SAMPLE_ADS[r.listing.id])}
                    className="glass group cursor-pointer rounded-2xl p-4 text-left transition-all hover:-translate-y-0.5 hover:bg-white/8"
                  >
                    <p className="flex items-center gap-2 text-[13.5px] font-semibold text-white">
                      <ClipboardPaste className="size-3.5 text-mint-400 opacity-0 transition-opacity group-hover:opacity-100" />
                      {r.listing.make} {r.listing.model}
                    </p>
                    <p className="mt-1 text-[12.5px] text-white/45">
                      {r.listing.year} · {r.listing.km.toLocaleString("fr-FR")} km ·{" "}
                      {r.listing.price.toLocaleString("fr-FR")} €
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------- Étape de scan ---------- */

function ScanStage({ text }: { text: string }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const reportRef = useRef(analyzeAd(text));

  useEffect(() => {
    const delays = [850, 950, 1100, 1200, 950, 900];
    if (step < SCAN_STEPS.length) {
      const t = setTimeout(() => setStep((s) => s + 1), delays[step] ?? 900);
      return () => clearTimeout(t);
    }
    const report = reportRef.current;
    saveReport(report);
    const t = setTimeout(() => navigate(`/rapport/${report.listing.id}`), 700);
    return () => clearTimeout(t);
  }, [step, navigate]);

  const l = reportRef.current.listing;

  return (
    <motion.div
      className="mx-auto max-w-xl px-6 pt-6"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
    >
      {/* Radar */}
      <div className="relative mx-auto flex size-44 items-center justify-center">
        <div className="absolute inset-0 rounded-full border border-mint-400/15" />
        <div className="absolute inset-5 rounded-full border border-mint-400/15" />
        <div className="absolute inset-10 rounded-full border border-mint-400/15" />
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: "conic-gradient(from 0deg, transparent 78%, rgba(52,211,153,0.35))",
            maskImage: "radial-gradient(circle, transparent 30%, #000 32%)",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
        />
        <ScanLine className="size-9 text-mint-300" />
      </div>

      <h2 className="mt-8 text-center text-2xl font-semibold tracking-tight text-white">
        Analyse en cours…
      </h2>
      <p className="mt-1.5 text-center text-[14px] text-white/45">
        {l.make} {l.model && `${l.model} · `}
        {l.year} · {l.km.toLocaleString("fr-FR")} km
      </p>

      <div className="glass-strong mt-8 space-y-1 rounded-3xl p-3">
        {SCAN_STEPS.map((s, i) => {
          const done = i < step;
          const active = i === step;
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0.4 }}
              animate={{ opacity: done || active ? 1 : 0.35 }}
              className={`flex items-center gap-3.5 rounded-2xl px-4 py-3 ${active ? "bg-white/5" : ""}`}
            >
              <span
                className={`flex size-7 shrink-0 items-center justify-center rounded-full border text-[11px] font-bold ${
                  done
                    ? "border-mint-400/40 bg-mint-400/15 text-mint-300"
                    : active
                      ? "border-white/20 text-white/70"
                      : "border-white/10 text-white/30"
                }`}
              >
                {done ? <Check className="size-3.5" /> : active ? <Loader2 className="size-3.5 animate-spin" /> : i + 1}
              </span>
              <div className="min-w-0">
                <p className={`text-[14px] font-medium ${done || active ? "text-white" : "text-white/40"}`}>{s.label}</p>
                {active && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[12px] text-white/40">
                    {s.detail}
                  </motion.p>
                )}
              </div>
              {done && <span className="ml-auto text-[11px] font-medium text-mint-400/70">OK</span>}
            </motion.div>
          );
        })}
      </div>

      <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-white/6">
        <motion.div
          className="h-full rounded-full"
          style={{ background: "linear-gradient(90deg, #34d399, #38bdf8)" }}
          animate={{ width: `${Math.min(100, (step / SCAN_STEPS.length) * 100)}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <p className="mt-3 text-center text-[12px] text-white/35">
        Croisement avec 128 400 annonces analysées
      </p>
    </motion.div>
  );
}
