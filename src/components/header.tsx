import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
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

const NAV_LINKS = [
  { to: "/apps" as const, label: "All apps" },
  { to: "/referrals" as const, label: "Referrals" },
  { to: "/kit" as const, label: "Borrowing Kit" },
];

export function Header() {
  const phase = useSession((s) => s.phase);
  const reset = useSession((s) => s.reset);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const showNav = phase !== "results";

  return (
    <header className="no-print sticky top-0 z-30 border-b border-border/70 bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Wordmark />

        {!showNav ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              reset();
              void navigate({ to: "/" });
              setOpen(false);
            }}
          >
            New brief
          </Button>
        ) : (
          <>
            <nav className="hidden items-center gap-1 lg:flex">
              <a
                href="/#method"
                className="inline-flex h-10 items-center px-3 text-sm text-text-soft transition-colors duration-150 hover:text-text"
              >
                Method
              </a>
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="inline-flex h-10 items-center px-3 text-sm text-text-soft transition-colors duration-150 hover:text-text"
                >
                  {link.label}
                </Link>
              ))}
              <Button
                size="sm"
                className="ml-1"
                onClick={() => document.getElementById("brief")?.scrollIntoView({ behavior: "smooth" })}
              >
                Brief the agent
              </Button>
            </nav>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              className="inline-flex size-10 items-center justify-center rounded-full text-text-soft transition-colors duration-150 hover:bg-surface-2 hover:text-text lg:hidden"
            >
              {open ? <X className="size-5" strokeWidth={1.75} /> : <Menu className="size-5" strokeWidth={1.75} />}
            </button>
          </>
        )}
      </div>

      {showNav && open ? (
        <nav className="border-t border-border/70 bg-bg px-5 py-3 lg:hidden">
          <a
            href="/#method"
            onClick={() => setOpen(false)}
            className="block rounded-lg px-3 py-2.5 text-sm text-text-soft transition-colors duration-150 hover:bg-surface-2 hover:text-text"
          >
            Method
          </a>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-sm text-text-soft transition-colors duration-150 hover:bg-surface-2 hover:text-text"
            >
              {link.label}
            </Link>
          ))}
          <Button
            size="sm"
            className="mt-2 w-full"
            onClick={() => {
              setOpen(false);
              document.getElementById("brief")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Brief the agent
          </Button>
        </nav>
      ) : null}
    </header>
  );
}
