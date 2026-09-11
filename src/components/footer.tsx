import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="no-print border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-display text-lg font-semibold tracking-tight text-text">Fathom</p>
          <p className="mt-1 max-w-md text-sm leading-relaxed text-muted">
            An independent research tool for comparing Nigerian loan apps. Fathom is not a
            lender, broker, or credit provider — it links out to CBN-licensed operators.
            Rankings are scored from each provider's published ranges, not paid placement.
          </p>
          <p className="mt-2 max-w-md text-xs leading-relaxed text-muted">
            Some links on this site are affiliate or referral links. Fathom may earn a
            commission if you apply through them, at no extra cost to you — this never affects
            how an app is scored or ranked.
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted">
          <Link to="/apps" className="hover:text-text-soft">
            All apps
          </Link>
          <Link to="/referrals" className="hover:text-text-soft">
            Referrals
          </Link>
          <Link to="/playbook" className="hover:text-text-soft">
            Repayment guide
          </Link>
          <span>Educational matching · Not a credit offer</span>
        </div>
      </div>
    </footer>
  );
}
