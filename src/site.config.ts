// ═══════════════════════════════════════════════════════════════════
// SITE CONFIG — Ombre & Éclats (bijouterie pour hommes)
// ═══════════════════════════════════════════════════════════════════

export type Vertical = "patisserie" | "bijouterie" | "fleuriste" | "chocolaterie" | "generic";

export interface VariantConfig {
  key: "flavors" | "sizes";
  label: string;
  labelSingular: string;
  placeholder: string;
  hasImage: boolean;
  enabled: boolean;
}

export interface NavLink {
  href: string;
  label: string;
}

export interface SiteConfig {
  vertical: Vertical;
  brand: {
    name: string;
    tagline: string;
    banner: string;
    bannerSymbol: string;
    logoUrl: string;
    storagePrefix: string;
  };
  theme: {
    background: string;
    foreground: string;
    primary: string;
    primaryDark: string;
    accent: string;
    muted: string;
  };
  meta: { title: string; description: string };
  hero: { defaultTitle: string; defaultSubtitle: string; defaultImageUrl: string };
  contact: { email: string; phone: string; zone: string };
  navbar: { links: NavLink[] };
  product: {
    variant1: VariantConfig;
    variant2: VariantConfig;
    hasAllergens: boolean;
    allergensLabel: string;
    delayLabel: string;
    delayUnit: "days" | "hours";
  };
  features: {
    customOrders: boolean;
    pickupCalendar: boolean;
    postalDelivery: boolean;
    whatsappButton: boolean;
  };
  customOrderEvents?: string[];
  defaults: {
    slots: string[];
    openWeekdays: number[];
    minDelay: number;
  };
  legalPreset: "patisserie" | "bijouterie" | "generic";
}

// ═══════════════════════════════════════════════════════════════════
// OMBRE & ÉCLATS — bijouterie argent pour hommes
// Palette : ivoire chaud / noir absolu / beige taupe
// ═══════════════════════════════════════════════════════════════════

export const siteConfig: SiteConfig = {
  vertical: "bijouterie",

  brand: {
    name: "Ombre & Éclats",
    tagline: "Bijouterie d'Homme",
    banner: "ARGENT MASSIF · PIÈCES FAÇONNÉES À LA MAIN · LIVRAISON OFFERTE",
    bannerSymbol: "✧",
    logoUrl: "/logo.png",
    storagePrefix: "ombre-eclats",
  },

  theme: {
    background: "#0a0a0a",     // noir absolu (comme le logo)
    foreground: "#f5f1e8",     // crème légèrement chaud (lisible, luxe)
    primary: "#c9c0ad",        // argenté chaud / champagne (boutons, liens)
    primaryDark: "#e8dfc8",    // hover plus clair
    accent: "#2a2a2a",          // gris très foncé (bordures, cartes)
    muted: "#141414",           // noir charbon (sections, cards)
  },

  meta: {
    title: "Ombre & Éclats — Bijouterie d'Homme en Argent Massif",
    description:
      "Bagues, chevalières et gourmettes en argent massif 925, façonnées à la main. Livraison en 48h en France.",
  },

  hero: {
    defaultTitle: "L'éclat discret, affirmé",
    defaultSubtitle:
      "Bagues, chevalières et gourmettes en argent massif 925 — pièces façonnées à la main dans notre atelier.",
    defaultImageUrl:
      "https://images.unsplash.com/photo-1543294001-f7cd5d7fb516?w=1600&auto=format&fit=crop&q=85",
  },

  contact: {
    email: "contact@ombre-eclats.fr",
    phone: "06 24 18 52 07",
    zone: "Livraison France & Europe",
  },

  navbar: {
    links: [
      { href: "/", label: "Accueil" },
      { href: "/catalogue", label: "Collections" },
      { href: "/sur-mesure", label: "Sur-mesure" },
      { href: "/a-propos", label: "Maison" },
      { href: "/contact", label: "Contact" },
    ],
  },

  product: {
    variant1: {
      key: "flavors",
      label: "Finition",
      labelSingular: "finition",
      placeholder: "Nom de la finition (Poli, Brossé, Noirci…)",
      hasImage: true,
      enabled: true,
    },
    variant2: {
      key: "sizes",
      label: "Taille",
      labelSingular: "taille",
      placeholder: "Taille (ex: 58, 60, 19cm…)",
      hasImage: false,
      enabled: true,
    },
    hasAllergens: true,
    allergensLabel: "Matière & entretien",
    delayLabel: "Délai d'expédition",
    delayUnit: "days",
  },

  features: {
    customOrders: true,
    pickupCalendar: false,
    postalDelivery: true,
    whatsappButton: true,
  },

  customOrderEvents: [
    "Gravure initiales",
    "Chevalière aux armoiries",
    "Pièce unique sur-mesure",
    "Alliance homme",
    "Cadeau personnalisé",
    "Autre",
  ],

  defaults: {
    slots: [],
    openWeekdays: [1, 2, 3, 4, 5, 6],
    minDelay: 2,
  },

  legalPreset: "bijouterie",
};
