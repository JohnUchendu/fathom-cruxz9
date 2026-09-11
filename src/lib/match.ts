import { LENDERS } from "./lenders";
import {
  INCOME_BANDS,
  NG_STATES,
  type Lender,
  type Profile,
  type RankedLender,
  type Repayment,
  type Urgency,
} from "./types";
import { currency, currencyExact } from "./utils";

function incomeMid(band: Profile["income"]) {
  return INCOME_BANDS.find((b) => b.id === band)?.midpoint ?? 75000;
}

function stateName(code: string) {
  return NG_STATES.find((s) => s.code === code)?.name ?? code;
}

function serves(lender: Lender, state: string) {
  return lender.states === "all" || lender.states.includes(state);
}

function amountSweetSpot(lender: Lender, amount: number) {
  const mid = (lender.minAmount + lender.maxAmount) / 2;
  const span = (lender.maxAmount - lender.minAmount) / 2 || 1;
  const dist = Math.abs(amount - mid) / span;
  return Math.max(0, 100 - dist * 55);
}

function speedFit(lender: Lender, urgency: Urgency) {
  const days = (lender.fundingDays.min + lender.fundingDays.max) / 2;
  if (urgency === "today") {
    if (days <= 0.5) return 0.6 * lender.speed + 45;
    if (days <= 1.5) return 0.45 * lender.speed + 22;
    return lender.speed * 0.3;
  }
  if (urgency === "week") {
    if (days <= 2) return 0.5 * lender.speed + 35;
    return 0.45 * lender.speed + 18;
  }
  if (urgency === "month") {
    return 0.35 * lender.speed + 0.4 * lender.reliability + 15;
  }
  return 0.25 * lender.speed + 0.5 * lender.reliability + 20;
}

function repayFit(lender: Lender, repayment: Repayment) {
  switch (repayment) {
    case "rate":
      return 0.7 * lender.aprQuality + 0.3 * lender.reliability;
    case "monthly":
      return 0.75 * lender.monthlyFlex + 0.25 * lender.aprQuality;
    case "fast":
      return 0.45 * lender.speed + 0.35 * (100 - lender.monthlyFlex * 0.5) + 0.2 * lender.aprQuality;
    default:
      return (
        0.28 * lender.aprQuality +
        0.26 * lender.reliability +
        0.24 * lender.speed +
        0.22 * lender.monthlyFlex
      );
  }
}

function pickTerm(lender: Lender, repayment: Repayment) {
  const terms = [...lender.terms].sort((a, b) => a - b);
  if (repayment === "monthly") return terms[terms.length - 1] ?? 12;
  if (repayment === "fast") return terms[0] ?? 3;
  if (repayment === "rate") return terms[Math.min(1, terms.length - 1)] ?? 6;
  return terms[Math.floor((terms.length - 1) / 2)] ?? 6;
}

function pickApr(lender: Lender, income: number) {
  const t = Math.min(1, Math.max(0, (income - lender.minIncome) / 400000));
  return lender.aprMax - t * (lender.aprMax - lender.aprMin) * 0.72;
}

export function monthlyPayment(principal: number, apr: number, months: number) {
  const r = apr / 100 / 12;
  if (r === 0) return principal / months;
  const pow = (1 + r) ** months;
  return (principal * r * pow) / (pow - 1);
}

function scoreLender(lender: Lender, profile: Profile): number | null {
  if (profile.amount < lender.minAmount || profile.amount > lender.maxAmount) {
    return null;
  }
  if (!serves(lender, profile.state)) return null;
  const income = incomeMid(profile.income);
  if (income < lender.minIncome) return null;

  const total =
    0.3 * repayFit(lender, profile.repayment) +
    0.26 * speedFit(lender, profile.urgency) +
    0.18 * lender.aprQuality +
    0.14 * lender.reliability +
    0.12 * amountSweetSpot(lender, profile.amount);

  return Math.round(Math.min(97, Math.max(42, total)) * 10) / 10;
}

