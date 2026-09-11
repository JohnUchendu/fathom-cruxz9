import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Clock3, ExternalLink, Percent, Wallet } from "lucide-react";
import { getApplyLink } from "@/lib/lenders";
import { ACTIVE_PRODUCT } from "@/lib/digital-products";
import { useSession } from "@/lib/session";
import { INCOME_BANDS, NG_STATES, REPAYMENT_OPTIONS, URGENCY_OPTIONS } from "@/lib/types";
import { cn, currency, currencyExact } from "@/lib/utils";
import { AppIcon } from "./app-icon";
import { ProductUpsellCard } from "./product-upsell-card";
import { SocialProof } from "./social-proof";

export function ResultsView() {
  const profile = useSession((s) => s.profile);
  const matches = useSession((s) => s.matches);
  const top = matches.slice(0, 4);
  const rest = matches.slice(4, 8);

  if (!profile) return null;

  const place = NG_STATES.find((s) => s.code === profile.state)?.name ?? profile.state;
  const income = INCOME_BANDS.find((b) => b.id === profile.income)?.label;
  const urgency = URGENCY_OPTIONS.find((u) => u.id === profile.urgency)?.label;
  const repay = REPAYMENT_OPTIONS.find((r) => r.id === profile.repayment)?.label;

  return (
    <main className="mx-auto max-w-6xl px-5 py-10 sm:py-14">
      <p className="rise-in text-xs font-medium uppercase tracking-widest text-teal">Shortlist</p>
      <h1 className="rise-in mt-2 max-w-2xl font-display text-4xl font-semibold tracking-tight text-text sm:text-5xl">
        Ranked for {currency(profile.amount)} in {place}.
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-text-soft">
        {income} income · {urgency} · {repay}. Scores are independent — they are not paid
        placement.
      </p>

      <ol className="mt-10 space-y-4">
        {top.map((row, i) => (
          <li key={row.lender.id} className="rise-in" style={{ animationDelay: `${80 + i * 80}ms` }}>
            <article
              className={cn(
                "card-lift rounded-3xl border border-border bg-surface p-5 shadow-card sm:p-7",
                row.rank === 1 && "shadow-glow",
              )}
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                <AppIcon iconUrl={row.lender.iconUrl} letters={row.lender.monogram} seed={row.lender.id} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {row.rank === 1 ? (
                      <span className="rounded-full bg-teal-soft px-2.5 py-0.5 text-xs font-medium text-teal">
                        Top match
                      </span>
                    ) : (
                      <span className="font-mono text-xs text-muted">0{row.rank}</span>
                    )}
                    <span className="text-xs text-muted">{row.lender.kind}</span>
                    <span className="text-xs text-muted">· {row.lender.operator}</span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-baseline justify-between gap-3">
                    <h2 className="font-display text-2xl font-semibold tracking-tight text-text">
                      {row.lender.name}
                    </h2>
                    <p className="font-mono text-sm tabular-nums text-teal">
                      {row.score.toFixed(1)} <span className="text-muted">fit</span>
                    </p>
                  </div>
                  <p className="mt-1 text-sm text-text-soft">{row.lender.summary}</p>

                  <dl className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <Stat
                      icon={Percent}
                      label="Est. monthly rate"
                      value={`${(row.lender.monthlyRateMin).toFixed(1)}–${row.lender.monthlyRateMax.toFixed(1)}%`}
                      hint={`~${row.estimatedApr.toFixed(0)}% APR est.`}
                    />
                    <Stat
                      icon={Wallet}
                      label="Est. monthly"
                      value={currencyExact(row.estimatedMonthly)}
                      hint={`${row.termMonths} months`}
                    />
                    <Stat
                      icon={Clock3}
                      label="Funding window"
                      value={
                        row.lender.fundingDays.max <= 1
                          ? "Same day"
                          : `${row.lender.fundingDays.min}–${row.lender.fundingDays.max} days`
                      }
                      hint={currency(row.lender.minAmount) + "–" + currency(row.lender.maxAmount)}
                    />
                  </dl>

                  <div className="mt-5 rounded-xl bg-bg-soft px-4 py-4">
                    <p className="text-xs font-medium uppercase tracking-widest text-teal">
                      Why it matched
                    </p>
                    <p className="mt-2 font-display text-base leading-relaxed text-text-soft">
                      {row.reason}
                    </p>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center gap-2.5">
                    <a
                      href={getApplyLink(row.lender)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-11 items-center gap-2 rounded-full bg-teal px-5 text-sm font-medium text-teal-ink transition-colors duration-150 hover:bg-teal-strong"
                    >
                      Apply on {row.lender.name}
                      <ExternalLink className="size-3.5" strokeWidth={1.75} />
                    </a>
                    <span className="text-xs text-muted">{row.lender.platform}</span>
                  </div>
                </div>
              </div>
            </article>
          </li>
        ))}
      </ol>

      {rest.length > 0 ? (
        <section className="mt-12">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-text">
            Also scored
          </h2>
          <p className="mt-1 text-sm text-muted">Eligible, but weaker on the signals in this brief.</p>
          <ul className="mt-5 divide-y divide-border rounded-2xl border border-border bg-surface shadow-card">
            {rest.map((row) => (
              <li key={row.lender.id} className="flex items-center gap-3 px-4 py-3.5 sm:px-5">
                <AppIcon iconUrl={row.lender.iconUrl} letters={row.lender.monogram} seed={row.lender.id} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-text">{row.lender.name}</p>
                  <p className="truncate text-xs text-muted">{row.lender.kind}</p>
                </div>
                <p className="font-mono text-xs tabular-nums text-muted">{row.score.toFixed(1)}</p>
                <a
                  href={getApplyLink(row.lender)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium text-teal hover:underline"
                >
                  Apply
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mt-12 rounded-3xl border border-border bg-bg-soft px-6 py-8 sm:px-8">
        <p className="text-xs font-medium uppercase tracking-widest text-teal">Repayment plan</p>
        <h2 className="mt-2 max-w-lg font-display text-3xl font-semibold tracking-tight text-text">
          A free one-page schedule from your top match.
        </h2>
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-text-soft">
          Print or save as PDF. Built from the estimated rate and term on{" "}
          {top[0]?.lender.name ?? "your top match"}.
        </p>
        <Link
          to="/guide"
          className="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-surface-2 px-5 text-sm font-medium text-text transition-colors duration-150 hover:bg-border"
        >
          Open repayment plan
          <ArrowUpRight className="size-4" strokeWidth={1.75} />
        </Link>
      </section>

      <ProductUpsellCard product={ACTIVE_PRODUCT} />

      <SocialProof />
    </main>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: typeof Percent;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-xl bg-bg-soft px-4 py-3">
      <p className="flex items-center gap-1.5 text-xs text-muted">
        <Icon className="size-3.5" strokeWidth={1.75} />
        {label}
      </p>
      <p className="mt-1 text-sm font-medium tabular-nums text-text">{value}</p>
      <p className="mt-0.5 text-xs text-muted">{hint}</p>
    </div>
  );
}
