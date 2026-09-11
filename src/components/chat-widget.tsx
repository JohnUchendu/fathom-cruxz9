import { Mail, MessageCircle, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { BUSINESS_EMAIL, chatWithAssistant } from "@/lib/chat-assistant";
import { fallbackReply } from "@/lib/chat-fallback";
import { cn } from "@/lib/utils";

type Message = { role: "user" | "assistant"; content: string };

const GREETING: Message = {
  role: "assistant",
  content:
    "Hi, I'm the Fathom Assistant. Ask me how Fathom works, or if you're reaching out about advertising, partnerships, or business — I can point you to the right place.",
};

const QUICK_REPLIES = [
  "How does Fathom work?",
  "Is it really free?",
  "I want to advertise or partner",
  "I need help with my results",
];

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    if (window.innerWidth < 640) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    const next: Message[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setBusy(true);

    try {
      const result = await chatWithAssistant({
        data: { messages: next.map((m) => ({ role: m.role, content: m.content })) },
      });
      const reply = result.ok ? result.reply : fallbackReply(trimmed);
      setMessages((cur) => [...cur, { role: "assistant", content: reply }]);
    } catch {
      setMessages((cur) => [...cur, { role: "assistant", content: fallbackReply(trimmed) }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Close Fathom Assistant" : "Open Fathom Assistant"}
        className={cn(
          "fixed bottom-5 right-5 z-40 inline-flex size-14 items-center justify-center rounded-full bg-teal text-teal-ink shadow-card-hover transition-transform duration-150 hover:bg-teal-strong active:scale-95",
          open && "hidden sm:inline-flex",
        )}
      >
        {open ? <X className="size-6" strokeWidth={1.75} /> : <MessageCircle className="size-6" strokeWidth={1.75} />}
      </button>

      {open ? (
        <div
          role="dialog"
          aria-label="Fathom Assistant chat"
          className="fixed inset-x-3 bottom-3 top-16 z-40 flex flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-card-hover sm:inset-x-auto sm:top-auto sm:right-5 sm:bottom-24 sm:h-[32rem] sm:w-96"
        >
          <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3">
            <div>
              <p className="font-display text-sm font-semibold tracking-tight text-text">Fathom Assistant</p>
              <p className="text-xs text-muted">Usually replies in seconds</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="inline-flex size-9 items-center justify-center rounded-full text-text-soft transition-colors duration-150 hover:bg-surface-2 hover:text-text"
            >
              <X className="size-5" strokeWidth={1.75} />
            </button>
          </div>

          <div ref={scrollRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                  m.role === "assistant"
                    ? "bg-surface-2 text-text"
                    : "ml-auto bg-teal text-teal-ink",
                )}
              >
                {m.content}
              </div>
            ))}
            {busy ? (
              <div className="flex w-fit items-center gap-1 rounded-2xl bg-surface-2 px-3.5 py-3">
                <span className="size-1.5 animate-bounce rounded-full bg-text-soft [animation-delay:0ms]" />
                <span className="size-1.5 animate-bounce rounded-full bg-text-soft [animation-delay:150ms]" />
                <span className="size-1.5 animate-bounce rounded-full bg-text-soft [animation-delay:300ms]" />
              </div>
            ) : null}

            {messages.length === 1 ? (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {QUICK_REPLIES.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => void send(q)}
                    className="rounded-full border border-border-strong px-3 py-1.5 text-xs text-text-soft transition-colors duration-150 hover:bg-surface-2 hover:text-text"
                  >
                    {q}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void send(input);
            }}
            className="flex shrink-0 items-center gap-2 border-t border-border px-3 py-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question…"
              className="h-10 min-w-0 flex-1 rounded-full border border-border bg-surface-2 px-3.5 text-sm text-text outline-none placeholder:text-muted focus:border-teal focus:ring-2 focus:ring-teal/20"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              aria-label="Send"
              className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-teal text-teal-ink transition-colors duration-150 hover:bg-teal-strong disabled:opacity-40"
            >
              <Send className="size-4" strokeWidth={1.75} />
            </button>
          </form>

          <a
            href={`mailto:${BUSINESS_EMAIL}?subject=Fathom%20business%20inquiry`}
            className="flex shrink-0 items-center justify-center gap-1.5 border-t border-border bg-bg-soft px-4 py-2.5 text-xs text-text-soft transition-colors duration-150 hover:text-teal"
          >
            <Mail className="size-3.5" strokeWidth={1.75} />
            Business & partnership inquiries: {BUSINESS_EMAIL}
          </a>
        </div>
      ) : null}
    </>
  );
}
