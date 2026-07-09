export type Verdict = "buy" | "negotiate" | "avoid";

export interface Listing {
  id: string;
  title: string;
  make: string;
  model: string;
  year: number;
  km: number;
  fuel: string;
  gearbox: string;
  price: number;
  marketPrice: number;
  location: string;
  sellerType: "Particulier" | "Professionnel";
  power: string;
  source: string;
  postedDays: number;
  owners: number;
  accent: string; // couleur de la vignette véhicule
}

export interface RiskItem {
  severity: "high" | "medium" | "low";
  title: string;
  detail: string;
}

export interface FeeItem {
  label: string;
  amount: number;
  mandatory: boolean;
  note: string;
}

export interface MarketSample {
  label: string;
  price: number;
  km: number;
  isCurrent?: boolean;
}

export interface Report {
  listing: Listing;
  score: number;
  verdict: Verdict;
  summary: string;
  risks: RiskItem[];
  fees: FeeItem[];
  negotiation: {
    target: number;
    savings: number;
    args: string[];
  };
  checklist: string[];
  market: MarketSample[];
  subscores: { label: string; value: number }[];
  createdAt?: string;
}
