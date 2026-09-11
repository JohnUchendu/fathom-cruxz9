import { createServerFn } from "@tanstack/react-start";

export const BUSINESS_EMAIL = "info@jktl.com.ng";

type ChatMessage = { role: "user" | "assistant"; content: string };

type Payload = {
  messages: ChatMessage[];
};

type ChatResult = { ok: true; reply: string } | { ok: false };

const SYSTEM_PROMPT = `You are the Fathom Assistant, a short-answer help bot embedded on Fathom — a free Nigerian loan-app comparison tool (fathom.app). You are not a lender and never give personalized financial, credit, or legal advice.

What Fathom does: scores loan apps and banks against a person's amount, income, state, urgency, and repayment preference, then returns a ranked shortlist with real apply links. It's free. There is one optional paid add-on, the Fathom Borrowing Kit (₦3,000, a guide + worksheets on evaluating and affording a loan), sold at /kit after someone gets their results.

Rules:
- Keep replies to 1–4 short sentences. No headers, no markdown, no bullet lists unless truly needed.
- If the person is asking about advertising, sponsorship, partnerships, business development, traffic, media kit, or anything commercial/business-related about Fathom itself (not about a loan), tell them to email ${BUSINESS_EMAIL} and that the team will follow up there. Do this even on a vague "I want to do business" type message.
- If you don't know something specific about a lender's current live rates, say ranges shown in Fathom are indicative and to confirm in the lender's own app — never invent a number.
- Never claim to guarantee loan approval, change interest rates, or replace advice from a licensed financial adviser.
- If a question is clearly outside what you can help with, suggest emailing ${BUSINESS_EMAIL} rather than guessing.`;

export const chatWithAssistant = createServerFn({ method: "POST" })
  .validator((input: Payload) => input)
  .handler(async ({ data }): Promise<ChatResult> => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) return { ok: false };

    const messages = data.messages.slice(-8); // keep the request small

    try {
      const res = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        signal: AbortSignal.timeout(9000),
        body: JSON.stringify({
          model: "grok-4.5",
          messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
          max_tokens: 220,
          temperature: 0.4,
        }),
      });
      if (!res.ok) return { ok: false };
      const json = await res.json();
      const reply = json?.choices?.[0]?.message?.content;
      if (typeof reply !== "string" || !reply.trim()) return { ok: false };
      return { ok: true, reply: reply.trim() };
    } catch {
      return { ok: false };
    }
  });
