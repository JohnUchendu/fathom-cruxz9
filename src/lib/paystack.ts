import { createServerFn } from "@tanstack/react-start";

type VerifyPayload = {
  reference: string;
  /** Expected amount in naira, checked against what Paystack actually confirms was paid. */
  expectedNaira: number;
};

type VerifyResult =
  | { ok: true; reference: string }
  | {
      ok: false;
      reason: "not_configured" | "missing_reference" | "not_successful" | "amount_mismatch" | "verify_failed";
    };

/**
 * Confirms a Paystack transaction server-side before anything is unlocked.
 * Never trust the client-side Paystack callback alone — it only means the
 * popup closed with a "success" message, not that the charge is real.
 * PAYSTACK_SECRET_KEY lives only in server env vars and is never sent to
 * the browser.
 */
export const verifyPaystackTransaction = createServerFn({ method: "POST" })
  .validator((input: VerifyPayload) => input)
  .handler(async ({ data }): Promise<VerifyResult> => {
    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) return { ok: false, reason: "not_configured" };
    if (!data.reference) return { ok: false, reason: "missing_reference" };

    try {
      const res = await fetch(
        `https://api.paystack.co/transaction/verify/${encodeURIComponent(data.reference)}`,
        {
          headers: { Authorization: `Bearer ${secretKey}` },
          signal: AbortSignal.timeout(10000),
        },
      );
      const json = (await res.json()) as {
        status?: boolean;
        data?: { status?: string; amount?: number; currency?: string };
      };

      if (!res.ok || !json?.status || json.data?.status !== "success") {
        return { ok: false, reason: "not_successful" };
      }

      const paidKobo = json.data.amount ?? 0;
      const expectedKobo = Math.round(data.expectedNaira * 100);
      if (json.data.currency !== "NGN" || paidKobo < expectedKobo) {
        return { ok: false, reason: "amount_mismatch" };
      }

      return { ok: true, reference: data.reference };
    } catch {
      return { ok: false, reason: "verify_failed" };
    }
  });
