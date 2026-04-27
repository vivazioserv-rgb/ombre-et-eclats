export type Category = { _id: string; name: string; emoji?: string; imageUrl?: string; active?: boolean };
export type Product = {
  _id: string;
  name: string;
  shortDesc?: string;
  longDesc?: string;
  basePrice: number;
  delay?: number;
  isNew?: boolean;
  status?: string;
  imageUrl?: string;
  images?: string[];
  allergens?: string;
  category?: Category | null;
  flavors?: { _id: string; name: string; imageUrl?: string; surcharge: number }[];
  sizes?: { _id: string; name: string; surcharge: number }[];
};
export type SettingsData = {
  brandName: string;
  brandTagline: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroImageUrl?: string;
  email?: string;
  phone?: string;
  zone?: string;
  slots?: string[];
  openDays?: string[];
  minDelay?: number;
  cgv?: string;
  rgpd?: string;
  cookiesPolicy?: string;
};

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { cache: "no-store", ...init });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  getProducts: () => fetchJson<Product[]>("/api/products"),
  getProduct: (id: string) => fetchJson<Product>(`/api/products/${id}`),
  getCategories: () => fetchJson<Category[]>("/api/categories"),
  getSettings: () => fetchJson<SettingsData>("/api/settings"),
  createOrder: (data: any) =>
    fetchJson("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }),
  login: (password: string) =>
    fetchJson<{ token: string }>("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    }),
};

export async function loadHomeData(baseUrl: string) {
  const [pRes, cRes, sRes] = await Promise.all([
    fetch(`${baseUrl}/api/products`, { cache: "no-store" }),
    fetch(`${baseUrl}/api/categories`, { cache: "no-store" }),
    fetch(`${baseUrl}/api/settings`, { cache: "no-store" }),
  ]);
  return {
    products: (await pRes.json()) as Product[],
    categories: (await cRes.json()) as Category[],
    settings: (await sRes.json()) as SettingsData,
  };
}
