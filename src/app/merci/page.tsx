import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Cart from "@/components/Cart";
import ClearCartOnMount from "@/components/ClearCartOnMount";
import { CheckCircle2 } from "lucide-react";

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; session?: string }>;
}) {
  const { order } = await searchParams;

  return (
    <>
      <Navbar />
      <Cart />
      <ClearCartOnMount />
      <main className="min-h-screen bg-[var(--muted)] py-20">
        <div className="mx-auto max-w-xl rounded-2xl bg-[var(--muted)] p-10 text-center shadow-xl">
          <CheckCircle2 className="mx-auto h-16 w-16 text-[var(--primary)]" />
          <h1 className="mt-4 font-serif text-3xl">Merci pour votre commande !</h1>
          <p className="mt-3 text-sm text-[var(--foreground)]/70">
            Votre paiement a été validé. Nous vous envoyons une confirmation par email.
          </p>
          {order && (
            <p className="mt-4 text-xs text-[var(--foreground)]/50">
              N° de commande : <span className="font-mono">{order.slice(-8)}</span>
            </p>
          )}
          <Link
            href="/"
            className="mt-8 inline-block rounded-sm bg-[var(--primary)] px-8 py-3 text-xs font-semibold uppercase tracking-widest text-[var(--background)] hover:bg-[var(--primary-dark)]"
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
