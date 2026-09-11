/**
 * Browser-side Paystack Inline integration. Only ever touches the public
 * key (safe to ship to the client) — the secret key stays server-side in
 * ./paystack.ts. This loads Paystack's own script rather than an npm
 * wrapper, since that's the integration Paystack documents and supports
 * directly.
 */

declare global {
  interface Window {
    PaystackPop?: {
      setup: (options: PaystackSetupOptions) => { openIframe: () => void };
    };
  }
}

interface PaystackSetupOptions {
  key: string;
  email: string;
  amount: number;
  currency: string;
  ref: string;
  metadata?: Record<string, unknown>;
  callback: (response: { reference: string }) => void;
  onClose: () => void;
}

const SCRIPT_SRC = "https://js.paystack.co/v1/inline.js";
let scriptPromise: Promise<void> | null = null;

function loadPaystackScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("no window"));
  if (window.PaystackPop) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${SCRIPT_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Paystack script failed to load")));
      return;
    }
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Paystack script failed to load"));
    document.head.appendChild(script);
  });

  return scriptPromise;
}

export function generateReference(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export async function openPaystackCheckout(options: {
  publicKey: string;
  email: string;
  amountNaira: number;
  reference: string;
  metadata?: Record<string, unknown>;
  onSuccess: (reference: string) => void;
  onClose: () => void;
  onError: (message: string) => void;
}): Promise<void> {
  try {
    await loadPaystackScript();
  } catch {
    options.onError("Couldn't load the Paystack checkout script. Check your connection and try again.");
    return;
  }

  if (!window.PaystackPop) {
    options.onError("Paystack didn't initialize correctly.");
    return;
  }

  const handler = window.PaystackPop.setup({
    key: options.publicKey,
    email: options.email,
    amount: Math.round(options.amountNaira * 100),
    currency: "NGN",
    ref: options.reference,
    metadata: options.metadata,
    callback: (response) => options.onSuccess(response.reference),
    onClose: options.onClose,
  });

  handler.openIframe();
}
