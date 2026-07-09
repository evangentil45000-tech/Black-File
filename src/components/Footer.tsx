import { Link } from "react-router-dom";
import { Logo } from "./Logo";

const COLS = [
  {
    title: "Produit",
    links: [
      { label: "Analyser une annonce", to: "/analyse" },
      { label: "Comparateur", to: "/comparateur" },
      { label: "Trouver ma voiture", to: "/questionnaire" },
      { label: "Tarifs", to: "/tarifs" },
    ],
  },
  {
    title: "Compte",
    links: [
      { label: "Dashboard", to: "/dashboard" },
      { label: "Mes analyses", to: "/dashboard" },
      { label: "Alertes prix", to: "/dashboard" },
    ],
  },
  {
    title: "Ressources",
    links: [
      { label: "Guide de l'occasion", to: "/" },
      { label: "Arnaques connues", to: "/" },
      { label: "Frais par région", to: "/" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative border-t border-white/8 bg-night-900/60">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/55">
              L'assistant d'achat qui inspecte chaque annonce auto avant que vous ne signiez. Verdict clair : acheter,
              négocier ou éviter.
            </p>
            <p className="mt-5 inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs text-white/60">
              <span className="size-1.5 rounded-full bg-mint-400 animate-pulse-dot" />
              Analyse v2 — en ligne
            </p>
          </div>
          {COLS.map((col) => (
            <div key={col.title}>
              <p className="text-[13px] font-semibold uppercase tracking-wider text-white/40">{col.title}</p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-sm text-white/65 transition-colors hover:text-mint-300">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-white/8 pt-6 text-[13px] text-white/40 sm:flex-row sm:items-center">
          <p>© 2026 TrustDrive. Analysez avant de signer.</p>
          <p className="flex gap-5">
            <span className="cursor-pointer hover:text-white/70">Mentions légales</span>
            <span className="cursor-pointer hover:text-white/70">Confidentialité</span>
            <span className="cursor-pointer hover:text-white/70">CGU</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
