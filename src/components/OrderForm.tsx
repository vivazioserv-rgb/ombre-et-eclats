"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartProvider";
import { CheckCircle2, Trash2 } from "lucide-react";
import DatePickerAvailable from "@/components/DatePickerAvailable";
import { siteConfig } from "@/site.config";

export default function OrderForm({ settings }: { settings: any }) {
  const { cart, cartTotal, clearCart, removeFromCart } = useCart();
  const router = useRouter();
  const [form, setForm] = useState({
    client: "",
    email: "",
    phone: "",
    pickupDate: "",
    slot: settings.slots?.[0] || "",
    mode: (siteConfig.features.postalDelivery && !siteConfig.features.pickupCalendar ? "delivery" : "pickup") as "pickup" | "delivery",
    address: "",
    note: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (cart.length === 0) return setError("Votre panier est vide");
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        items: cart.map((i) => ({
          productId: i.productId,
          name: i.name,
          flavor: i.flavor,
          size: i.size,
          quantity: i.quantity,
          price: i.price,
        })),
        total: cartTotal,
      };

      // Try Stripe checkout first
      const stripeRes = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const stripeData = await stripeRes.json();
      if (stripeRes.ok && stripeData.url) {
        window.location.href = stripeData.url;
        return;
      }

      // Fallback: no Stripe configured — create the order directly
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      clearCart();
      setSuccess(data._id);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-2xl bg-[var(--muted)] p-10 text-center shadow-sm">
        <CheckCircle2 className="mx-auto h-14 w-14 text-[var(--primary)]" />
        <h2 className="mt-4 font-serif text-2xl">Commande enregistrée</h2>
        <p className="mt-2 text-sm text-[var(--foreground)]/60">
          Numéro : <span className="font-mono">{success.slice(-8)}</span>
        </p>
        <p className="mt-4 text-sm">Nous vous recontacterons pour confirmer.</p>
        <button
          onClick={() => router.push("/")}
          className="mt-6 rounded-sm bg-[var(--primary)] px-6 py-3 text-xs font-semibold uppercase tracking-widest text-[var(--background)] hover:bg-[var(--primary-dark)]"
        >
          Retour à l&apos;accueil
        </button>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="rounded-2xl bg-[var(--muted)] p-10 text-center shadow-sm">
        <p className="text-[var(--foreground)]/60">Votre panier est vide.</p>
        <button
          onClick={() => router.push("/catalogue")}
          className="mt-6 rounded-sm bg-[var(--primary)] px-6 py-3 text-xs font-semibold uppercase tracking-widest text-[var(--background)]"
        >
          Parcourir la boutique
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="rounded-2xl bg-[var(--muted)] p-6 shadow-sm">
        <h2 className="mb-4 font-serif text-xl">Votre panier</h2>
        <ul className="divide-y divide-[var(--accent)]">
          {cart.map((i) => (
            <li key={i.key} className="flex items-center justify-between py-3 text-sm">
              <div>
                <p className="font-medium">
                  {i.name} × {i.quantity}
                </p>
                {(i.flavor || i.size) && (
                  <p className="text-xs text-[var(--foreground)]/60">{[i.flavor, i.size].filter(Boolean).join(" · ")}</p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold">{(i.price * i.quantity).toFixed(2)}€</span>
                <button type="button" onClick={() => removeFromCart(i.key)} aria-label="Supprimer">
                  <Trash2 className="h-4 w-4 text-[var(--primary)]" />
                </button>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between border-t border-[var(--accent)] pt-4">
          <span className="font-medium">Total</span>
          <span className="font-serif text-xl text-[var(--primary)]">{cartTotal.toFixed(2)}€</span>
        </div>
      </div>

      <div className="rounded-2xl bg-[var(--muted)] p-6 shadow-sm">
        <h2 className="mb-4 font-serif text-xl">Vos coordonnées</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Nom complet *" value={form.client} onChange={(v) => setForm({ ...form, client: v })} required />
          <Field label="Email *" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
          <Field label="Téléphone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
        </div>
      </div>

      {siteConfig.features.pickupCalendar && (
      <div className="rounded-2xl bg-[var(--muted)] p-6 shadow-sm">
        <h2 className="mb-4 font-serif text-xl">Retrait</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <DatePickerAvailable
            label="Date de retrait *"
            value={form.pickupDate}
            onChange={(v) => setForm({ ...form, pickupDate: v })}
            minDays={settings.minDelay || 2}
            openWeekdays={settings.openWeekdays}
            closedDates={settings.closedDates}
          />
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider">Créneau</label>
            <select
              value={form.slot}
              onChange={(e) => setForm({ ...form, slot: e.target.value })}
              className="w-full rounded-lg border border-[var(--accent)] bg-[var(--muted)] px-3 py-2 text-sm focus:border-[var(--primary)] focus:outline-none"
            >
              {(settings.slots || []).map((s: string) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4">
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider">Note (allergies, dédicace…)</label>
          <textarea
            rows={3}
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
            className="w-full rounded-lg border border-[var(--accent)] bg-[var(--muted)] px-3 py-2 text-sm focus:border-[var(--primary)] focus:outline-none"
          />
        </div>
      </div>
      )}

      {siteConfig.features.postalDelivery && (
        <div className="rounded-2xl bg-[var(--muted)] p-6 shadow-sm">
          <h2 className="mb-4 font-serif text-xl">Livraison</h2>
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider">Adresse de livraison *</label>
            <textarea
              rows={3}
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              required
              placeholder="Rue, code postal, ville, pays"
              className="w-full rounded-lg border border-[var(--accent)] bg-[var(--muted)] px-3 py-2 text-sm focus:border-[var(--primary)] focus:outline-none"
            />
          </div>
          <div className="mt-4">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider">Note (remarques, dédicace…)</label>
            <textarea
              rows={2}
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              className="w-full rounded-lg border border-[var(--accent)] bg-[var(--muted)] px-3 py-2 text-sm focus:border-[var(--primary)] focus:outline-none"
            />
          </div>
        </div>
      )}

      {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-sm bg-[var(--primary)] py-4 text-xs font-semibold uppercase tracking-widest text-[var(--background)] hover:bg-[var(--primary-dark)] disabled:opacity-60"
      >
        {submitting ? "Redirection vers le paiement…" : "Payer et valider"}
      </button>
      <p className="text-center text-xs text-[var(--foreground)]/50">
        Paiement sécurisé via Stripe · CB, Apple Pay, Google Pay
      </p>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-wider">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full rounded-lg border border-[var(--accent)] bg-[var(--muted)] px-3 py-2 text-sm focus:border-[var(--primary)] focus:outline-none"
      />
    </div>
  );
}
