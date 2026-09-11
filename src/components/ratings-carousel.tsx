import { ExternalLink, Star } from "lucide-react";
import { LENDERS } from "@/lib/lenders";
import { AppIcon } from "./app-icon";

const RATED = LENDERS.filter((l) => l.playRating != null);

export function RatingsCarousel() {
  if (RATED.length === 0) return null;
  const row = [...RATED, ...RATED];

  return (
    <section className="border-t border-border py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-5">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-teal">
          On the app stores
        </p>
        <h2 className="mt-2 max-w-xl font-display text-3xl font-semibold tracking-tight text-text sm:text-4xl">
          What real installs say, not what we say.
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-soft">
          Fathom is brand new, so instead of made-up testimonials, here's each app's actual
          Google Play rating — pulled from their live store listing. Hover to pause, tap to
          open the listing yourself.
        </p>
      </div>

      <div className="marquee-row mt-8 [mask-image:linear-gradient(90deg,transparent,black_5%,black_95%,transparent)]">
        <div className="marquee-track gap-4 pl-5" style={{ ["--marquee-duration" as string]: "18s" }}>
          {row.map((l, i) => (
            <a
              key={`${l.id}-${i}`}
              href={l.googlePlayUrl ?? l.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-hidden={i >= RATED.length}
              tabIndex={i >= RATED.length ? -1 : 0}
              className="card-lift flex w-72 shrink-0 flex-col gap-3 rounded-2xl border border-border bg-surface p-5 shadow-card hover:shadow-card-hover"
            >
              <div className="flex items-center gap-3">
                <AppIcon iconUrl={l.iconUrl} letters={l.monogram} seed={l.id} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-text">{l.name}</p>
                  <p className="truncate text-xs text-muted">{l.kind}</p>
                </div>
                <ExternalLink className="size-3.5 shrink-0 text-muted" strokeWidth={1.75} />
              </div>
              <div className="flex items-center gap-2">
                <Stars value={l.playRating ?? 0} />
                <span className="font-mono text-sm tabular-nums text-text">
                  {l.playRating?.toFixed(1)}
                </span>
              </div>
              <p className="text-xs text-muted">
                {l.playReviews ? `${l.playReviews} reviews` : "Google Play"}
                {l.playInstalls ? ` · ${l.playInstalls} installs` : ""}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stars({ value }: { value: number }) {
  const rounded = Math.round(value * 2) / 2;
  return (
    <div className="flex items-center gap-0.5" aria-hidden>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className="size-3.5"
          strokeWidth={1.5}
          fill={n <= rounded ? "currentColor" : "none"}
          style={{ color: "var(--color-teal)" }}
        />
      ))}
    </div>
  );
}
