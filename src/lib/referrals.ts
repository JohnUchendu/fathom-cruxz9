import type { ReferralProgram } from "./types";

/**
 * Referral/affiliate programs for opening an account — a different product
 * than a loan. Every entry here has a confirmed, real public referral
 * program (sourced from the provider's own help center or blog). affiliateUrl
 * is left empty for you to fill in with your own referral code/link once
 * you've signed up for each program — getReferralLink() falls back to the
 * plain signup page until then.
 *
 * Bonus amounts and eligibility rules change often — confirm the current
 * terms in each provider's app before publishing specific numbers.
 */
export const REFERRAL_PROGRAMS: ReferralProgram[] = [
  {
    id: "kuda-referral",
    name: "Kuda",
    monogram: "KU",
    kind: "Digital bank",
    operator: "Kuda Microfinance Bank",
    bonus: "Cash reward per qualified referral (Kuda Premium customers only)",
    requirement:
      "You must be a Kuda customer for 30+ days with at least one transaction, and on Kuda Premium, to earn on referrals. Capped at 2 paid referrals per month.",
    signupUrl: "https://www.kuda.com",
    sourceConfidence: "verified",
  },
  {
    id: "moniepoint-referral",
    name: "Moniepoint Personal Banking",
    monogram: "MP",
    kind: "Digital bank",
    operator: "Moniepoint Microfinance Bank",
    bonus: "Ongoing reward for every transaction your referral makes after signup",
    requirement:
      "Share your referral code/link; you earn when the person you referred signs up and transacts on the Moniepoint Personal Banking app.",
    signupUrl: "https://moniepoint.com",
    sourceConfidence: "verified",
  },
  {
    id: "palmpay-referral",
    name: "PalmPay",
    monogram: "PP",
    kind: "Digital bank",
    operator: "PalmPay (Transsnet Financial)",
    bonus: "Referral bonuses and reward-program credit",
    requirement:
      "Share your PalmPay referral link/code; the referred user typically needs to complete signup and an initial transaction.",
    signupUrl: "https://www.palmpay.com",
    sourceConfidence: "verified",
  },
  {
    id: "carbon-referral",
    name: "Carbon",
    monogram: "CB",
    kind: "Digital bank",
    operator: "Carbon Microfinance Bank",
    bonus: "Rewards such as free cash, larger loan limits, or lower rates for referrals",
    requirement:
      "Carbon's in-app rewards program credits you for referring friends alongside on-time repayment and regular transactions.",
    signupUrl: "https://www.getcarbon.co",
    sourceConfidence: "verified",
  },
  {
    id: "opay-referral",
    name: "OPay",
    monogram: "OP",
    kind: "Digital bank",
    operator: "OPay Digital Services (Opera)",
    bonus: "Referral bonus program (terms vary by promotion)",
    requirement:
      "OPay runs referral promotions from time to time; check the current terms inside the app before counting on a specific amount.",
    signupUrl: "https://opayweb.com",
    sourceConfidence: "aggregated",
  },
  {
    id: "fairmoney-referral",
    name: "FairMoney",
    monogram: "FM",
    kind: "Digital bank",
    operator: "FairMoney Microfinance Bank",
    bonus: "Referral rewards program (terms vary by promotion)",
    requirement:
      "FairMoney has run referral bonus promotions historically; confirm current terms in-app before relying on a specific figure.",
    signupUrl: "https://fairmoney.ng",
    sourceConfidence: "aggregated",
  },
];

export function getReferralLink(program: ReferralProgram): string {
  return program.affiliateUrl || program.signupUrl;
}
