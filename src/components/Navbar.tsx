import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, ScanLine, X } from "lucide-react";
import { Logo } from "./Logo";
import { PrimaryButton } from "./ui";

const LINKS = [
  { to: "/analyse", label: "Analyser" },
  { to: "/comparateur", label: "Comparateur" },
  { to: "/questionnaire", label: "Trouver ma voiture" },
  { to: "/tarifs", label: "Tarifs" },
  { to: "/dashboard", label: "Dashboard" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
      <nav
        className={`flex w-full max-w-6xl items-center justify-between rounded-2xl px-4 py-2.5 transition-all duration-300 ${
          scrolled || open ? "glass-strong" : "border border-transparent"
        }`}
      >
        <Link to="/" aria-label="TrustDrive — accueil">
          <Logo />
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `rounded-full px-3.5 py-2 text-[13.5px] font-medium transition-colors ${
                  isActive ? "bg-white/10 text-white" : "text-white/65 hover:text-white"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <PrimaryButton to="/analyse">
            <ScanLine className="size-4" />
            Analyser une annonce
          </PrimaryButton>
        </div>

        <button
          className="rounded-xl p-2 text-white/80 hover:bg-white/10 lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="glass-strong absolute inset-x-4 top-[72px] rounded-2xl p-3 lg:hidden"
          >
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `block rounded-xl px-4 py-3 text-[15px] font-medium ${
                    isActive ? "bg-white/10 text-white" : "text-white/70"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <div className="p-2 pt-3">
              <PrimaryButton to="/analyse" className="w-full">
                <ScanLine className="size-4" />
                Analyser une annonce
              </PrimaryButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
