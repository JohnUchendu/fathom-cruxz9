import { ArrowRight } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { LENDERS } from "@/lib/lenders";
import { useSession } from "@/lib/session";
import {
  INCOME_BANDS,
  NG_STATES,
  REPAYMENT_OPTIONS,
  URGENCY_OPTIONS,
  type IncomeBand,
  type Profile,
  type Repayment,
  type Urgency,
} from "@/lib/types";
import { cn, currency } from "@/lib/utils";
import { Button } from "./ui/button";

const SAMPLE: Profile = {
  amount: 150000,
  income: "100-200",
  state: "LA",
  urgency: "week",
  repayment: "balanced",
};

export function MatchForm() {
  const run = useSession((s) => s.run);
  const phase = useSession((s) => s.phase);
  const [amount, setAmount] = useState(100000);
  const [income, setIncome] = useState<IncomeBand | "">("");
  const [state, setState] = useState("");
  const [urgency, setUrgency] = useState<Urgency | "">("");
  const [repayment, setRepayment] = useState<Repayment | "">("");

  const ready = Boolean(income && state && urgency && repayment);
  const busy = phase === "analyzing";

  const coverage = useMemo(() => {
    return LENDERS.filter((l) => amount >= l.minAmount && amount <= l.maxAmount).length;
  }, [amount]);

  function applySample() {
    setAmount(SAMPLE.amount);
    setIncome(SAMPLE.income);
    setState(SAMPLE.state);
    setUrgency(SAMPLE.urgency);
    setRepayment(SAMPLE.repayment);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!ready || busy) return;
    void run({
      amount,
      income: income as IncomeBand,
      state,
      urgency: urgency as Urgency,
      repayment: repayment as Repayment,
    });
  }

  return (
    <form
      id="brief"
      onSubmit={onSubmit}
      className="rounded-3xl border border-border bg-surface p-5 shadow-card sm:p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-teal">Agent brief</p>
          <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight text-text">
            Five signals. One scan.
          </h2>
        </div>
        <button
          type="button"
          onClick={applySample}
          className="shrink-0 pt-1 text-xs font-medium text-text-soft underline-offset-4 hover:text-teal hover:underline"
        >
          Use a sample
        </button>
      </div>

      <div className="mt-5">
        <div className="flex items-end justify-between">
          <label htmlFor="amount" className="text-sm font-medium text-text">
            Loan amount
          </label>
          <p className="font-display text-2xl font-semibold tabular-nums tracking-tight text-teal sm:text-3xl">
            {currency(amount)}
          </p>
        </div>
        <input
          id="amount"
          className="amount-range mt-3"
          type="range"
          min={2000}
          max={2000000}
          step={1000}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
        <div className="mt-2 flex justify-between text-xs text-muted">
          <span>₦2,000</span>
          <span>{coverage} apps cover this size</span>
          <span>₦2,000,000</span>
        </div>
      </div>

      <fieldset className="mt-5">
        <legend className="text-sm font-medium text-text">Income range</legend>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {INCOME_BANDS.map((band) => (
            <Choice
              key={band.id}
              selected={income === band.id}
              onClick={() => setIncome(band.id)}
              label={band.label}
            />
          ))}
        </div>
      </fieldset>

      <div className="mt-5">
        <label htmlFor="state" className="text-sm font-medium text-text">
          State
        </label>
        <select
          id="state"
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="mt-2 h-11 w-full rounded-md border border-border bg-surface-2 px-3 text-sm text-text outline-none transition-[border-color,box-shadow] duration-150 focus:border-teal focus:ring-2 focus:ring-teal/20"
        >
          <option value="">Select state</option>
          {NG_STATES.map((s) => (
            <option key={s.code} value={s.code}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      <fieldset className="mt-5">
        <legend className="text-sm font-medium text-text">Urgency</legend>
        <div className="mt-2 grid grid-cols-2 gap-2 lg:grid-cols-4">
          {URGENCY_OPTIONS.map((opt) => (
            <Choice
              key={opt.id}
              selected={urgency === opt.id}
              onClick={() => setUrgency(opt.id)}
              label={opt.label}
              hint={opt.hint}
            />
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-5">
        <legend className="text-sm font-medium text-text">Repayment preference</legend>
        <div className="mt-2 grid grid-cols-2 gap-2 lg:grid-cols-4">
          {REPAYMENT_OPTIONS.map((opt) => (
            <Choice
              key={opt.id}
              selected={repayment === opt.id}
              onClick={() => setRepayment(opt.id)}
              label={opt.label}
              hint={opt.hint}
            />
          ))}
        </div>
      </fieldset>

      <Button type="submit" size="lg" className="mt-6 w-full" disabled={!ready || busy}>
        Analyze
        <ArrowRight className="size-4" strokeWidth={1.75} />
      </Button>
      <p className="mt-3 text-center text-xs leading-relaxed text-muted">
        Fathom is a research tool, not a lender. No BVN or credit check is collected here.
      </p>
    </form>
  );
}

function Choice({
  selected,
  onClick,
  label,
  hint,
}: {
  selected: boolean;
  onClick: () => void;
  label: string;
  hint?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "min-h-11 rounded-lg px-3 py-2 text-left transition-[background-color,color] duration-150",
        selected
          ? "bg-teal text-teal-ink"
          : "bg-surface-2 text-text hover:bg-border/60",
      )}
    >
      <span className="block text-sm font-medium leading-snug">{label}</span>
      {hint ? (
        <span className={cn("mt-0.5 block text-xs", selected ? "text-teal-ink/70" : "text-muted")}>
          {hint}
        </span>
      ) : null}
    </button>
  );
}
