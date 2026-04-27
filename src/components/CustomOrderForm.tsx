"use client";
import { useState } from "react";
import DatePickerAvailable from "@/components/DatePickerAvailable";
import { CheckCircle2 } from "lucide-react";
import { siteConfig } from "@/site.config";

const EVENT_TYPES = siteConfig.customOrderEvents || ["Anniversaire", "Autre"];

export default function CustomOrderForm({ settings }: { settings: any }) {
  const [form, setForm] = useState({
    client: "",
    email: "",
    phone: "",
    eventType: EVENT_TYPES[0],
    parts: 10,
    pickupDate: "",
    slot: settings.slots?.[0] || "",
    note: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client: form.client,
          email: form.email,
          phone: form.phone,
          items: [
            {
              productId: "custom",
              name: `Sur-mesure · ${form.eventType} · qté ${form.parts}`,
              quantity: 1,
              price: 0,
            },
          ],
          total: 0,
          pickupDate: form.pickupDate,
          slot: form.slot,
          mode: "pickup",
          note: `[DEMANDE SUR-MESURE]\nType: ${form.eventType}\nQuantité: ${form.parts}\n\nDescription:\n${form.note}`,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      setSuccess(true);
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
        <h2 className="mt-4 font-serif text-2xl">Demande envoyée</h2>
        <p className="mt-2 text-sm text-[var(--foreground)]/60">
          Nous revenons vers vous sous 24h ouvrées avec un devis personnalisé.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="rounded-2xl bg-[var(--muted)] p-6 shadow-sm">
        <h2 className="mb-4 font-serif text-xl">Vos coordonnées</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Nom complet *" value={form.client} onChange={(v) => setForm({ ...form, client: v })} required />
          <Field label="Email *" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
          <Field label="Téléphone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
        </div>
      </div>

      <div className="rounded-2xl bg-[var(--muted)] p-6 shadow-sm">
        <h2 className="mb-4 font-serif text-xl">Votre projet</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider">Type d&apos;événement</label>
            <select
              value={form.eventType}
              onChange={(e) => setForm({ ...form, eventType: e.target.value })}
              className="w-full rounded-lg border border-[var(--accent)] bg-[var(--muted)] px-3 py-2 text-sm focus:border-[var(--primary)] focus:outline-none"
            >
              {EVENT_TYPES.map((ev) => (
                <option key={ev}>{ev}</option>
              ))}
            </select>
          </div>
          <Field type="number" label="Quantité souhaitée" value={form.parts} onChange={(v) => setForm({ ...form, parts: parseInt(v) || 1 })} />
        </div>
        <div className="mt-4">
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider">Décrivez votre demande *</label>
          <textarea
            rows={5}
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
            required
            placeholder="Parfums souhaités, couleurs, décoration, allergies, inspirations…"
            className="w-full rounded-lg border border-[var(--accent)] bg-[var(--muted)] px-3 py-2 text-sm focus:border-[var(--primary)] focus:outline-none"
          />
        </div>
      </div>

      {siteConfig.features.pickupCalendar && (
      <div className="rounded-2xl bg-[var(--muted)] p-6 shadow-sm">
        <h2 className="mb-4 font-serif text-xl">Retrait souhaité</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <DatePickerAvailable
            label="Date *"
            value={form.pickupDate}
            onChange={(v) => setForm({ ...form, pickupDate: v })}
            minDays={Math.max(2, settings.minDelay || 2)}
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
      </div>
      )}

      {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-sm bg-[var(--primary)] py-4 text-xs font-semibold uppercase tracking-widest text-[var(--background)] hover:bg-[var(--primary-dark)] disabled:opacity-60"
      >
        {submitting ? "Envoi…" : "Envoyer ma demande"}
      </button>
      <p className="text-center text-xs text-[var(--foreground)]/50">
        Nous vous recontacterons pour confirmer la faisabilité et le prix.
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
  value: any;
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
