import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import type { DigitalProduct } from "@/lib/digital-products";

/**
 * Renders from whatever DigitalProduct it's given — swapping the product
 * sold here is a config change in digital-products.ts, not an edit to
 * this file.
 */
export function ProductUpsellCard({ product }: { product: DigitalProduct }) {
  const previewItems = product.sections.slice(0, 3).map((s) => s.title);

  return (
    <section className="mt-8 overflow-hidden rounded-3xl border border-teal/25 bg-teal-soft px-6 py-8 sm:px-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-lg">
          <p className="text-xs font-medium uppercase tracking-widest text-teal">
            {product.eyebrow}
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-text sm:text-3xl">
            {product.headline}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-text-soft">{product.description}</p>

          <ul className="mt-4 space-y-1.5">
            {previewItems.map((title) => (
              <li key={title} className="flex items-start gap-2 text-sm text-text">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-teal" strokeWidth={1.75} />
                {title}
              </li>
            ))}
            <li className="pl-6 text-xs text-muted">
              + {product.sections.length - previewItems.length} more, all in the kit
            </li>
          </ul>
        </div>

        <div className="flex shrink-0 flex-col items-start gap-3 lg:items-end">
          <p className="font-display text-3xl font-semibold tracking-tight text-text">
            ₦{product.priceNaira.toLocaleString("en-NG")}
          </p>
          <Link
            to="/kit"
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-teal px-6 text-sm font-medium text-teal-ink transition-colors duration-150 hover:bg-teal-strong sm:w-auto"
          >
            {product.ctaLabel} — ₦{product.priceNaira.toLocaleString("en-NG")}
            <ArrowRight className="size-4" strokeWidth={1.75} />
          </Link>
          <p className="text-xs text-muted">One-time payment · instant download</p>
        </div>
      </div>
    </section>
  );
}
