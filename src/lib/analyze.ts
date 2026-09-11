import { createServerFn } from "@tanstack/react-start";
import type { Profile } from "./types";

type Payload = {
  profile: Profile;
  matches: { id: string; name: string; score: number; aprMin: number; fundingMax: number }[];
};

export const generateMatchReasons = createServerFn({ method: "POST" })
  .validator((input: Payload) => input)
  .handler(async ({ data }) => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) return { ok: false as const };

    const { profile, matches } = data;
    const prompt = `You are Fathom, a loan-research analyst writing match notes for a Nigerian consumer comparing loan apps.
Write one reason (2 sentences, 35–55 words, no marketing fluff, no exclamation marks) for each lender below.
Tone: calm, specific, like an internal research memo. Mention concrete profile facts. Amounts are in naira (₦).
Return ONLY a JSON array: [{"id":"...","reason":"..."}]

Profile:
- amount: ₦${profile.amount}
- income band: ${profile.income}
- state: ${profile.state}
- urgency: ${profile.urgency}
- repayment preference: ${profile.repayment}

Lenders:
${matches.map((m) => `- ${m.id} | ${m.name} | score ${m.score} | monthly rate from ${m.aprMin}% | funds ≤${m.fundingMax}d`).join("\n")}`;

    try {
      const res = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        signal: AbortSignal.timeout(8000),
        body: JSON.stringify({
          model: "grok-4.5",
          temperature: 0.35,
          max_tokens: 700,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      if (!res.ok) return { ok: false as const };
      const body = (await res.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      const text = body.choices?.[0]?.message?.content ?? "";
      const start = text.indexOf("[");
      const end = text.lastIndexOf("]");
      if (start === -1 || end === -1) return { ok: false as const };
      const parsed = JSON.parse(text.slice(start, end + 1)) as {
        id?: string;
        reason?: string;
      }[];
      const reasons = parsed
        .filter((r) => r.id && r.reason)
        .map((r) => ({ id: String(r.id), reason: String(r.reason) }));
      if (reasons.length === 0) return { ok: false as const };
      return { ok: true as const, reasons };
    } catch {
      return { ok: false as const };
    }
  });
