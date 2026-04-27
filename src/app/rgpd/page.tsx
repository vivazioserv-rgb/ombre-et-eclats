import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Cart from "@/components/Cart";
import { connectDb } from "@/lib/mongoose";
import { Settings } from "@/lib/models";
import { siteConfig } from "@/site.config";
import { getLegalPreset } from "@/lib/legalPresets";

export const dynamic = "force-dynamic";

export default async function RgpdPage() {
  await connectDb();
  const s = await Settings.findOne().lean();
  const settings: any = JSON.parse(JSON.stringify(s || {}));
  const rgpd = settings.rgpd?.trim() || getLegalPreset().rgpd;
  const brand = settings.brandName || siteConfig.brand.name;

  return (
    <>
      <Navbar brandName={brand} />
      <Cart />
      <main className="min-h-screen bg-[var(--background)] py-16">
        <div className="mx-auto max-w-3xl px-6">
          <div className="mb-10 flex flex-col items-center">
            <h1 className="font-serif text-5xl tracking-wider">CONFIDENTIALITÉ</h1>
            <div className="mt-3 h-px w-16 bg-[var(--primary)]" />
            <p className="mt-4 text-sm text-[var(--foreground)]/60">Politique de protection des données (RGPD)</p>
          </div>
          <div className="rounded-2xl bg-[var(--muted)] p-8 text-sm leading-relaxed text-[var(--foreground)]/80 shadow-sm whitespace-pre-line">
            {rgpd}
          </div>
          {settings.email && (
            <p className="mt-6 text-center text-xs text-[var(--foreground)]/60">
              Pour toute demande concernant vos données :{" "}
              <a href={`mailto:${settings.email}`} className="text-[var(--primary)] hover:underline">
                {settings.email}
              </a>
            </p>
          )}
        </div>
      </main>
      <Footer brandName={brand} />
    </>
  );
}
