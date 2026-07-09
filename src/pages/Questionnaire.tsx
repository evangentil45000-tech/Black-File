import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Baby,
  BatteryCharging,
  Briefcase,
  Building2,
  Check,
  Coins,
  Compass,
  Fuel,
  Gauge,
  Heart,
  Leaf,
  Mountain,
  RotateCcw,
  ScanLine,
  Shield,
  Sofa,
  Sparkles,
} from "lucide-react";
import { QUESTIONNAIRE_RESULTS } from "../lib/data";
import { PrimaryButton, Reveal, SectionBadge } from "../components/ui";

interface Step {
  id: string;
  question: string;
  hint: string;
  multi?: boolean;
  options: { value: string; label: string; sub: string; icon: typeof Fuel }[];
}

const STEPS: Step[] = [
  {
    id: "budget",
    question: "Quel est votre budget total ?",
    hint: "Frais compris — carte grise, remise en état… TrustDrive raisonne toujours en coût réel.",
    options: [
      { value: "s", label: "Moins de 10 000 €", sub: "Citadines et compactes matures", icon: Coins },
      { value: "m", label: "10 000 – 18 000 €", sub: "Le cœur du marché de l'occasion", icon: Coins },
      { value: "l", label: "18 000 – 28 000 €", sub: "Récentes, faible kilométrage", icon: Coins },
      { value: "xl", label: "Plus de 28 000 €", sub: "Premium et quasi-neuves", icon: Coins },
    ],
  },
  {
    id: "usage",
    question: "Quel sera son usage principal ?",
    hint: "C'est le critère qui pèse le plus lourd dans nos recommandations.",
    options: [
      { value: "ville", label: "Ville & périphérie", sub: "Trajets courts, stationnement facile", icon: Building2 },
      { value: "mixte", label: "Mixte & famille", sub: "École, courses, week-ends, vacances", icon: Baby },
      { value: "route", label: "Route & autoroute", sub: "Grands trajets réguliers, pro", icon: Compass },
      { value: "loisir", label: "Loisir & plaisir", sub: "Balades, week-ends, passion", icon: Mountain },
    ],
  },
  {
    id: "km",
    question: "Combien de kilomètres par an ?",
    hint: "Le kilométrage annuel décide souvent entre essence, hybride et diesel.",
    options: [
      { value: "low", label: "Moins de 10 000 km", sub: "L'essence ou l'hybride s'imposent", icon: Gauge },
      { value: "mid", label: "10 000 – 20 000 km", sub: "Toutes les motorisations se défendent", icon: Gauge },
      { value: "high", label: "Plus de 20 000 km", sub: "Diesel ou hybride selon les trajets", icon: Gauge },
    ],
  },
  {
    id: "fuel",
    question: "Une préférence de motorisation ?",
    hint: "Nous vérifierons la cohérence avec votre usage — et nous vous le dirons franchement.",
    options: [
      { value: "essence", label: "Essence", sub: "Simple, économique à l'achat", icon: Fuel },
      { value: "hybride", label: "Hybride", sub: "Sobriété en ville, fiabilité", icon: Leaf },
      { value: "diesel", label: "Diesel", sub: "Gros rouleurs uniquement", icon: Briefcase },
      { value: "any", label: "Peu importe", sub: "Recommandez-moi le plus pertinent", icon: BatteryCharging },
    ],
  },
  {
    id: "priorities",
    question: "Vos priorités absolues ?",
    hint: "Choisissez-en jusqu'à trois — elles pondèrent le score de chaque modèle.",
    multi: true,
    options: [
      { value: "fiab", label: "Fiabilité", sub: "Zéro mauvaise surprise", icon: Shield },
      { value: "budget", label: "Coût total", sub: "Achat + entretien + revente", icon: Coins },
      { value: "confort", label: "Confort", sub: "Équipement, insonorisation", icon: Sofa },
      { value: "plaisir", label: "Plaisir", sub: "Conduite, look, caractère", icon: Heart },
      { value: "eco", label: "Écologie", sub: "Consommation, vignette Crit'Air", icon: Leaf },
    ],
  },
];

