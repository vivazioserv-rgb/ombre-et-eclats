"use client";
import { processImage, ProcessOptions } from "./imageProcess";
import { TOKEN_KEY } from "./storage";

function authHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const t = localStorage.getItem(TOKEN_KEY);
  return t ? { Authorization: `Bearer ${t}` } : {};
}

export async function adminFetch(url: string, init?: RequestInit) {
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export const IMAGE_PRESETS = {
  product: { maxDim: 1200, quality: 0.85, square: false } as ProcessOptions,
  square: { maxDim: 800, quality: 0.85, square: true } as ProcessOptions,
  thumbnail: { maxDim: 400, quality: 0.85, square: true } as ProcessOptions,
  hero: { maxDim: 1600, quality: 0.88, square: false } as ProcessOptions,
};

export async function uploadImage(file: File, preset: ProcessOptions = IMAGE_PRESETS.product): Promise<string> {
  const processed = await processImage(file, preset);
  const presign = await adminFetch("/api/upload", {
    method: "POST",
    body: JSON.stringify({ filename: processed.name }),
  });
  const put = await fetch(presign.uploadUrl, { method: "PUT", body: processed });
  if (!put.ok) throw new Error("Échec upload");
  return presign.url as string;
}
