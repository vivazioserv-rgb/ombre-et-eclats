import Link from "next/link";
import { CreditCard, Award, Truck, Camera, Music2, Share2 } from "lucide-react";
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
      {(siteConfig.social.instagram || siteConfig.social.tiktok || siteConfig.social.facebook) && (
        <div className="flex items-center justify-center gap-4 border-t border-[var(--accent)] py-5">
          {siteConfig.social.instagram && (
            <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-[var(--foreground)]/60 hover:text-[var(--primary)]">
              <Camera className="h-4 w-4" />
            </a>
          )}
          {siteConfig.social.tiktok && (
            <a href={siteConfig.social.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="text-[var(--foreground)]/60 hover:text-[var(--primary)]">
              <Music2 className="h-4 w-4" />
            </a>
          )}
          {siteConfig.social.facebook && (
            <a href={siteConfig.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-[var(--foreground)]/60 hover:text-[var(--primary)]">
              <Share2 className="h-4 w-4" />
            </a>
          )}
        </div>
      )}
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
