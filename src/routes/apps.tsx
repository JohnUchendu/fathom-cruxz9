import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink, Star } from "lucide-react";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { AppIcon } from "@/components/app-icon";
import { getApplyLink, LENDERS } from "@/lib/lenders";
import { currency } from "@/lib/utils";

export const Route = createFileRoute("/apps")({ component: AppsPage });

function AppsPage() {
  return (
    <div className="grain min-h-dvh text-text">
      <Header />
      <main className="mx-auto max-w-5xl px-5 py-12 sm:py-16">
        <p className="text-xs font-medium uppercase tracking-widest text-teal">Directory</p>
        <h1 className="mt-2 max-w-2xl font-display text-4xl font-semibold tracking-tight text-text sm:text-5xl">
          Every loan app in the scan.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-text-soft">
          {LENDERS.length} Nigerian loan apps, digital banks, commercial banks, and development
          lenders. Want a ranked shortlist against your own profile instead?{" "}
          <a href="/#brief" className="text-teal hover:underline">
            Brief the agent
          </a>
          .
        </p>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {LENDERS.map((l) => (
            <li
              key={l.id}
              className="card-lift rounded-2xl border border-border bg-surface p-5 shadow-card"
            >
              <div className="flex items-start gap-3">
                <AppIcon iconUrl={l.iconUrl} letters={l.monogram} seed={l.id} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h2 className="font-display text-lg font-semibold tracking-tight text-text">
                      {l.name}
                    </h2>
                    {l.playRating ? (
                      <span className="flex items-center gap-1 text-xs text-text-soft">
                        <Star className="size-3.5 text-teal" strokeWidth={1.5} fill="currentColor" />
                        {l.playRating.toFixed(1)}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-0.5 text-xs text-muted">
                    {l.kind} · {l.operator}
                  </p>
                  <p className="mt-2 text-sm text-text-soft">{l.summary}</p>
                  <p className="mt-3 text-xs text-muted">
                    {currency(l.minAmount)}–{currency(l.maxAmount)} · {l.platform}
                  </p>

                  <a
                    href={getApplyLink(l)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex h-10 items-center gap-1.5 rounded-full bg-teal px-4 text-xs font-medium text-teal-ink transition-colors duration-150 hover:bg-teal-strong"
                  >
                    Apply
                    <ExternalLink className="size-3" strokeWidth={1.75} />
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-10 text-xs leading-relaxed text-muted">
          Ranges and ratings are indicative and drift over time — confirm current terms and
          store listings directly before applying. Fathom is not a lender.
        </p>
      </main>
      <Footer />
    </div>
  );
}
