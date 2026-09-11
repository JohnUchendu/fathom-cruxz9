import { createFileRoute } from "@tanstack/react-router";
import { Check, Download, Lock, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { ACTIVE_PRODUCT } from "@/lib/digital-products";
import { generateReference, openPaystackCheckout } from "@/lib/paystack-client";
import { verifyPaystackTransaction } from "@/lib/paystack";

export const Route = createFileRoute("/kit")({ component: KitPage });

type PaymentState = "idle" | "opening" | "verifying" | "unlocked" | "error";

// Set in your deployment env as VITE_PAYSTACK_PUBLIC_KEY (safe to expose —
// it's the public key). The matching PAYSTACK_SECRET_KEY stays server-side,
// read in src/lib/paystack.ts and never shipped to the browser.
const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY as string | undefined;

function KitPage() {
  const product = ACTIVE_PRODUCT;
  const [state, setState] = useState<PaymentState>("idle");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  function startCheckout() {
    setError(null);

    if (!PAYSTACK_PUBLIC_KEY) {
      setState("error");
      setError("not_configured");
      return;
    }
    if (!emailValid) {
      setError("Enter a valid email — Paystack sends your receipt there.");
      return;
    }

    setState("opening");
    const ref = generateReference("fathom_kit");

    void openPaystackCheckout({
      publicKey: PAYSTACK_PUBLIC_KEY,
      email,
      amountNaira: product.priceNaira,
      reference: ref,
      metadata: { product_id: product.id, product_name: product.name },
      onSuccess: async (confirmedRef) => {
        setState("verifying");
        setReference(confirmedRef);
        try {
          const result = await verifyPaystackTransaction({
            data: { reference: confirmedRef, expectedNaira: product.priceNaira },
          });
          if (result.ok) {
            setState("unlocked");
          } else {
            setState("error");
            setError(
              result.reason === "amount_mismatch"
                ? "The confirmed amount didn't match — no charge has been unlocked. Contact support with your reference."
                : "We couldn't verify that payment. If you were charged, contact support with your reference below.",
            );
          }
        } catch {
          setState("error");
          setError("Couldn't reach the verification server. If you were charged, contact support with your reference below.");
        }
      },
      onClose: () => {
        setState((s) => (s === "opening" ? "idle" : s));
      },
      onError: (message) => {
        setState("error");
        setError(message);
      },
    });
  }

  return (
    <div className="grain min-h-dvh text-text">
      <Header />
      <main className="mx-auto max-w-2xl px-5 py-14">
        <p className="text-xs font-medium uppercase tracking-widest text-teal">{product.eyebrow}</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-text">
          {product.headline}
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-text-soft">{product.description}</p>

        <div className="mt-8 rounded-3xl border border-border bg-surface p-6 shadow-card sm:p-8">
          <div className="flex items-baseline justify-between">
            <p className="font-display text-3xl font-semibold tracking-tight text-text">
              ₦{product.priceNaira.toLocaleString("en-NG")}
            </p>
            <p className="text-xs text-muted">One time · instant download</p>
          </div>

          <div className="mt-6 space-y-5">
            {product.sections.map((section) => (
              <div key={section.title}>
                <p className="text-sm font-medium text-text">{section.title}</p>
                <ul className="mt-1.5 space-y-1">
                  {section.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-text-soft">
                      <Check className="mt-0.5 size-3.5 shrink-0 text-teal" strokeWidth={1.75} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {state !== "unlocked" ? (
            <>
              <div className="mt-7">
                <label htmlFor="email" className="text-sm font-medium text-text">
                  Email for your receipt and download
                </label>
                <input
                  id="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error && error !== "not_configured") setError(null);
                  }}
                  placeholder="you@example.com"
                  className="mt-2 h-11 w-full rounded-md border border-border bg-surface-2 px-3 text-sm text-text outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-muted focus:border-teal focus:ring-2 focus:ring-teal/20"
                />
              </div>

              <Button
                size="lg"
                className="mt-4 w-full"
                onClick={startCheckout}
                disabled={state === "opening" || state === "verifying"}
              >
                <Lock className="size-4" strokeWidth={1.75} />
                {state === "opening"
                  ? "Opening checkout…"
                  : state === "verifying"
                    ? "Confirming payment…"
                    : `Pay with Paystack — ₦${product.priceNaira.toLocaleString("en-NG")}`}
              </Button>

              {state === "error" && error === "not_configured" ? (
                <div className="mt-4 rounded-xl border border-border bg-bg-soft px-4 py-4 text-sm leading-relaxed text-text-soft">
                  <p className="font-medium text-text">Paystack isn't connected yet.</p>
                  <p className="mt-1">
                    Set <code className="rounded bg-surface-2 px-1 py-0.5 font-mono text-xs">VITE_PAYSTACK_PUBLIC_KEY</code>{" "}
                    (client) and{" "}
                    <code className="rounded bg-surface-2 px-1 py-0.5 font-mono text-xs">PAYSTACK_SECRET_KEY</code>{" "}
                    (server) in your deployment's environment variables — see{" "}
                    <code className="rounded bg-surface-2 px-1 py-0.5 font-mono text-xs">.env.example</code>. Both
                    are read at runtime; nothing needs to change in this file.
                  </p>
                  <button
                    type="button"
                    onClick={() => setState("unlocked")}
                    className="mt-3 text-xs font-medium text-teal hover:underline"
                  >
                    Skip payment — local dev preview only
                  </button>
                </div>
              ) : state === "error" && error ? (
                <div className="mt-4 rounded-xl border border-danger/30 bg-danger/10 px-4 py-4 text-sm leading-relaxed text-text">
                  <p>{error}</p>
                  {reference ? (
                    <p className="mt-2 font-mono text-xs text-muted">Reference: {reference}</p>
                  ) : null}
                </div>
              ) : error ? (
                <p className="mt-3 text-xs text-danger">{error}</p>
              ) : null}

              <p className="mt-4 flex items-center gap-1.5 text-xs text-muted">
                <ShieldCheck className="size-3.5" strokeWidth={1.75} />
                {product.disclaimer}
              </p>
            </>
          ) : (
            <div className="mt-7 rounded-xl border border-teal/25 bg-teal-soft px-4 py-4">
              <p className="text-sm font-medium text-text">You're in.</p>
              <p className="mt-1 text-sm text-text-soft">
                {reference
                  ? "Payment confirmed — your download is ready."
                  : "Local dev preview unlocked (no payment was taken)."}
              </p>
              <a
                href={`/${product.fileName}`}
                download
                className="mt-4 inline-flex h-11 items-center gap-2 rounded-full bg-teal px-5 text-sm font-medium text-teal-ink transition-colors duration-150 hover:bg-teal-strong"
              >
                <Download className="size-4" strokeWidth={1.75} />
                Download {product.fileLabel}
              </a>
              {reference ? (
                <p className="mt-3 font-mono text-xs text-muted">Reference: {reference}</p>
              ) : null}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
