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
    socialProof: boolean;
    instagramFeed: boolean;
    aiAdvisor: boolean;
  };
  social: {
    instagram?: string;
    tiktok?: string;
    facebook?: string;
    instagramHandle?: string;
  };
  trust: {
    rating: number;
    reviewsCount: number;
    reviewsSource: string;
  };
  testimonials: { name: string; text: string; rating: number }[];
  instagramShots: string[];
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
    socialProof: true,
    instagramFeed: true,
    aiAdvisor: true,
  },

  social: {
    instagram: "https://instagram.com/ombreeteclats",
    tiktok: "https://tiktok.com/@ombreeteclats",
    instagramHandle: "@ombreeteclats",
  },

  trust: {
    rating: 4.8,
    reviewsCount: 214,
    reviewsSource: "Avis clients vérifiés",
  },

  testimonials: [
    {
      name: "Karim B.",
      text: "Chevalière reçue en 2 jours, la finition est impeccable. Le poinçon argent 925 est bien visible, exactement ce que je cherchais.",
      rating: 5,
    },
    {
      name: "Nicolas M.",
      text: "Gourmette gravée pour mon fils, service client très réactif sur WhatsApp pour ajuster la taille. Qualité au rendez-vous.",
      rating: 5,
    },
    {
      name: "Adam T.",
      text: "Deuxième commande chez eux. Le rapport qualité-prix est excellent pour de l'argent massif fait main.",
      rating: 4,
    },
  ],

  instagramShots: [
    "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=600&auto=format&fit=crop&q=80",
  ],

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
