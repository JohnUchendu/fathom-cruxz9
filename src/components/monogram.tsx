import { cn } from "@/lib/utils";

const TONES = [
  "bg-teal-soft text-teal",
  "bg-surface-2 text-text-soft border border-border",
  "bg-surface-2 text-teal border border-teal/25",
] as const;

export function Monogram({
  letters,
  seed,
  size = "md",
}: {
  letters: string;
  seed: string;
  size?: "sm" | "md";
}) {
  const tone = TONES[Math.abs(hash(seed)) % TONES.length];
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-md font-display font-semibold tracking-tight",
        size === "sm" ? "size-9 text-xs" : "size-11 text-sm",
        tone,
      )}
      aria-hidden
    >
      {letters}
    </span>
  );
}

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h;
}
