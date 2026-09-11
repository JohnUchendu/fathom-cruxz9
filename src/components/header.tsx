import { Link, useNavigate } from "@tanstack/react-router";
import { useSession } from "@/lib/session";
import { Button } from "./ui/button";

export function Wordmark() {
  return (
    <Link to="/" className="group flex items-center gap-2">
      <span
        className="grid size-6 shrink-0 grid-cols-2 gap-0.5 overflow-hidden rounded-[6px]"
        aria-hidden
      >
        <span className="bg-text-soft/70" />
        <span className="bg-teal" />
        <span className="bg-teal" />
        <span className="bg-text-soft/30" />
      </span>
      <span className="font-display text-lg font-semibold tracking-tight text-text">Fathom</span>
    </Link>
  );
}

export function Header() {
  const phase = useSession((s) => s.phase);
  const reset = useSession((s) => s.reset);
  const navigate = useNavigate();

  return (
    <header className="no-print sticky top-0 z-30 border-b border-border/70 bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Wordmark />
        <nav className="flex items-center gap-2 sm:gap-3">
          {phase === "results" ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                reset();
                void navigate({ to: "/" });
              }}
            >
              New brief
            </Button>
          ) : (
            <>
              <a
                href="/#method"
                className="hidden h-10 items-center px-3 text-sm text-text-soft transition-colors duration-150 hover:text-text sm:inline-flex"
              >
                Method
              </a>
              <Link
                to="/apps"
                className="hidden h-10 items-center px-3 text-sm text-text-soft transition-colors duration-150 hover:text-text sm:inline-flex"
              >
                All apps
              </Link>
              <Link
                to="/referrals"
                className="hidden h-10 items-center px-3 text-sm text-text-soft transition-colors duration-150 hover:text-text lg:inline-flex"
              >
                Referrals
              </Link>
              <Link to="/playbook" className="hidden h-10 items-center px-3 text-sm text-text-soft transition-colors duration-150 hover:text-text sm:inline-flex">
                Guide
              </Link>
              <Button
                size="sm"
                onClick={() => document.getElementById("brief")?.scrollIntoView({ behavior: "smooth" })}
              >
                Brief the agent
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
