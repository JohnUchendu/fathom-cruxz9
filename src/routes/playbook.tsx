import { createFileRoute } from "@tanstack/react-router";
import { Check, Download, Lock, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/playbook")({ component: PlaybookPage });

const PRICE_NGN = 2950;

const CONTENTS = [
  "How loan-app pricing actually works — monthly rate vs. APR vs. total repayment, with worked naira examples",
  "The 3 habits that raise your limit and lower your rate over time on any app",
  "A payoff-acceleration worksheet: what one extra payment actually saves you in interest",
  "Red flags — rollover traps, hidden fees, and how FCCPC's anti-harassment rules protect you",
  "A one-page checklist to run before you accept any offer",
];

type PaymentState = "idle" | "processing" | "unlocked";

function PlaybookPage() {
  const [state, setState] = useState<PaymentState>("idle");

  /**
   * Payment is not wired to a live processor in this build.
   * To accept real payment, integrate Paystack (most common for Nigerian
   * naira checkout) or Flutterwave here, e.g.:
   *
   *   import PaystackPop from "@paystack/inline-js";
   *   const popup = new PaystackPop();
   *   popup.newTransaction({
   *     key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
   *     email: customerEmail,
   *     amount: PRICE_NGN * 100, // kobo
   *     currency: "NGN",
   *     onSuccess: () => setState("unlocked"),
   *     onCancel: () => setState("idle"),
   *   });
   *
   * Verify the transaction server-side (Paystack's /transaction/verify)
   * before releasing the download link — never unlock on the client
   * callback alone in production.
   */
  function startCheckout() {
    setState("processing");
  }

  return (
    <div className="grain min-h-dvh text-text">
      <Header />
      <main className="mx-auto max-w-2xl px-5 py-14">
        <p className="text-xs font-medium uppercase tracking-widest text-teal">
          The Repayment Playbook
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-text">
          Pay off faster. Borrow smarter next time.
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-text-soft">
          A short, practical guide to what actually moves the needle once you've taken a loan —
          reading the real cost of an offer, the habits that unlock bigger limits and lower
          rates, and what to check before you accept anything.
        </p>

        <div className="mt-8 rounded-3xl border border-border bg-surface p-6 shadow-card sm:p-8">
          <div className="flex items-baseline justify-between">
            <p className="font-display text-3xl font-semibold tracking-tight text-text">
              ₦{PRICE_NGN.toLocaleString("en-NG")}
            </p>
            <p className="text-xs text-muted">One time · instant PDF</p>
          </div>

          <ul className="mt-6 space-y-3">
            {CONTENTS.map((line) => (
              <li key={line} className="flex items-start gap-2.5 text-sm text-text-soft">
                <Check className="mt-0.5 size-4 shrink-0 text-teal" strokeWidth={1.75} />
                <span>{line}</span>
              </li>
            ))}
          </ul>

          {state !== "unlocked" ? (
            <>
              <Button size="lg" className="mt-7 w-full" onClick={startCheckout} disabled={state === "processing"}>
                <Lock className="size-4" strokeWidth={1.75} />
                {state === "processing" ? "Connecting to payment…" : `Pay ₦${PRICE_NGN.toLocaleString("en-NG")}`}
              </Button>

              {state === "processing" ? (
                <div className="mt-4 rounded-xl border border-border bg-bg-soft px-4 py-4 text-sm leading-relaxed text-text-soft">
                  <p className="font-medium text-text">Payment isn't connected yet.</p>
                  <p className="mt-1">
                    This build doesn't have a live Paystack or Flutterwave key wired in, so
                    there's nowhere for this ₦{PRICE_NGN.toLocaleString("en-NG")} to actually
                    go. Connect a payment provider before sharing this page with real
                    borrowers — see the comment in{" "}
                    <code className="rounded bg-surface-2 px-1 py-0.5 font-mono text-xs">
                      src/routes/playbook.tsx
                    </code>
                    .
                  </p>
                  <button
                    type="button"
                    onClick={() => setState("unlocked")}
                    className="mt-3 text-xs font-medium text-teal hover:underline"
                  >
                    Skip payment — dev preview only
                  </button>
                  <button
                    type="button"
                    onClick={() => setState("idle")}
                    className="mt-3 ml-4 text-xs font-medium text-muted hover:underline"
                  >
                    Cancel
                  </button>
                </div>
              ) : null}

              <p className="mt-4 flex items-center gap-1.5 text-xs text-muted">
                <ShieldCheck className="size-3.5" strokeWidth={1.75} />
                Educational content only — not personal financial advice.
              </p>
            </>
          ) : (
            <div className="mt-7 rounded-xl border border-teal/25 bg-teal-soft px-4 py-4">
              <p className="text-sm font-medium text-text">You're in — dev preview unlocked.</p>
              <p className="mt-1 text-sm text-text-soft">
                In production this state should only be reachable after a verified payment.
              </p>
              <a
                href="/repayment-playbook.pdf"
                download
                className="mt-4 inline-flex h-11 items-center gap-2 rounded-full bg-teal px-5 text-sm font-medium text-teal-ink transition-colors duration-150 hover:bg-teal-strong"
              >
                <Download className="size-4" strokeWidth={1.75} />
                Download the PDF
              </a>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
