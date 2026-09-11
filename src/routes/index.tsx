import { createFileRoute } from "@tanstack/react-router";
import { ArrowDown } from "lucide-react";
import { AgentOverlay } from "@/components/agent-overlay";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { HowItWorks } from "@/components/how-it-works";
import { LogoMarquee } from "@/components/logo-marquee";
import { MatchForm } from "@/components/match-form";
import { NetworkBackground } from "@/components/network-background";
import { RatingsCarousel } from "@/components/ratings-carousel";
import { ResultsView } from "@/components/results-view";
import { LENDERS } from "@/lib/lenders";
import { useSession } from "@/lib/session";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const phase = useSession((s) => s.phase);

  return (
    <div className="grain min-h-dvh text-text">
      <Header />
      {phase === "results" ? (
        <ResultsView />
      ) : (
        <>
          <Hero />
          <BriefSection />
          <LogoMarquee />
          <HowItWorks />
          <RatingsCarousel />
        </>
      )}
      <Footer />
      {phase === "analyzing" ? <AgentOverlay /> : null}
    </div>
  );
}

// Deliberately just the statement + the black hole. Kept short on purpose —
// a tall, content-heavy section dilutes the background effect (it gets
// scaled to fit and ends up as a thin band buried behind other content,
// especially once things stack on mobile). Short section, full-strength
// visual, clear CTA down to the form.
function Hero() {
  return (
    <section className="relative flex min-h-[560px] items-center overflow-hidden sm:min-h-[620px]">
      <NetworkBackground />
      <div className="relative mx-auto w-full max-w-3xl px-5 py-16 text-center sm:py-20">
        <p className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-xs text-muted">
          <span>{LENDERS.length} loan apps compared</span>
          <span className="text-border-strong">·</span>
          <span>₦2,000–₦6M range covered</span>
          <span className="text-border-strong">·</span>
          <span>No BVN required to scan</span>
        </p>
        <h1 className="mx-auto mt-5 max-w-2xl font-display text-4xl font-semibold tracking-tight text-text sm:text-6xl">
          Find the loan app that actually fits, before you install one.
        </h1>
        <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-text-soft">
          Fathom scores Nigerian loan apps against your amount, income, timing, and how you
          want to repay — then returns a ranked shortlist with reasons and a direct apply
          link, not an ad slot.
        </p>

        <div className="mt-8 flex flex-col items-center gap-4">
          <button
            type="button"
            onClick={() => document.getElementById("brief")?.scrollIntoView({ behavior: "smooth" })}
            className="inline-flex h-12 items-center gap-2 rounded-full bg-teal px-6 text-sm font-medium text-teal-ink transition-colors duration-150 hover:bg-teal-strong"
          >
            Brief the agent
            <ArrowDown className="size-4" strokeWidth={1.75} />
          </button>

          <dl className="mt-2 flex gap-8">
            <div>
              <dt className="text-xs text-muted">Apps in the scan</dt>
              <dd className="mt-1 font-display text-xl font-semibold tabular-nums text-text">
                {LENDERS.length}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Full scan</dt>
              <dd className="mt-1 font-display text-xl font-semibold text-text">~20s</dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Placement sold</dt>
              <dd className="mt-1 font-display text-xl font-semibold text-text">None</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}

function BriefSection() {
  return (
    <section className="border-t border-border bg-bg-soft">
      <div className="mx-auto max-w-xl px-5 py-14 sm:py-16">
        <MatchForm />
      </div>
    </section>
  );
}
