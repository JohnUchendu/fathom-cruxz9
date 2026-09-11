import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink, Gift } from "lucide-react";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Monogram } from "@/components/monogram";
import { getReferralLink, REFERRAL_PROGRAMS } from "@/lib/referrals";

export const Route = createFileRoute("/referrals")({ component: ReferralsPage });

function ReferralsPage() {
  return (
    <div className="grain min-h-dvh text-text">
      <Header />
      <main className="mx-auto max-w-4xl px-5 py-12 sm:py-16">
        <p className="text-xs font-medium uppercase tracking-widest text-teal">
          Beyond loans
        </p>
        <h1 className="mt-2 max-w-2xl font-display text-4xl font-semibold tracking-tight text-text sm:text-5xl">
          Open an account, earn together.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-text-soft">
          Several digital banks pay a referral bonus when someone opens an account through
          your link and starts using it — separate from anything to do with loans. Confirmed,
          named programs below; terms and payout amounts change often, so check the current
          numbers in each app before relying on a figure.
        </p>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {REFERRAL_PROGRAMS.map((p) => (
            <li
              key={p.id}
              className="card-lift rounded-2xl border border-border bg-surface p-5 shadow-card"
            >
              <div className="flex items-start gap-3">
                <Monogram letters={p.monogram} seed={p.id} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="font-display text-lg font-semibold tracking-tight text-text">
                      {p.name}
                    </h2>
                    {p.sourceConfidence === "aggregated" ? (
                      <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted">
                        Verify terms
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-0.5 text-xs text-muted">{p.operator}</p>
                  <p className="mt-3 flex items-start gap-1.5 text-sm text-text">
                    <Gift className="mt-0.5 size-3.5 shrink-0 text-teal" strokeWidth={1.75} />
                    {p.bonus}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-muted">{p.requirement}</p>

                  <a
                    href={getReferralLink(p)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex h-10 items-center gap-1.5 rounded-full bg-teal px-4 text-xs font-medium text-teal-ink transition-colors duration-150 hover:bg-teal-strong"
                  >
                    Open account
                    <ExternalLink className="size-3" strokeWidth={1.75} />
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-10 text-xs leading-relaxed text-muted">
          These are account-opening referral programs, not loan offers — opening an account
          doesn't guarantee loan eligibility with that provider. Fathom is not a bank.
        </p>
      </main>
      <Footer />
    </div>
  );
}
