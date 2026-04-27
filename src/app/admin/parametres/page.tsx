"use client";
import { useEffect, useState } from "react";
import { adminFetch, uploadImage, IMAGE_PRESETS } from "@/lib/adminClient";
import { Upload, Save } from "lucide-react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [uploadingHero, setUploadingHero] = useState(false);

  useEffect(() => {
    fetch("/api/settings").then((r) => r.json()).then(setSettings);
  }, []);

  if (!settings) return <p>Chargement…</p>;

  async function save() {
    setSaving(true);
    setMsg(null);
    setErr(null);
    try {
      const payload = { ...settings };
      if (!payload.adminPassword) delete payload.adminPassword;
      await adminFetch("/api/settings", { method: "PUT", body: JSON.stringify(payload) });
      setMsg("Paramètres enregistrés");
      setSettings({ ...settings, adminPassword: "" });
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleHero(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setUploadingHero(true);
    try {
      const url = await uploadImage(f, IMAGE_PRESETS.hero);
      setSettings({ ...settings, heroImageUrl: url });
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setUploadingHero(false);
    }
  }

  return (
    <div className="max-w-3xl">
      <h1 className="mb-8 font-serif text-3xl">Paramètres</h1>

      <div className="space-y-6">
        <Card title="Identité de la marque">
          <Field label="Nom" value={settings.brandName || ""} onChange={(v) => setSettings({ ...settings, brandName: v })} />
          <Field label="Tagline" value={settings.brandTagline || ""} onChange={(v) => setSettings({ ...settings, brandTagline: v })} />
        </Card>

        <Card title="Page d'accueil (Hero)">
          <Field label="Titre" value={settings.heroTitle || ""} onChange={(v) => setSettings({ ...settings, heroTitle: v })} />
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider">Sous-titre</label>
            <textarea
              rows={2}
              value={settings.heroSubtitle || ""}
              onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
              className="w-full rounded-lg border border-gray-300 bg-white text-gray-900 px-3 py-2 text-sm focus:border-[var(--primary)] focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider">Image de présentation</label>
            <div className="flex items-center gap-4">
              {settings.heroImageUrl && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={settings.heroImageUrl} alt="Hero" className="h-24 w-24 rounded-full object-cover ring-2 ring-gray-200 shadow-md" />
              )}
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-[var(--primary)] px-4 py-2 text-xs text-[var(--primary)] hover:bg-[var(--primary)] hover:text-[var(--background)]">
                <Upload className="h-4 w-4" /> {uploadingHero ? "Upload…" : "Changer l'image"}
                <input type="file" accept="image/*" onChange={handleHero} className="hidden" />
              </label>
            </div>
            <Field label="Ou URL directe" value={settings.heroImageUrl || ""} onChange={(v) => setSettings({ ...settings, heroImageUrl: v })} />
          </div>
        </Card>

        <Card title="Contact">
          <Field label="Email" type="email" value={settings.email || ""} onChange={(v) => setSettings({ ...settings, email: v })} />
          <Field label="Téléphone" value={settings.phone || ""} onChange={(v) => setSettings({ ...settings, phone: v })} />
          <Field label="Zone de livraison" value={settings.zone || ""} onChange={(v) => setSettings({ ...settings, zone: v })} />
        </Card>

        <Card title="Créneaux de retrait">
          <Field
            label="Créneaux (séparés par virgule)"
            value={(settings.slots || []).join(", ")}
            onChange={(v) => setSettings({ ...settings, slots: v.split(",").map((s: string) => s.trim()).filter(Boolean) })}
          />
          <Field type="number" label="Délai minimum global (heures)" value={settings.minDelay || 2} onChange={(v) => setSettings({ ...settings, minDelay: parseInt(v) || 2 })} />
          <WeekdayPicker value={settings.openWeekdays || [2, 3, 4, 5, 6]} onChange={(v) => setSettings({ ...settings, openWeekdays: v })} />
          <ClosedDatesPicker value={settings.closedDates || []} onChange={(v) => setSettings({ ...settings, closedDates: v })} />
        </Card>

        <Card title="Page À propos">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider">Texte affiché sur la page À propos</label>
            <textarea
              rows={8}
              value={settings.about || ""}
              onChange={(e) => setSettings({ ...settings, about: e.target.value })}
              placeholder="Décrivez votre histoire, vos valeurs…"
              className="w-full rounded-lg border border-gray-300 bg-white text-gray-900 px-3 py-2 text-sm focus:border-[var(--primary)] focus:outline-none"
            />
          </div>
        </Card>

        <Card title="Mot de passe admin">
          <Field
            type="password"
            label="Nouveau mot de passe (laisser vide pour ne pas changer)"
            value={settings.adminPassword || ""}
            onChange={(v) => setSettings({ ...settings, adminPassword: v })}
          />
        </Card>

        {msg && <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700">{msg}</div>}
        {err && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{err}</div>}

        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 rounded-sm bg-[var(--primary)] px-6 py-3 text-xs font-semibold uppercase tracking-widest text-[var(--background)] hover:bg-[var(--primary-dark)] disabled:opacity-60"
        >
          <Save className="h-4 w-4" /> {saving ? "Enregistrement…" : "Enregistrer"}
        </button>
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="mb-4 font-serif text-xl">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: any; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-wider">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-300 bg-white text-gray-900 px-3 py-2 text-sm focus:border-[var(--primary)] focus:outline-none"
      />
    </div>
  );
}

const WEEKDAYS = ["Dim.", "Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam."];

function WeekdayPicker({ value, onChange }: { value: number[]; onChange: (v: number[]) => void }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-wider">Jours d&apos;ouverture</label>
      <p className="mb-3 text-xs text-gray-400">Décochez vos jours de fermeture (ex : dimanche et lundi).</p>
      <div className="flex flex-wrap gap-2">
        {WEEKDAYS.map((name, idx) => {
          const active = value.includes(idx);
          return (
            <button
              key={idx}
              type="button"
              onClick={() => {
                if (active) onChange(value.filter((v) => v !== idx));
                else onChange([...value, idx].sort());
              }}
              className={`rounded-full px-4 py-2 text-xs font-medium transition-colors ${
                active ? "bg-[var(--primary)] text-[var(--background)]" : "border border-gray-200 text-gray-500"
              }`}
            >
              {name}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ClosedDatesPicker({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const [newDate, setNewDate] = useState("");
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-wider">Jours fermés (fériés, congés…)</label>
      <div className="mb-3 flex gap-2">
        <input
          type="date"
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
          className="flex-1 rounded-lg border border-gray-300 bg-white text-gray-900 px-3 py-2 text-sm"
        />
        <button
          type="button"
          onClick={() => {
            if (!newDate || value.includes(newDate)) return;
            onChange([...value, newDate].sort());
            setNewDate("");
          }}
          className="rounded-sm bg-[var(--primary)] px-4 text-xs font-semibold uppercase tracking-widest text-[var(--background)]"
        >
          Ajouter
        </button>
      </div>
      {value.length === 0 ? (
        <p className="text-xs text-gray-400">Aucune date fermée</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {value.map((d) => (
            <span key={d} className="flex items-center gap-2 rounded-full bg-gray-50 px-3 py-1 text-xs">
              {d}
              <button type="button" onClick={() => onChange(value.filter((x) => x !== d))} className="text-red-600">
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
