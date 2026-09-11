import { LENDERS } from "@/lib/lenders";

const STEPS = [
  {
    n: "01",
    title: "Brief",
    body: "Amount, income band, state, timing, and how you want to repay. Under a minute. No account, no BVN.",
  },
  {
    n: "02",
    title: "Research",
    body: `The agent reads ${LENDERS.length} loan-app terms, scores fit live, and drops options that miss your constraints.`,
  },
  {
    n: "03",
    title: "Decide",
    body: "A ranked shortlist with reasons, estimated terms, a direct apply link, and a one-page repayment plan.",
  },
];

export function HowItWorks() {
  return (
    <section id="method" className="border-t border-border">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-teal">Method</p>
        <h2 className="mt-2 max-w-xl font-display text-3xl font-semibold tracking-tight text-text sm:text-4xl">
          Built like a research desk, not another lending marketplace.
        </h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {STEPS.map((step) => (
            <article
              key={step.n}
              className="card-lift rounded-2xl border border-border bg-surface p-6 shadow-card"
            >
              <p className="font-mono text-xs tracking-widest text-muted">{step.n}</p>
              <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight text-text">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-text-soft">{step.body}</p>
            </article>
          ))}
        </div>
        <p className="mt-10 max-w-2xl text-sm leading-relaxed text-muted">
          Scores weight repayment fit, funding speed, rate quality, servicing reliability, and
          whether your amount sits in each app's core band. Placement is never sold — the same
          scoring logic runs regardless of which app you end up choosing.
        </p>
      </div>
    </section>
  );
}
