import { LENDERS } from "@/lib/lenders";

export function LogoMarquee() {
  const row = [...LENDERS, ...LENDERS];

  return (
    <div className="marquee-row border-y border-border bg-bg-soft py-5 [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
      <div className="marquee-track gap-10 pl-10" style={{ ["--marquee-duration" as string]: "95s" }}>
        {row.map((l, i) => (
          <div
            key={`${l.id}-${i}`}
            className="flex shrink-0 items-center gap-2 text-text-soft"
            aria-hidden={i >= LENDERS.length}
          >
            <span className="font-display text-lg font-semibold tracking-tight text-text-soft">
              {l.name}
            </span>
            <span className="text-xs text-muted">{l.kind}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
