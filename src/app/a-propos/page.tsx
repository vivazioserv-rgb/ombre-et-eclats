import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Cart from "@/components/Cart";
import { connectDb } from "@/lib/mongoose";
import { Settings } from "@/lib/models";
import { Gem, Award, Hammer } from "lucide-react";
import { siteConfig } from "@/site.config";
import { getLegalPreset } from "@/lib/legalPresets";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  await connectDb();
  const s = await Settings.findOne().lean();
  const settings: any = JSON.parse(JSON.stringify(s || {}));
  const about = settings.about?.trim() || getLegalPreset().about;
  const heroImage = settings.heroImageUrl || siteConfig.hero.defaultImageUrl;

  return (
    <>
      <Navbar brandName={settings.brandName} />
      <Cart />
      <main className="min-h-screen bg-[var(--background)]">
        {/* Hero about */}
        <section className="bg-[var(--muted)] py-16">
          <div className="mx-auto max-w-5xl px-6 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--primary)]">Notre histoire</p>
            <h1 className="font-serif text-5xl tracking-wider sm:text-6xl">À PROPOS</h1>
            <div className="mx-auto mt-4 h-px w-16 bg-[var(--primary)]" />
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-2">
            <div className="overflow-hidden rounded-2xl shadow-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={heroImage} alt="Atelier" className="h-full w-full object-cover" />
            </div>
            <div className="flex flex-col justify-center">
              <h2 className="font-serif text-3xl leading-tight">{siteConfig.brand.tagline}, faite avec <span className="text-[var(--primary)]">passion</span></h2>
              <div className="mt-6 space-y-4 text-[var(--foreground)]/80 whitespace-pre-line">{about}</div>
            </div>
          </div>
        </section>

        <section className="bg-[var(--muted)] py-16">
          <div className="mx-auto grid max-w-6xl gap-6 px-6 md:grid-cols-3">
            <Value icon={<Hammer className="h-6 w-6" />} title="Façonné main" text="Chaque pièce est travaillée à la main dans notre atelier." />
            <Value icon={<Gem className="h-6 w-6" />} title="Argent 925 poinçonné" text="Matière noble garantie à vie contre les défauts." />
            <Value icon={<Award className="h-6 w-6" />} title="Pièces intemporelles" text="Lignes épurées pensées pour durer, se transmettre." />
          </div>
        </section>
      </main>
      <Footer brandName={settings.brandName} />
    </>
  );
}

function Value({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-2xl bg-[var(--muted)] p-6 text-center shadow-sm">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--primary)]">{icon}</div>
      <h3 className="font-serif text-lg">{title}</h3>
      <p className="mt-2 text-sm text-[var(--foreground)]/70">{text}</p>
    </div>
  );
}
