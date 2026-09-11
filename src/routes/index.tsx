import { createFileRoute } from "@tanstack/react-router";
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

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <NetworkBackground />
      <div className="relative mx-auto grid max-w-6xl items-start gap-10 px-5 py-10 lg:grid-cols-[1fr_minmax(0,32rem)] lg:gap-14 lg:py-14">
        <div className="lg:sticky lg:top-24 lg:pt-4">
          <p className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-muted">
            <span>{LENDERS.length} loan apps compared</span>
            <span className="text-border-strong">·</span>
            <span>₦2,000–₦6M range covered</span>
            <span className="text-border-strong">·</span>
            <span>No BVN required to scan</span>
          </p>
          <h1 className="mt-4 max-w-lg font-display text-4xl font-semibold tracking-tight text-text sm:text-5xl">
            Find the loan app that actually fits, before you install one.
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-text-soft">
            Fathom scores Nigerian loan apps against your amount, income, timing, and how you
            want to repay — then returns a ranked shortlist with reasons and a direct apply
            link, not an ad slot.
          </p>
          <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-border pt-5">
            <div>
              <dt className="text-xs text-muted">Apps in the scan</dt>
              <dd className="mt-1 font-display text-2xl font-semibold tabular-nums text-text">
                {LENDERS.length}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Typical scan</dt>
              <dd className="mt-1 font-display text-2xl font-semibold text-text">5s</dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Placement sold</dt>
              <dd className="mt-1 font-display text-2xl font-semibold text-text">None</dd>
            </div>
          </dl>
          <ul className="mt-8 hidden divide-y divide-border border-t border-border lg:block">
            {LENDERS.slice(0, 5).map((l) => (
              <li key={l.id} className="flex items-baseline justify-between gap-4 py-2.5">
                <span className="text-sm text-text">{l.name}</span>
                <span className="text-xs text-muted">{l.kind}</span>
              </li>
            ))}
            <li className="py-2.5 text-xs text-muted">
              {LENDERS.length - 5} more apps in the scan
            </li>
          </ul>
        </div>
        <MatchForm />
      </div>
    </section>
  );
}
