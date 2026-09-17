"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Sparkles, X, Send, Loader2 } from "lucide-react";
import { siteConfig } from "@/site.config";

type Msg = { role: "user" | "assistant"; content: string };

const GREETING: Msg = {
  role: "assistant",
  content: `Bonjour, je suis le conseiller ${siteConfig.brand.name}. Décrivez-moi ce que vous cherchez (style, budget, occasion) et je vous oriente vers les pièces les plus adaptées.`,
};

export default function AiAdvisor() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  // Auto-ouverture quand on arrive depuis une démo Vivazio (?demo=1)
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (new URLSearchParams(window.location.search).get("demo") === "1") setOpen(true);
  }, []);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    const next = [...messages, { role: "user", content: text } as Msg];
    setMessages(next);
    setInput("");
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Erreur");
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch {
      setError("Le conseiller IA est momentanément indisponible. Contactez-nous directement pour toute question.");
    } finally {
      setLoading(false);
    }
  }

  if (!siteConfig.features.aiAdvisor || pathname?.startsWith("/admin")) return null;

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Conseiller IA"
        className="fixed bottom-24 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--primary)] text-[var(--background)] shadow-lg transition-transform hover:scale-110"
      >
        {open ? <X className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
      </button>

      {open && (
        <div className="fixed bottom-40 right-6 z-40 flex h-[28rem] w-[22rem] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-2xl border border-[var(--accent)] bg-[var(--background)] shadow-2xl">
          <div className="flex items-center gap-2 border-b border-[var(--accent)] bg-[var(--muted)] px-4 py-3">
            <Sparkles className="h-4 w-4 text-[var(--primary)]" />
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground)]">Conseiller IA</p>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
                  m.role === "user"
                    ? "ml-auto bg-[var(--primary)] text-[var(--background)]"
                    : "bg-[var(--muted)] text-[var(--foreground)]/90"
                }`}
              >
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-xs text-[var(--foreground)]/50">
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Le conseiller réfléchit…
              </div>
            )}
            {error && <p className="text-xs text-red-400">{error}</p>}
          </div>

          <div className="flex items-center gap-2 border-t border-[var(--accent)] p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ex : une bague sobre, budget 150€…"
              className="flex-1 rounded-lg bg-[var(--muted)] px-3 py-2 text-xs text-[var(--foreground)] placeholder:text-[var(--foreground)]/40 focus:outline-none"
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              aria-label="Envoyer"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--primary)] text-[var(--background)] disabled:opacity-50"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
