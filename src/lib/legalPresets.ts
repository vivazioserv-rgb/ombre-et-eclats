// Presets de textes légaux et de présentation, réutilisables entre verticales.
// Le seed et les pages lisent ces presets via siteConfig.legalPreset.

import { siteConfig } from "@/site.config";

export interface LegalPreset {
  about: string;
  cgv: string;
  rgpd: string;
  cookiesPolicy: string;
}

const B = () => siteConfig.brand.name;

const patisserie: LegalPreset = {
  about: `${B()} est née d'une passion pour les saveurs authentiques et le savoir-faire artisanal. Chaque création est réalisée à la main, avec des ingrédients soigneusement sélectionnés : beurre AOP, chocolat de couverture Valrhona, fruits frais de saison et vanille de Madagascar.

Notre philosophie est simple : offrir des pâtisseries d'exception, préparées sur commande pour garantir une fraîcheur absolue. Du classique revisité aux créations originales, chaque gâteau raconte une histoire gourmande.

Basée en Île-de-France, ${B()} propose un service de retrait sur rendez-vous. Commandez en ligne, choisissez votre créneau, et venez récupérer votre commande fraîchement préparée.`,

  cgv: `Toute commande doit être passée au minimum 48h à l'avance. Les commandes sont à retirer aux horaires convenus. En cas d'annulation, merci de nous prévenir au moins 24h avant la date de retrait. Les produits contiennent des allergènes — consultez les fiches produits. Aucun remboursement après retrait.`,

  rgpd: `Vos données personnelles (nom, email, téléphone) sont collectées uniquement pour le traitement de vos commandes et ne sont jamais transmises à des tiers. Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données. Pour exercer ces droits, contactez-nous à ${siteConfig.contact.email}.`,

  cookiesPolicy: `Ce site utilise uniquement des cookies essentiels au fonctionnement (panier, session admin). Aucun cookie de tracking ou publicitaire n'est utilisé.`,
};

const bijouterie: LegalPreset = {
  about: `${B()} crée des bijoux pensés pour l'homme moderne : pièces affirmées, matières nobles, lignes intemporelles. Chaque création est fabriquée à la main dans notre atelier, en argent massif 925, acier chirurgical ou or 18 carats.

Nous croyons qu'un bijou bien porté raconte une histoire. Chaque pièce de la collection est dessinée pour durer — finitions polies ou brossées, résistance à l'usage quotidien, élégance discrète ou affirmée.

${B()} livre partout en France et en Europe sous 2 à 5 jours ouvrés. Chaque commande est expédiée dans un écrin prêt à offrir.`,

  cgv: `Les commandes sont expédiées sous 2 à 5 jours ouvrés après réception du paiement. Les bijoux personnalisés (gravure, sur-mesure) nécessitent un délai supplémentaire de 5 à 10 jours. Conformément à la loi, vous disposez d'un droit de rétractation de 14 jours — hors pièces personnalisées. Les articles doivent être retournés dans leur emballage d'origine, non portés. Garantie 2 ans contre les défauts de fabrication.`,

  rgpd: `${B()} respecte strictement vos données personnelles. Nom, email, adresse et téléphone sont utilisés uniquement pour traiter et livrer votre commande. Aucune donnée n'est transmise à des tiers hors prestataires logistiques (transporteur) et de paiement (Stripe). Conformément au RGPD, vous pouvez demander l'accès, la rectification ou la suppression de vos données à ${siteConfig.contact.email}.`,

  cookiesPolicy: `Ce site utilise uniquement des cookies essentiels au fonctionnement (panier, session admin). Aucun cookie de tracking ou publicitaire n'est utilisé.`,
};

const generic: LegalPreset = {
  about: `Bienvenue chez ${B()}. Découvrez notre sélection de produits soigneusement choisis.`,
  cgv: `Les conditions générales de vente s'appliquent à toute commande passée sur ce site.`,
  rgpd: `Vos données personnelles sont traitées conformément au RGPD. Contactez-nous à ${siteConfig.contact.email} pour exercer vos droits.`,
  cookiesPolicy: `Ce site utilise uniquement des cookies essentiels au fonctionnement.`,
};

export const legalPresets: Record<string, LegalPreset> = {
  patisserie,
  bijouterie,
  generic,
};

export function getLegalPreset(): LegalPreset {
  return legalPresets[siteConfig.legalPreset] || legalPresets.generic;
}
