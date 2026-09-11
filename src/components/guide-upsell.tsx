import { Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen } from "lucide-react";

export function GuideUpsell() {
  return (
    <section className="mt-8 overflow-hidden rounded-3xl border border-teal/25 bg-teal-soft px-6 py-8 sm:px-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-lg">
          <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-teal">
            <BookOpen className="size-3.5" strokeWidth={1.75} />
            The Repayment Playbook
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-text sm:text-3xl">
            Pay it off faster — and get a bigger limit next time.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-text-soft">
            A short, practical PDF on reading the real cost of an offer, the exact habits that
            unlock higher limits and lower rates, and the checklist to run before you accept
            anything. ₦2,950, one time.
          </p>
        </div>
        <Link
          to="/playbook"
          className="inline-flex h-12 shrink-0 items-center gap-2 rounded-full bg-teal px-5 text-sm font-medium text-teal-ink transition-colors duration-150 hover:bg-teal-strong"
        >
          Get the playbook
          <ArrowRight className="size-4" strokeWidth={1.75} />
        </Link>
      </div>
    </section>
  );
}
