const TIPS = [
  {
    title: "Read the monthly rate, not just the headline",
    body: "A \"low\" 4% monthly rate compounds to a much higher annual cost than a 25% APR sounds like. Compare the total repayment figure each app shows before you accept, not the percentage on the ad.",
  },
  {
    title: "One app at a time builds your limit",
    body: "Repaying early or on schedule with a single app is what unlocks bigger amounts and lower rates over time. Running several loan apps at once tends to shrink what each one will offer you.",
  },
  {
    title: "Confirm who's actually lending",
    body: "Every app in this shortlist operates under a Central Bank of Nigeria–licensed microfinance bank. Check the lender-of-record named in your offer screen before you accept anything.",
  },
  {
    title: "Short tenure, high urgency costs more",
    body: "Same-day and sub-30-day loans usually carry the highest effective rate in an app's range. If your timing has any flexibility, a slightly longer wait often unlocks a meaningfully cheaper offer.",
  },
];

export function SocialProof() {
  return (
    <section className="mt-16 pb-6">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-teal">Before you accept</p>
      <h2 className="mt-2 max-w-xl font-display text-3xl font-semibold tracking-tight text-text">
        Four things worth checking on any offer.
      </h2>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {TIPS.map((t) => (
          <li key={t.title} className="rounded-2xl border border-border bg-surface p-6 shadow-card">
            <h3 className="font-display text-base font-semibold tracking-tight text-text">
              {t.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-text-soft">{t.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
