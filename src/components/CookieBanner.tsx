"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { COOKIE_KEY } from "@/lib/storage";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(COOKIE_KEY)) setVisible(true);
    } catch {}
  }, []);

  function decide(value: "accepted" | "refused") {
    try {
      localStorage.setItem(COOKIE_KEY, value);
    } catch {}
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-4 bottom-4 z-50 rounded-2xl bg-[var(--muted)]/95 p-5 shadow-2xl backdrop-blur md:inset-x-auto md:left-6 md:right-6 md:flex md:max-w-3xl md:mx-auto md:items-center md:gap-6">
      <div className="flex-1 text-sm text-[var(--foreground)]/80">
        <strong className="font-serif text-base text-[var(--foreground)]">Cookies</strong> — Nous utilisons uniquement des cookies essentiels au bon fonctionnement du site (panier, session). Pas de traqueurs publicitaires.{" "}
        <Link href="/rgpd" className="underline hover:text-[var(--primary)]">
          En savoir plus
        </Link>
      </div>
      <div className="mt-3 flex gap-2 md:mt-0">
        <button
          onClick={() => decide("refused")}
          className="rounded-sm border border-[var(--primary)] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[var(--primary)] hover:bg-[var(--primary)] hover:text-[var(--background)]"
        >
          Refuser
        </button>
        <button
          onClick={() => decide("accepted")}
          className="rounded-sm bg-[var(--primary)] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[var(--background)] hover:bg-[var(--primary-dark)]"
        >
          Accepter
        </button>
      </div>
    </div>
  );
}
