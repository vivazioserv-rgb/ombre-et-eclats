"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { siteConfig } from "@/site.config";
import { TOKEN_KEY } from "@/lib/storage";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      localStorage.setItem(TOKEN_KEY, data.token);
      router.push("/admin");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-6 flex flex-col items-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#f0f0f5] text-[#6c5ce7]">
            <Lock className="h-5 w-5" />
          </div>
          <h1 className="font-serif text-2xl text-gray-900">Admin {siteConfig.brand.name}</h1>
          <p className="mt-1 text-xs text-gray-500">Connectez-vous pour continuer</p>
        </div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-700">Mot de passe</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full rounded-lg border border-gray-300 bg-white text-gray-900 px-3 py-2 text-sm focus:border-[#6c5ce7] focus:outline-none"
        />
        {error && <div className="mt-3 rounded-lg bg-red-50 p-2 text-xs text-red-600">{error}</div>}
        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full rounded-sm bg-[#6c5ce7] py-3 text-xs font-semibold uppercase tracking-widest text-white hover:bg-[#5a4bd1] disabled:opacity-60"
        >
          {loading ? "Connexion…" : "Se connecter"}
        </button>
      </form>
    </main>
  );
}