export function Questionnaire() {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [done, setDone] = useState(false);
  const step = STEPS[stepIndex];
  const current = answers[step?.id] ?? [];

  const select = (value: string) => {
    if (step.multi) {
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : current.length < 3
          ? [...current, value]
          : current;
      setAnswers({ ...answers, [step.id]: next });
    } else {
      setAnswers({ ...answers, [step.id]: [value] });
      setTimeout(() => advance(), 260);
    }
  };

  const advance = () => {
    if (stepIndex < STEPS.length - 1) setStepIndex((i) => i + 1);
    else setDone(true);
  };

  const reset = () => {
    setAnswers({});
    setStepIndex(0);
    setDone(false);
  };

  return (
    <div className="relative min-h-screen pb-24 pt-36">
      <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
        <div className="bg-grid absolute inset-0" />
        <div
          className="absolute left-1/2 top-[-260px] h-[520px] w-[880px] -translate-x-1/2 rounded-full opacity-45 blur-[120px]"
          style={{ background: "radial-gradient(closest-side, rgba(16,185,129,0.22), rgba(167,139,250,0.12) 60%, transparent)" }}
        />
      </div>

      <div className="mx-auto max-w-3xl px-6">
        {!done ? (
          <>
            <div className="text-center">
              <SectionBadge>Trouver ma voiture</SectionBadge>
              <h1 className="text-balance mt-6 text-4xl font-semibold tracking-tight text-metal sm:text-[44px]">
                5 questions, <span className="font-display italic font-normal text-mint-gradient">le bon modèle</span>
              </h1>
            </div>

            {/* Progression */}
            <div className="mt-10 flex items-center gap-2">
              {STEPS.map((s, i) => (
                <div key={s.id} className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/8">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-mint-400 to-sky-400"
                    initial={false}
                    animate={{ width: i < stepIndex ? "100%" : i === stepIndex ? "50%" : "0%" }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              ))}
            </div>
            <p className="mt-2.5 text-right text-[12px] font-medium text-white/40">
              Question {stepIndex + 1} / {STEPS.length}
            </p>

            <AnimatePresence mode="wait">
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.35, ease: [0.21, 0.65, 0.32, 1] }}
                className="mt-8"
              >
                <h2 className="text-2xl font-semibold tracking-tight text-white">{step.question}</h2>
                <p className="mt-1.5 text-[14px] text-white/45">{step.hint}</p>

                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  {step.options.map((opt) => {
                    const selected = current.includes(opt.value);
                    return (
                      <button
                        key={opt.value}
                        onClick={() => select(opt.value)}
                        className={`group flex cursor-pointer items-center gap-4 rounded-2xl p-4.5 text-left transition-all duration-200 ${
                          selected
                            ? "border border-mint-400/50 bg-mint-400/10 shadow-[0_0_28px_-8px_rgba(52,211,153,0.4)]"
                            : "glass hover:-translate-y-0.5 hover:bg-white/8"
                        }`}
                      >
                        <span
                          className={`flex size-11 shrink-0 items-center justify-center rounded-xl border transition-colors ${
                            selected ? "border-mint-400/50 bg-mint-400/15" : "border-white/10 bg-white/5"
                          }`}
                        >
                          <opt.icon className={`size-5 ${selected ? "text-mint-300" : "text-white/60"}`} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className={`block text-[15px] font-semibold ${selected ? "text-mint-200" : "text-white"}`}>
                            {opt.label}
                          </span>
                          <span className="block text-[12.5px] text-white/45">{opt.sub}</span>
                        </span>
                        <span
                          className={`flex size-5.5 shrink-0 items-center justify-center rounded-full border transition-all ${
                            selected ? "border-mint-400 bg-mint-400 text-night-950" : "border-white/20"
                          }`}
                        >
                          {selected && <Check className="size-3.5" strokeWidth={3} />}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-8 flex items-center justify-between">
                  <button
                    onClick={() => stepIndex > 0 && setStepIndex((i) => i - 1)}
                    className={`inline-flex items-center gap-1.5 text-[13.5px] font-medium text-white/45 transition-colors hover:text-white ${
                      stepIndex === 0 ? "pointer-events-none opacity-0" : "cursor-pointer"
                    }`}
                  >
                    <ArrowLeft className="size-4" />
                    Précédent
                  </button>
                  {step.multi && (
                    <PrimaryButton onClick={advance} className={current.length === 0 ? "pointer-events-none opacity-40" : ""}>
                      Voir mes recommandations
                      <Sparkles className="size-4" />
                    </PrimaryButton>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </>
        ) : (
          <Results answers={answers} onReset={reset} />
        )}
      </div>
    </div>
  );
}

function Results({ answers, onReset }: { answers: Record<string, string[]>; onReset: () => void }) {
  const usage = answers.usage?.[0] ?? "mixte";
  const profileKey = usage === "ville" ? "citadin" : usage === "route" ? "routier" : "familial";
  const result = QUESTIONNAIRE_RESULTS.find((r) => r.profile === profileKey) ?? QUESTIONNAIRE_RESULTS[0];
  const profileLabel =
    profileKey === "citadin" ? "Citadin malin" : profileKey === "routier" ? "Grand rouleur" : "Polyvalent familial";

  return (
    <motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <div className="text-center">
        <SectionBadge>Profil détecté : {profileLabel}</SectionBadge>
        <h1 className="text-balance mt-6 text-4xl font-semibold tracking-tight text-metal sm:text-[44px]">
          Vos 3 modèles <span className="font-display italic font-normal text-mint-gradient">recommandés</span>
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-[15px] text-white/55">
          Classés selon vos réponses. Trouvez une annonce d'un de ces modèles, collez-la : TrustDrive fait le reste.
        </p>
      </div>

      <div className="mt-10 space-y-4">
        {result.cars.map((car, i) => (
          <Reveal key={car.name} delay={i * 0.1}>
            <div className={`flex items-center gap-5 rounded-3xl p-6 ${i === 0 ? "ring-gradient glass-strong" : "glass"}`}>
              <div className="relative">
                <svg width="72" height="72" viewBox="0 0 72 72" className="-rotate-90">
                  <circle cx="36" cy="36" r="30" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
                  <circle
                    cx="36"
                    cy="36"
                    r="30"
                    fill="none"
                    stroke={i === 0 ? "#34d399" : "#38bdf8"}
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 30 * (car.match / 100)} ${2 * Math.PI * 30}`}
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-[15px] font-bold text-white tabular-nums">
                  {car.match}%
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="flex flex-wrap items-center gap-2 text-[17px] font-semibold text-white">
                  {car.name}
                  {i === 0 && (
                    <span className="rounded-full bg-gradient-to-r from-mint-300 to-mint-500 px-2.5 py-0.5 text-[10.5px] font-bold text-night-950">
                      TOP MATCH
                    </span>
                  )}
                </p>
                <p className="mt-1 text-[13.5px] leading-relaxed text-white/55">{car.reason}</p>
                <p className="mt-1.5 text-[12.5px] font-medium text-mint-300">Budget occasion conseillé : {car.budget}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <PrimaryButton to="/analyse" size="lg">
          <ScanLine className="size-[18px]" />
          Analyser une annonce de ces modèles
        </PrimaryButton>
        <button
          onClick={onReset}
          className="inline-flex cursor-pointer items-center gap-2 rounded-full glass px-6 py-3.5 text-[15px] font-semibold text-white/80 transition-colors hover:bg-white/10"
        >
          <RotateCcw className="size-4" />
          Recommencer
        </button>
      </div>
      <p className="mt-6 text-center text-[13px] text-white/35">
        <ArrowRight className="mr-1 inline size-3.5" />
        Astuce : lancez une alerte prix sur ces modèles depuis votre dashboard.
      </p>
    </motion.div>
  );
}
