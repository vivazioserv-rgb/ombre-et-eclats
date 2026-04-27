import Link from "next/link";
import { CreditCard, Award, Headphones, Truck } from "lucide-react";
import { siteConfig } from "@/site.config";

export default function Footer({ brandName = siteConfig.brand.name }: { brandName?: string }) {
  return (
    <footer className="mt-10 border-t border-[var(--accent)] bg-[var(--muted)]">
      <div className="mx-auto grid max-w-7xl gap-6 px-6 py-10 md:grid-cols-3">
        <div className="flex items-center gap-3">
          <Award className="h-6 w-6 text-[var(--primary)]" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider">Argent massif 925</p>
            <p className="text-xs text-[var(--foreground)]/60">Poinçonné, garanti 2 ans</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Truck className="h-6 w-6 text-[var(--primary)]" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider">Livraison offerte</p>
            <p className="text-xs text-[var(--foreground)]/60">Dès 80€ en France & Europe</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <CreditCard className="h-6 w-6 text-[var(--primary)]" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider">Paiement sécurisé</p>
            <p className="text-xs text-[var(--foreground)]/60">CB, Apple Pay, PayPal</p>
          </div>
        </div>
      </div>
      <div className="border-t border-[var(--accent)] py-5 text-center text-xs text-[var(--foreground)]/50">
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/a-propos" className="hover:text-[var(--primary)]">À propos</Link>
          <span aria-hidden="true">·</span>
          <Link href="/contact" className="hover:text-[var(--primary)]">Contact</Link>
          <span aria-hidden="true">·</span>
          <Link href="/rgpd" className="hover:text-[var(--primary)]">Confidentialité</Link>
        </div>
        <p className="mt-3">© {new Date().getFullYear()} {brandName} — {siteConfig.brand.tagline} — Tous droits réservés</p>
      </div>
    </footer>
  );
}
