export type IncomeBand =
  | "under-50"
  | "50-100"
  | "100-200"
  | "200-400"
  | "400-800"
  | "800-plus";

export type Urgency = "today" | "week" | "month" | "flexible";

export type Repayment = "monthly" | "fast" | "rate" | "balanced";

export interface Profile {
  amount: number;
  income: IncomeBand;
  state: string;
  urgency: Urgency;
  repayment: Repayment;
}

export type LenderKind =
  | "Loan app"
  | "Digital bank"
  | "Microfinance bank"
  | "Commercial bank"
  | "Development finance";

export interface Lender {
  id: string;
  name: string;
  monogram: string;
  kind: LenderKind;
  operator: string;
  summary: string;
  minAmount: number;
  maxAmount: number;
  minIncome: number;
  aprMin: number;
  aprMax: number;
  monthlyRateMin: number;
  monthlyRateMax: number;
  terms: number[];
  fundingDays: { min: number; max: number };
  states: "all" | string[];
  applyUrl: string;
  /**
   * Affiliate/referral link, if you have one from this provider's partner
   * program. Leave undefined until you do — getApplyLink() falls back to
   * applyUrl automatically, so nothing breaks either way.
   */
  affiliateUrl?: string;
  googlePlayUrl?: string;
  appStoreUrl?: string;
  /** Real Play Store icon URL, only set where directly verified. */
  iconUrl?: string;
  /** How confident the figures on this entry are. */
  sourceConfidence: "verified" | "aggregated";
  platform: string;
  /** Google Play star rating, e.g. 4.5. Sourced from the live listing. */
  playRating?: number;
  /** Display string for review count, e.g. "920K". */
  playReviews?: string;
  /** Display string for install count, e.g. "10M+". */
  playInstalls?: string;
  speed: number;
  reliability: number;
  approvalEase: number;
  monthlyFlex: number;
  aprQuality: number;
}

export interface RankedLender {
  lender: Lender;
  score: number;
  reason: string;
  termMonths: number;
  estimatedApr: number;
  estimatedMonthly: number;
  rank: number;
}

export interface ReferralProgram {
  id: string;
  name: string;
  monogram: string;
  kind: LenderKind;
  operator: string;
  bonus: string;
  requirement: string;
  /** Your own referral link once you have one. Falls back to signupUrl. */
  affiliateUrl?: string;
  signupUrl: string;
  iconUrl?: string;
  sourceConfidence: "verified" | "aggregated";
}

export const INCOME_BANDS: {
  id: IncomeBand;
  label: string;
  midpoint: number;
}[] = [
  { id: "under-50", label: "Under ₦50k/mo", midpoint: 40000 },
  { id: "50-100", label: "₦50k–100k/mo", midpoint: 75000 },
  { id: "100-200", label: "₦100k–200k/mo", midpoint: 150000 },
  { id: "200-400", label: "₦200k–400k/mo", midpoint: 300000 },
  { id: "400-800", label: "₦400k–800k/mo", midpoint: 600000 },
  { id: "800-plus", label: "₦800k+/mo", midpoint: 1000000 },
];

export const URGENCY_OPTIONS: { id: Urgency; label: string; hint: string }[] = [
  { id: "today", label: "Today", hint: "Minutes, not hours" },
  { id: "week", label: "This week", hint: "A day or two is fine" },
  { id: "month", label: "This month", hint: "Room to compare" },
  { id: "flexible", label: "Flexible", hint: "Best fit wins" },
];

export const REPAYMENT_OPTIONS: {
  id: Repayment;
  label: string;
  hint: string;
}[] = [
  { id: "monthly", label: "Lowest monthly", hint: "Stretch the term" },
  { id: "fast", label: "Fastest payoff", hint: "Shorter term" },
  { id: "rate", label: "Lowest rate", hint: "Rate first" },
  { id: "balanced", label: "Balanced", hint: "Rate and speed" },
];

export const NG_STATES: { code: string; name: string }[] = [
  { code: "AB", name: "Abia" },
  { code: "AD", name: "Adamawa" },
  { code: "AK", name: "Akwa Ibom" },
  { code: "AN", name: "Anambra" },
  { code: "BA", name: "Bauchi" },
  { code: "BY", name: "Bayelsa" },
  { code: "BE", name: "Benue" },
  { code: "BO", name: "Borno" },
  { code: "CR", name: "Cross River" },
  { code: "DE", name: "Delta" },
  { code: "EB", name: "Ebonyi" },
  { code: "ED", name: "Edo" },
  { code: "EK", name: "Ekiti" },
  { code: "EN", name: "Enugu" },
  { code: "FC", name: "FCT (Abuja)" },
  { code: "GO", name: "Gombe" },
  { code: "IM", name: "Imo" },
  { code: "JI", name: "Jigawa" },
  { code: "KD", name: "Kaduna" },
  { code: "KN", name: "Kano" },
  { code: "KT", name: "Katsina" },
  { code: "KE", name: "Kebbi" },
  { code: "KO", name: "Kogi" },
  { code: "KW", name: "Kwara" },
  { code: "LA", name: "Lagos" },
  { code: "NA", name: "Nasarawa" },
  { code: "NI", name: "Niger" },
  { code: "OG", name: "Ogun" },
  { code: "ON", name: "Ondo" },
  { code: "OS", name: "Osun" },
  { code: "OY", name: "Oyo" },
  { code: "PL", name: "Plateau" },
  { code: "RI", name: "Rivers" },
  { code: "SO", name: "Sokoto" },
  { code: "TA", name: "Taraba" },
  { code: "YO", name: "Yobe" },
  { code: "ZA", name: "Zamfara" },
];
