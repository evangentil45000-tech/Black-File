import type { Report } from "./types";

const KEY = "trustdrive.reports.v1";

export function loadHistory(): Report[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Report[]) : [];
  } catch {
    return [];
  }
}

export function saveReport(report: Report) {
  const history = loadHistory().filter((r) => r.listing.id !== report.listing.id);
  history.unshift({ ...report, createdAt: new Date().toISOString() });
  try {
    localStorage.setItem(KEY, JSON.stringify(history.slice(0, 20)));
  } catch {
    /* stockage indisponible : l'app reste fonctionnelle */
  }
}

export function findReport(id: string): Report | undefined {
  return loadHistory().find((r) => r.listing.id === id);
}

export function euro(n: number): string {
  return `${n.toLocaleString("fr-FR")} €`;
}

export function kmFmt(n: number): string {
  return `${n.toLocaleString("fr-FR")} km`;
}
