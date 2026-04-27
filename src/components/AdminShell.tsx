"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LayoutDashboard, Package, Tag, ClipboardList, Settings as SettingsIcon, LogOut, Home } from "lucide-react";
import { siteConfig } from "@/site.config";
import { TOKEN_KEY } from "@/lib/storage";

const nav = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/produits", label: "Produits", icon: Package },
  { href: "/admin/categories", label: "Catégories", icon: Tag },
  { href: "/admin/commandes", label: "Commandes", icon: ClipboardList },
  { href: "/admin/parametres", label: "Paramètres", icon: SettingsIcon },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (pathname === "/admin/login") {
      setChecking(false);
      return;
    }
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      router.replace("/admin/login");
    } else {
      setChecking(false);
    }
  }, [pathname, router]);

  if (pathname === "/admin/login") return <>{children}</>;
  if (checking) return <div className="flex min-h-screen items-center justify-center">Chargement…</div>;

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    router.push("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-[var(--muted)]">
      <aside className="w-64 border-r border-[var(--accent)] bg-white">
        <div className="border-b border-[var(--accent)] p-6">
          <Link href="/admin" className="font-serif text-2xl text-[var(--primary-dark)]">
            {siteConfig.brand.name} Admin
          </Link>
        </div>
        <nav className="space-y-1 p-3">
          {nav.map((n) => {
            const active = pathname === n.href;
            const Icon = n.icon;
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-[var(--primary)] text-white"
                    : "text-[var(--foreground)]/80 hover:bg-[var(--muted)]"
                }`}
              >
                <Icon className="h-4 w-4" />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-[var(--accent)] p-3">
          <Link href="/" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-[var(--foreground)]/60 hover:bg-[var(--muted)]">
            <Home className="h-4 w-4" /> Voir le site
          </Link>
          <button onClick={logout} className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50">
            <LogOut className="h-4 w-4" /> Déconnexion
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-10">{children}</main>
    </div>
  );
}

export function authHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const t = localStorage.getItem(TOKEN_KEY);
  return t ? { Authorization: `Bearer ${t}` } : {};
}
