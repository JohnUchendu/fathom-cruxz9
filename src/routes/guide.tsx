import { createFileRoute, Link } from "@tanstack/react-router";
import { Printer } from "lucide-react";
import { useEffect, useState } from "react";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { monthlyPayment, STORAGE_KEY } from "@/lib/match";
import type { Profile, RankedLender } from "@/lib/types";
import { NG_STATES } from "@/lib/types";
import { currency, currencyExact } from "@/lib/utils";

export const Route = createFileRoute("/guide")({ component: GuidePage });

type Saved = {
  profile: Profile;
  matches: RankedLender[];
};

function GuidePage() {
  const [saved, setSaved] = useState<Saved | null | undefined>(undefined);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      setSaved(raw ? (JSON.parse(raw) as Saved) : null);
    } catch {
      setSaved(null);
    }
  }, []);

  if (saved === undefined) {
    return (
      <div className="grain min-h-dvh">
        <Header />
        <main className="mx-auto max-w-3xl px-5 py-16">
          <p className="text-sm text-muted">Loading plan…</p>
        </main>
      </div>
    );
  }

  if (!saved || saved.matches.length === 0) {
    return (
      <div className="grain min-h-dvh">
        <Header />
        <main className="mx-auto max-w-3xl px-5 py-16">
          <h1 className="font-display text-4xl font-semibold tracking-tight text-text">
            No brief on file
          </h1>
          <p className="mt-3 text-text-soft">Run an analysis first, then open the repayment plan.</p>
          <Link
            to="/"
            className="mt-6 inline-flex h-11 items-center rounded-full bg-teal px-4 text-sm font-medium text-teal-ink"
          >
            Brief the agent
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const top = saved.matches[0];
  const { profile } = saved;
  const place = NG_STATES.find((s) => s.code === profile.state)?.name ?? profile.state;
  const rows = buildSchedule(profile.amount, top.estimatedApr, top.termMonths);
  const totalInterest = rows.reduce((sum, r) => sum + r.interest, 0);
  const payoff = new Date();
  payoff.setMonth(payoff.getMonth() + top.termMonths);

  return (
    <div className="grain min-h-dvh text-text">
      <Header />
      <main className="mx-auto max-w-3xl px-5 py-12">
        <p className="text-xs font-medium uppercase tracking-widest text-teal">Repayment plan</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-text">
          {currency(profile.amount)} over {top.termMonths} months
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-text-soft">
          Modeled on {top.lender.name} at an estimated {top.estimatedApr.toFixed(0)}% APR for a
          brief in {place}. Illustrative only — the app's actual offer will differ.
        </p>

        <div className="no-print mt-6">
          <Button onClick={() => window.print()}>
            <Printer className="size-4" strokeWidth={1.75} />
            Print or save as PDF
          </Button>
        </div>

        <dl className="mt-8 grid grid-cols-2 gap-4 rounded-2xl border border-border bg-surface p-5 shadow-card sm:grid-cols-4">
          <Mini label="Monthly" value={currencyExact(top.estimatedMonthly)} />
          <Mini label="Interest" value={currencyExact(totalInterest)} />
          <Mini label="Total repaid" value={currencyExact(profile.amount + totalInterest)} />
          <Mini
            label="Payoff"
            value={payoff.toLocaleDateString("en-NG", { month: "short", year: "numeric" })}
          />
        </dl>

        <div className="mt-8 overflow-x-auto rounded-2xl border border-border bg-surface shadow-card">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border text-xs uppercase tracking-widest text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Mo</th>
                <th className="px-4 py-3 font-medium">Payment</th>
                <th className="px-4 py-3 font-medium">Principal</th>
                <th className="px-4 py-3 font-medium">Interest</th>
                <th className="px-4 py-3 font-medium">Balance</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.month} className="border-b border-border/70 last:border-0">
                  <td className="px-4 py-2.5 font-mono tabular-nums text-muted">{row.month}</td>
                  <td className="px-4 py-2.5 tabular-nums text-text">{currencyExact(row.payment)}</td>
                  <td className="px-4 py-2.5 tabular-nums text-text">{currencyExact(row.principal)}</td>
                  <td className="px-4 py-2.5 tabular-nums text-text">{currencyExact(row.interest)}</td>
                  <td className="px-4 py-2.5 tabular-nums text-text">{currencyExact(row.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-6 text-xs leading-relaxed text-muted">
          Fathom is not a lender. This schedule uses a fixed-rate amortization on the estimated
          APR from your scan. Confirm the actual terms in the app before you accept an offer.
        </p>
        <p className="mt-4 text-xs leading-relaxed text-muted">
          Want the habits that shrink this number over time?{" "}
          <Link to="/playbook" className="text-teal hover:underline">
            Get the Repayment Playbook
          </Link>
          .
        </p>
      </main>
      <Footer />
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="mt-1 text-sm font-medium tabular-nums text-text">{value}</dd>
    </div>
  );
}

function buildSchedule(principal: number, apr: number, months: number) {
  const payment = monthlyPayment(principal, apr, months);
  const r = apr / 100 / 12;
  let balance = principal;
  const rows: {
    month: number;
    payment: number;
    principal: number;
    interest: number;
    balance: number;
  }[] = [];
  for (let m = 1; m <= months; m++) {
    const interest = balance * r;
    let prin = payment - interest;
    if (m === months || prin > balance) prin = balance;
    const pay = prin + interest;
    balance = Math.max(0, balance - prin);
    rows.push({
      month: m,
      payment: round2(pay),
      principal: round2(prin),
      interest: round2(interest),
      balance: round2(balance),
    });
  }
  return rows;
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}