function buildRanked(lender: Lender, score: number, profile: Profile): RankedLender {
  const income = incomeMid(profile.income);
  const termMonths = pickTerm(lender, profile.repayment);
  const estimatedApr = Math.round(pickApr(lender, income) * 10) / 10;
  const estimatedMonthly =
    Math.round(monthlyPayment(profile.amount, estimatedApr, termMonths) * 100) / 100;
  return {
    lender,
    score,
    reason: "",
    termMonths,
    estimatedApr,
    estimatedMonthly,
    rank: 0,
  };
}

export function rankLenders(profile: Profile): RankedLender[] {
  const hard: RankedLender[] = [];
  for (const lender of LENDERS) {
    const s = scoreLender(lender, profile);
    if (s == null) continue;
    hard.push(buildRanked(lender, s, profile));
  }

  let pool = hard;
  if (pool.length < 3) {
    const income = incomeMid(profile.income);
    pool = LENDERS.filter(
      (l) =>
        profile.amount >= l.minAmount &&
        profile.amount <= l.maxAmount &&
        serves(l, profile.state),
    ).map((lender) => {
      const penalty = income < lender.minIncome ? 18 : 0;
      const s = Math.max(40, (scoreLender(lender, { ...profile, income: "800-plus" }) ?? 55) - penalty);
      return buildRanked(lender, s, profile);
    });
  }

  pool.sort((a, b) => b.score - a.score);
  const seen = new Set<number>();
  for (const row of pool) {
    let s = row.score;
    while (seen.has(s)) s = Math.round((s - 0.3) * 10) / 10;
    seen.add(s);
    row.score = s;
  }

  return pool.slice(0, 8).map((row, i) => ({ ...row, rank: i + 1 }));
}

export function fallbackReason(profile: Profile, match: RankedLender): string {
  const { lender } = match;
  const place = stateName(profile.state);
  const amount = currency(profile.amount);
  const fund =
    lender.fundingDays.min === 0
      ? `same day, typically within ${lender.fundingDays.max === 0 ? "minutes" : `${lender.fundingDays.max} day${lender.fundingDays.max > 1 ? "s" : ""}`}`
      : `${lender.fundingDays.min}–${lender.fundingDays.max} days`;

  const repayLine = (() => {
    switch (profile.repayment) {
      case "rate":
        return `Its quoted band starts at ${lender.monthlyRateMin.toFixed(1)}% a month, among the tighter books we scored.`;
      case "monthly":
        return `Terms out to ${Math.max(...lender.terms)} months keep the estimated payment near ${currencyExact(match.estimatedMonthly)}.`;
      case "fast":
        return `A ${match.termMonths}-month path is available, so more of each payment hits principal.`;
      default:
        return `Rate quality and servicing reliability both sit in the upper third of this scan.`;
    }
  })();

  const urgencyLine = (() => {
    if (profile.urgency === "today") {
      return `${lender.name} is set up to disburse ${fund}, which is the constraint on a same-day brief from ${place}.`;
    }
    if (profile.urgency === "week") {
      return `A ${fund} funding window comfortably clears a this-week target from ${place}.`;
    }
    if (profile.urgency === "flexible") {
      return `With timing flexible, ${lender.name} ranked on fit for a ${amount} request rather than on how loud its ads are.`;
    }
    return `${lender.name} covers ${amount} inside a ${fund} funding window.`;
  })();

  return `${urgencyLine} ${repayLine}`;
}

export function attachReasons(
  matches: RankedLender[],
  profile: Profile,
  ai?: { id: string; reason: string }[] | null,
): RankedLender[] {
  const map = new Map((ai ?? []).map((r) => [r.id, r.reason]));
  return matches.map((m) => ({
    ...m,
    reason: map.get(m.lender.id)?.trim() || fallbackReason(profile, m),
  }));
}

export const STORAGE_KEY = "fathom:last-analysis";
