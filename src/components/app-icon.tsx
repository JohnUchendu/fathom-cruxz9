import { useState } from "react";
import { cn } from "@/lib/utils";
import { Monogram } from "./monogram";

export function AppIcon({
  iconUrl,
  letters,
  seed,
  size = "md",
}: {
  iconUrl?: string;
  letters: string;
  seed: string;
  size?: "sm" | "md";
}) {
  const [failed, setFailed] = useState(false);

  if (!iconUrl || failed) {
    return <Monogram letters={letters} seed={seed} size={size} />;
  }

  return (
    <img
      src={iconUrl}
      alt=""
      aria-hidden
      onError={() => setFailed(true)}
      className={cn(
        "shrink-0 rounded-md border border-border object-cover",
        size === "sm" ? "size-9" : "size-11",
      )}
    />
  );
}
