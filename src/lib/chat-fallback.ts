import { BUSINESS_EMAIL } from "./chat-assistant";

const BUSINESS_WORDS = [
  "advertis", "sponsor", "partner", "business", "traffic", "media kit",
  "collab", "promote", "marketing", "invest", "ads", "campaign",
];

const FREE_WORDS = ["free", "cost", "price", "pay", "charge"];
const HOW_WORDS = ["how does", "how it work", "how it works", "what is fathom", "what does fathom"];
const LOAN_WORDS = ["loan app", "apply", "which app", "recommend", "best loan"];
const KIT_WORDS = ["borrowing kit", "worksheet", "checklist", "playbook", "guide pdf"];
const HELP_WORDS = ["result", "shortlist", "didn't work", "error", "stuck", "not working", "help"];

function includesAny(text: string, words: string[]) {
  return words.some((w) => text.includes(w));
}

export function fallbackReply(userText: string): string {
  const t = userText.toLowerCase();

  if (includesAny(t, BUSINESS_WORDS)) {
    return `For advertising, partnerships, or any business inquiry, email ${BUSINESS_EMAIL} — the team will follow up with you there.`;
  }
  if (includesAny(t, KIT_WORDS)) {
    return "The Fathom Borrowing Kit (₦3,000) is a guide plus four worksheets — comparison, affordability, debt reset, and a pre-loan checklist. It's offered after you get your results, at /kit.";
  }
  if (includesAny(t, FREE_WORDS)) {
    return "Fathom's matching tool is completely free — no account, no BVN. The only paid thing is the optional Borrowing Kit after your results.";
  }
  if (includesAny(t, HOW_WORDS)) {
    return "Tell Fathom your amount, income band, state, timing, and repayment preference, and it scores every loan app in the directory against that and ranks a shortlist with real apply links.";
  }
  if (includesAny(t, LOAN_WORDS)) {
    return "Run a brief on the homepage for a shortlist ranked to your situation, or browse every app directly at /apps.";
  }
  if (includesAny(t, HELP_WORDS)) {
    return `Try refreshing and running your brief again. If something's still off, email ${BUSINESS_EMAIL} with what happened and we'll take a look.`;
  }
  return `I can help with how Fathom works, the Borrowing Kit, or finding a loan app. For anything else — including business or partnership inquiries — email ${BUSINESS_EMAIL}.`;
}
