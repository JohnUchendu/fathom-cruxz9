import { create } from "zustand";
import { generateMatchReasons } from "./analyze";
import { attachReasons, rankLenders, STORAGE_KEY } from "./match";
import type { Profile, RankedLender } from "./types";
import { prefersReducedMotion, sleep } from "./utils";

export type Phase = "brief" | "analyzing" | "results";

type Session = {
  phase: Phase;
  profile: Profile | null;
  matches: RankedLender[];
  run: (profile: Profile) => Promise<void>;
  reset: () => void;
};

export const useSession = create<Session>((set) => ({
  phase: "brief",
  profile: null,
  matches: [],
  run: async (profile) => {
    set({ phase: "analyzing", profile, matches: [] });
    const ranked = rankLenders(profile);
    const top = ranked.slice(0, 4);
    const aiPromise = generateMatchReasons({
      data: {
        profile,
        matches: top.map((m) => ({
          id: m.lender.id,
          name: m.lender.name,
          score: m.score,
          aprMin: m.lender.aprMin,
          fundingMax: m.lender.fundingDays.max,
        })),
      },
    }).catch(() => ({ ok: false as const }));

    const duration = prefersReducedMotion() ? 900 : 5400;
    await sleep(duration);

    let ai: { id: string; reason: string }[] | null = null;
    try {
      const raced = await Promise.race([
        aiPromise,
        sleep(600).then(() => null),
      ]);
      if (raced && raced.ok) ai = raced.reasons;
    } catch {
      ai = null;
    }

    const matches = attachReasons(ranked, profile, ai);
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ profile, matches, savedAt: Date.now() }),
      );
    } catch {
      /* ignore quota */
    }
    set({ phase: "results", matches });
  },
  reset: () => set({ phase: "brief", profile: null, matches: [] }),
}));
