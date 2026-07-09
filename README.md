# TrustDrive — Analysez avant de signer

Assistant d'achat automobile : collez une annonce, TrustDrive identifie le véhicule, détecte
les risques et les frais cachés, compare au marché et rend un verdict clair —
**acheter, négocier ou éviter**.

## Démarrer

```bash
npm install
npm run dev       # développement
npm run build     # build de production (tsc + vite) → dist/
npm run preview   # sert le build localement
```

## Stack

- **Vite + React 19 + TypeScript**
- **Tailwind CSS v4** — design system dans `src/index.css` (thème "nuit asphalte", accent menthe)
- **Framer Motion** — animations, révélations au scroll, expérience de scan
- **React Router (HashRouter)** — compatible avec tout hébergement statique
- **Fonts auto-hébergées** — Inter Variable + Instrument Serif (aucune requête externe)

## Pages

| Route | Contenu |
| --- | --- |
| `/` | Homepage : hero animé, mockup produit, bento features, verdicts, témoignages, tarifs |
| `/analyse` | Collage d'annonce avec détection de champs en direct + scan animé en 6 étapes |
| `/rapport/:id` | Rapport premium : score, risques, frais cachés, marché, plan de négociation, checklist |
| `/comparateur` | 3 annonces côte à côte, radar 5 axes, meilleur choix désigné |
| `/questionnaire` | 5 questions → 3 modèles recommandés avec % de match |
| `/tarifs` | 3 offres, toggle mensuel/annuel, FAQ |
| `/dashboard` | Vue d'ensemble : stats, analyses récentes, alertes prix, veille marché |

Le moteur d'analyse (`src/lib/engine.ts`) parse réellement le texte collé (marque, prix,
kilométrage, année, carburant) et génère un rapport déterministe ; trois annonces d'exemple
complètes sont fournies. L'historique des analyses est conservé en `localStorage`.

> L'ancien site « Black File » est archivé dans `legacy/`.
