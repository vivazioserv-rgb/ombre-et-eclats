import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDb } from "@/lib/mongoose";
import { Settings, Category, Product, Order } from "@/lib/models";
import { siteConfig } from "@/site.config";
import { getLegalPreset } from "@/lib/legalPresets";

export async function POST() {
  await connectDb();

  await Product.deleteMany({});
  await Category.deleteMany({});
  await Order.deleteMany({});

  const existingSettings = await Settings.findOne();
  if (!existingSettings) {
    const legal = getLegalPreset();
    await Settings.create({
      brandName: siteConfig.brand.name,
      brandTagline: siteConfig.brand.tagline,
      heroTitle: siteConfig.hero.defaultTitle,
      heroSubtitle: siteConfig.hero.defaultSubtitle,
      heroImageUrl: siteConfig.hero.defaultImageUrl,
      email: siteConfig.contact.email,
      phone: siteConfig.contact.phone,
      zone: siteConfig.contact.zone,
      adminPassword: await bcrypt.hash("Admin1234!", 10),
      slots: siteConfig.defaults.slots,
      openWeekdays: siteConfig.defaults.openWeekdays,
      closedDates: [],
      minDelay: siteConfig.defaults.minDelay,
      about: legal.about,
      cgv: legal.cgv,
      rgpd: legal.rgpd,
      cookiesPolicy: legal.cookiesPolicy,
    });
  }

  const cats = await Category.insertMany([
    {
      name: "Bagues",
      emoji: "◯",
      imageUrl:
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=85",
    },
    {
      name: "Chevalières",
      emoji: "⬟",
      imageUrl:
        "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&auto=format&fit=crop&q=85",
    },
    {
      name: "Gourmettes",
      emoji: "⎓",
      imageUrl:
        "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800&auto=format&fit=crop&q=85",
    },
  ]);

  const catMap = Object.fromEntries(cats.map((c: any) => [c.name, c._id]));

  const finitions = {
    poli: {
      name: "Poli brillant",
      surcharge: 0,
      imageUrl: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&auto=format&fit=crop&q=80",
    },
    brosse: {
      name: "Brossé mat",
      surcharge: 0,
      imageUrl: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=400&auto=format&fit=crop&q=80",
    },
    noirci: {
      name: "Argent noirci",
      surcharge: 15,
      imageUrl: "https://images.unsplash.com/photo-1608042314453-ae338d80c427?w=400&auto=format&fit=crop&q=80",
    },
    orose: {
      name: "Plaqué or rose",
      surcharge: 40,
      imageUrl: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=400&auto=format&fit=crop&q=80",
    },
  };

  const tailles_bague = [
    { name: "Taille 52", surcharge: 0 },
    { name: "Taille 54", surcharge: 0 },
    { name: "Taille 56", surcharge: 0 },
    { name: "Taille 58", surcharge: 0 },
    { name: "Taille 60", surcharge: 0 },
    { name: "Taille 62", surcharge: 0 },
    { name: "Taille 64", surcharge: 5 },
    { name: "Taille 66", surcharge: 5 },
  ];

  const tailles_gourmette = [
    { name: "19 cm", surcharge: 0 },
    { name: "20 cm", surcharge: 0 },
    { name: "21 cm", surcharge: 10 },
    { name: "22 cm", surcharge: 15 },
  ];

  await Product.insertMany([
    // ── BAGUES ──────────────────────────────────────────────
    {
      name: "Bague Stratum",
      shortDesc: "Anneau jonc plat en argent 925, ligne épurée et contemporaine",
      longDesc:
        "Une bague jonc plate de 6 mm, travaillée dans un argent 925 massif. Ses arêtes légèrement biseautées captent la lumière sans ostentation. Une pièce d'une élégance brute, pensée pour être portée au quotidien, seule ou associée. Poids ~9 g.",
      basePrice: 79,
      delay: 3,
      isNew: true,
      status: "available",
      category: catMap["Bagues"],
      allergens: "Argent massif 925 · Nettoyer avec un chiffon doux · Éviter l'eau chlorée",
      imageUrl:
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1200&auto=format&fit=crop&q=85",
      images: [
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1200&auto=format&fit=crop&q=85",
        "https://images.unsplash.com/photo-1596944946297-0e24a7a79386?w=1200&auto=format&fit=crop&q=85",
      ],
      flavors: [finitions.poli, finitions.brosse, finitions.noirci],
      sizes: tailles_bague,
    },
    {
      name: "Bague Onyx Carré",
      shortDesc: "Chevalière fine sertie d'un onyx noir carré, argent massif",
      longDesc:
        "Une pièce affirmée : un onyx noir taillé carré de 8 mm, serti dans un anneau d'argent 925 massif. L'onyx, pierre protectrice par tradition, joue ici le rôle de contraste parfait avec l'éclat du métal. Finition polie miroir sur le corps, mat autour du sertissage. Poids ~12 g.",
      basePrice: 129,
      delay: 5,
      isNew: true,
      status: "available",
      category: catMap["Bagues"],
      allergens: "Argent massif 925 · Pierre naturelle onyx · Retirer avant contact avec produits chimiques",
      imageUrl:
        "https://images.unsplash.com/photo-1598560917807-1bae44bd2be8?w=1200&auto=format&fit=crop&q=85",
      images: [
        "https://images.unsplash.com/photo-1598560917807-1bae44bd2be8?w=1200&auto=format&fit=crop&q=85",
        "https://images.unsplash.com/photo-1603974372039-adc49044b6bd?w=1200&auto=format&fit=crop&q=85",
      ],
      flavors: [finitions.poli, finitions.noirci],
      sizes: tailles_bague,
    },
    {
      name: "Bague Torsade",
      shortDesc: "Anneau en argent 925, deux brins torsadés à la main",
      longDesc:
        "Deux brins de fil d'argent massif torsadés à la main pour créer un motif en spirale vivant. Chaque bague est unique, la torsade n'est jamais deux fois identique. Une pièce graphique qui accroche l'œil sans lourdeur. Poids ~8 g.",
      basePrice: 89,
      delay: 4,
      isNew: false,
      status: "available",
      category: catMap["Bagues"],
      allergens: "Argent massif 925 · Nettoyage au chiffon doux recommandé",
      imageUrl:
        "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=1200&auto=format&fit=crop&q=85",
      images: [
        "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=1200&auto=format&fit=crop&q=85",
      ],
      flavors: [finitions.poli, finitions.brosse],
      sizes: tailles_bague,
    },
    {
      name: "Bague Sceau Romain",
      shortDesc: "Bague gravée d'un motif géométrique inspiré des sceaux antiques",
      longDesc:
        "Inspirée des bagues-sceaux romaines, cette pièce arbore un plateau carré gravé d'un motif géométrique signature Ombre & Éclats. Elle se porte comme un talisman discret — un repère personnel qui traverse les décennies. Gravure personnalisable sur demande (+20€, voir page sur-mesure).",
      basePrice: 109,
      delay: 5,
      isNew: false,
      status: "available",
      category: catMap["Bagues"],
      allergens: "Argent massif 925 poinçonné",
      imageUrl:
        "https://images.unsplash.com/photo-1596944946297-0e24a7a79386?w=1200&auto=format&fit=crop&q=85",
      images: [
        "https://images.unsplash.com/photo-1596944946297-0e24a7a79386?w=1200&auto=format&fit=crop&q=85",
      ],
      flavors: [finitions.poli, finitions.noirci, finitions.orose],
      sizes: tailles_bague,
    },
    {
      name: "Alliance Homme Moderne",
      shortDesc: "Anneau large 8 mm, argent 925, finition brossée contemporaine",
      longDesc:
        "Une alliance homme d'envergure : 8 mm de largeur, 2,5 mm d'épaisseur, une silhouette confortable grâce à l'intérieur bombé. La finition brossée neutre en fait une pièce intemporelle, compatible avec tous les styles. Gravure intérieure offerte (voir page sur-mesure).",
      basePrice: 149,
      delay: 7,
      isNew: true,
      status: "available",
      category: catMap["Bagues"],
      allergens: "Argent massif 925 · Intérieur confort · Garantie 2 ans",
      imageUrl:
        "https://images.unsplash.com/photo-1535556116002-6281ff3e9f36?w=1200&auto=format&fit=crop&q=85",
      images: [
        "https://images.unsplash.com/photo-1535556116002-6281ff3e9f36?w=1200&auto=format&fit=crop&q=85",
        "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=1200&auto=format&fit=crop&q=85",
      ],
      flavors: [finitions.brosse, finitions.poli],
      sizes: tailles_bague,
    },
    {
      name: "Bague Anneau Fin Martelé",
      shortDesc: "Jonc fin martelé main, ligne discrète et texturée",
      longDesc:
        "Un jonc de 3 mm, entièrement martelé à la main au marteau d'orfèvre. Chaque facette accroche la lumière différemment, donnant une texture vivante rare dans les séries industrielles. Idéale seule ou en superposition. Poids ~5 g.",
      basePrice: 59,
      delay: 3,
      isNew: false,
      status: "available",
      category: catMap["Bagues"],
      allergens: "Argent massif 925 martelé",
      imageUrl:
        "https://images.unsplash.com/photo-1611107683227-e9060eccd846?w=1200&auto=format&fit=crop&q=85",
      images: [
        "https://images.unsplash.com/photo-1611107683227-e9060eccd846?w=1200&auto=format&fit=crop&q=85",
      ],
      flavors: [finitions.poli, finitions.brosse, finitions.noirci],
      sizes: tailles_bague,
    },

    // ── CHEVALIÈRES ────────────────────────────────────────
    {
      name: "Chevalière Écusson Classique",
      shortDesc: "Chevalière ovale plateau lisse, argent massif 925",
      longDesc:
        "La chevalière homme dans sa forme la plus pure : un plateau ovale de 18×13 mm, parfaitement lisse, prêt à recevoir vos initiales ou vos armoiries (gravure proposée en sur-mesure). Épaule pleine, anneau généreux. Une pièce de patrimoine à transmettre. Poids ~22 g.",
      basePrice: 189,
      delay: 5,
      isNew: false,
      status: "available",
      category: catMap["Chevalières"],
      allergens: "Argent massif 925 poinçonné · Gravure disponible sur demande",
      imageUrl:
        "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=1200&auto=format&fit=crop&q=85",
      images: [
        "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=1200&auto=format&fit=crop&q=85",
        "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=1200&auto=format&fit=crop&q=85",
      ],
      flavors: [finitions.poli, finitions.brosse, finitions.noirci],
      sizes: tailles_bague,
    },
    {
      name: "Chevalière Carrée Brutaliste",
      shortDesc: "Plateau carré 14 mm, lignes géométriques affirmées",
      longDesc:
        "Une chevalière contemporaine au plateau carré de 14 mm, entouré d'un chanfrein prononcé qui accroche la lumière sur ses arêtes. Inspirée de l'architecture brutaliste, elle impose une présence masculine affirmée tout en restant d'une géométrie rigoureuse. Poids ~18 g.",
      basePrice: 169,
      delay: 5,
      isNew: true,
      status: "available",
      category: catMap["Chevalières"],
      allergens: "Argent massif 925",
      imageUrl:
        "https://images.unsplash.com/photo-1608042314453-ae338d80c427?w=1200&auto=format&fit=crop&q=85",
      images: [
        "https://images.unsplash.com/photo-1608042314453-ae338d80c427?w=1200&auto=format&fit=crop&q=85",
      ],
      flavors: [finitions.poli, finitions.brosse, finitions.noirci],
      sizes: tailles_bague,
    },
    {
      name: "Chevalière Hexagonale",
      shortDesc: "Plateau hexagonal 15 mm, finition mat, style contemporain",
      longDesc:
        "Forme hexagonale rare en bijouterie homme, cette chevalière affirme une esthétique moderne sans renier le format traditionnel. Le plateau mat crée un contraste subtil avec l'anneau poli. Une pièce qui se porte au quotidien ou pour les occasions. Poids ~20 g.",
      basePrice: 179,
      delay: 5,
      isNew: true,
      status: "available",
      category: catMap["Chevalières"],
      allergens: "Argent massif 925",
      imageUrl:
        "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=1200&auto=format&fit=crop&q=85",
      images: [
        "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=1200&auto=format&fit=crop&q=85",
      ],
      flavors: [finitions.brosse, finitions.noirci],
      sizes: tailles_bague,
    },
    {
      name: "Chevalière Onyx Ovale",
      shortDesc: "Chevalière ovale sertie d'un onyx noir naturel bombé",
      longDesc:
        "Une chevalière traditionnelle réinventée : au centre, un onyx noir bombé de 15×11 mm, poli miroir, serti dans un anneau en argent massif. La pierre noire tranche avec l'éclat de l'argent pour un résultat d'une sobriété élégante. Pièce portée aussi bien au costume qu'avec une chemise ouverte.",
      basePrice: 219,
      delay: 7,
      isNew: false,
      status: "available",
      category: catMap["Chevalières"],
      allergens: "Argent massif 925 · Onyx naturel · Éviter chocs et produits chimiques",
      imageUrl:
        "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1200&auto=format&fit=crop&q=85",
      images: [
        "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1200&auto=format&fit=crop&q=85",
      ],
      flavors: [finitions.poli, finitions.noirci],
      sizes: tailles_bague,
    },
    {
      name: "Chevalière Monogramme Sur-Mesure",
      shortDesc: "Plateau ovale avec vos initiales gravées à la main",
      longDesc:
        "La chevalière personnelle par excellence. Nous gravons à la main vos initiales ou votre monogramme sur un plateau ovale de 18×13 mm. Trois styles typographiques au choix (classique serif, moderne sans-serif, calligraphie). La gravure devient avec le temps le sceau de votre signature. Commande sur-mesure, compter 10 jours.",
      basePrice: 249,
      delay: 10,
      isNew: false,
      status: "available",
      category: catMap["Chevalières"],
      allergens: "Argent massif 925 · Gravure main · Style typographique à préciser en note",
      imageUrl:
        "https://images.unsplash.com/photo-1603566541830-a1ea21baeca7?w=1200&auto=format&fit=crop&q=85",
      images: [
        "https://images.unsplash.com/photo-1603566541830-a1ea21baeca7?w=1200&auto=format&fit=crop&q=85",
      ],
      flavors: [finitions.poli, finitions.brosse, finitions.noirci],
      sizes: tailles_bague,
    },

    // ── GOURMETTES ─────────────────────────────────────────
    {
      name: "Gourmette Figaro",
      shortDesc: "Maillage Figaro argent 925, largeur 7 mm",
      longDesc:
        "La gourmette classique dans sa déclinaison la plus aboutie : maillage Figaro (3 anneaux ronds + 1 long) en argent 925 massif, largeur 7 mm. Fermoir mousqueton renforcé. Une gourmette polyvalente, à porter serrée au poignet ou un peu lâche. Poids ~32 g en 20 cm.",
      basePrice: 139,
      delay: 3,
      isNew: false,
      status: "available",
      category: catMap["Gourmettes"],
      allergens: "Argent massif 925 · Fermoir mousqueton · Entretien au chiffon doux",
      imageUrl:
        "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=1200&auto=format&fit=crop&q=85",
      images: [
        "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=1200&auto=format&fit=crop&q=85",
        "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=1200&auto=format&fit=crop&q=85",
      ],
      flavors: [finitions.poli, finitions.brosse],
      sizes: tailles_gourmette,
    },
    {
      name: "Gourmette Américaine Plate",
      shortDesc: "Maillage plat 10 mm, argent 925, style affirmé",
      longDesc:
        "Une gourmette américaine large de 10 mm, à maillons plats, pour un look affirmé inspiré des années 90. Argent massif 925, fermoir en T. Le poids et la présence au poignet sont sa signature. Poids ~65 g en 20 cm.",
      basePrice: 229,
      delay: 5,
      isNew: true,
      status: "available",
      category: catMap["Gourmettes"],
      allergens: "Argent massif 925 · Poids important (~65g)",
      imageUrl:
        "https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=1200&auto=format&fit=crop&q=85",
      images: [
        "https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=1200&auto=format&fit=crop&q=85",
      ],
      flavors: [finitions.poli, finitions.brosse, finitions.noirci],
      sizes: tailles_gourmette,
    },
    {
      name: "Gourmette Plaque Identité",
      shortDesc: "Gourmette avec plaque centrale gravable, maillage fin",
      longDesc:
        "Le classique de la bijouterie homme : gourmette à maillage jaseron fin avec une plaque rectangulaire centrale (35×10 mm) prête à recevoir un prénom, une date ou des initiales. Gravure offerte — précisez le texte souhaité en note de commande. Fermoir mousqueton. Poids ~28 g en 20 cm.",
      basePrice: 119,
      delay: 5,
      isNew: false,
      status: "available",
      category: catMap["Gourmettes"],
      allergens: "Argent massif 925 · Gravure plaque offerte (précisez en note)",
      imageUrl:
        "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=1200&auto=format&fit=crop&q=85",
      images: [
        "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=1200&auto=format&fit=crop&q=85",
      ],
      flavors: [finitions.poli, finitions.brosse],
      sizes: tailles_gourmette,
    },
    {
      name: "Gourmette Maillage Forçat",
      shortDesc: "Maillage forçat régulier, 5 mm, sobriété intemporelle",
      longDesc:
        "Maillage forçat classique, anneaux ovales réguliers de 5 mm. Une gourmette d'une grande sobriété, qui se glisse sous une manchette de chemise sans contrainte. Parfaite pour une première gourmette ou un cadeau qui traversera les années. Poids ~20 g en 20 cm.",
      basePrice: 95,
      delay: 3,
      isNew: false,
      status: "available",
      category: catMap["Gourmettes"],
      allergens: "Argent massif 925",
      imageUrl:
        "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=1200&auto=format&fit=crop&q=85",
      images: [
        "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=1200&auto=format&fit=crop&q=85",
      ],
      flavors: [finitions.poli, finitions.brosse],
      sizes: tailles_gourmette,
    },
    {
      name: "Gourmette Gravée Chaîne Cubaine",
      shortDesc: "Maillage cubain 6 mm, chaque maillon ciselé à la main",
      longDesc:
        "Maillage cubain (ou Miami) de 6 mm de large, travaillé à la main : chaque maillon est individuellement ciselé sur sa face externe, créant un jeu de facettes qui attrape la lumière sous tous les angles. Le résultat : une gourmette présente sans être ostentatoire. Fermoir en T en argent massif. Poids ~38 g en 20 cm.",
      basePrice: 189,
      delay: 7,
      isNew: true,
      status: "available",
      category: catMap["Gourmettes"],
      allergens: "Argent massif 925 · Ciselure main · Chiffon de polissage fourni",
      imageUrl:
        "https://images.unsplash.com/photo-1613843574279-19baf4fe0b71?w=1200&auto=format&fit=crop&q=85",
      images: [
        "https://images.unsplash.com/photo-1613843574279-19baf4fe0b71?w=1200&auto=format&fit=crop&q=85",
      ],
      flavors: [finitions.poli, finitions.noirci],
      sizes: tailles_gourmette,
    },
  ]);

  const products = await Product.find().lean();
  const pMap = Object.fromEntries(products.map((p: any) => [p.name, p]));

  await Order.insertMany([
    {
      client: "Antoine Valentin",
      email: "antoine.v@gmail.com",
      phone: "06 12 34 56 78",
      items: [
        { productId: pMap["Chevalière Écusson Classique"]?._id, name: "Chevalière Écusson Classique", flavor: "Poli brillant", size: "Taille 60", quantity: 1, price: 189 },
      ],
      total: 189,
      mode: "delivery",
      address: "14 rue de Turenne, 75003 Paris",
      status: "confirmed",
      paymentStatus: "paid",
      createdAt: new Date("2026-04-24T14:30:00"),
    },
    {
      client: "Julien Rochefort",
      email: "j.rochefort@outlook.fr",
      phone: "07 98 76 54 32",
      items: [
        { productId: pMap["Bague Stratum"]?._id, name: "Bague Stratum", flavor: "Brossé mat", size: "Taille 58", quantity: 1, price: 79 },
        { productId: pMap["Gourmette Figaro"]?._id, name: "Gourmette Figaro", flavor: "Poli brillant", size: "20 cm", quantity: 1, price: 139 },
      ],
      total: 218,
      mode: "delivery",
      address: "32 avenue Jean Jaurès, 69007 Lyon",
      status: "ready",
      paymentStatus: "paid",
      createdAt: new Date("2026-04-23T09:15:00"),
    },
    {
      client: "Karim El Amrani",
      email: "karim.ea@hotmail.fr",
      phone: "06 55 44 33 22",
      items: [
        { productId: pMap["Chevalière Monogramme Sur-Mesure"]?._id, name: "Chevalière Monogramme Sur-Mesure", flavor: "Argent noirci", size: "Taille 62", quantity: 1, price: 264 },
      ],
      total: 264,
      mode: "delivery",
      address: "8 rue du Commerce, 13001 Marseille",
      note: "Gravure : initiales K.E.A. en typographie classique serif",
      status: "pending",
      paymentStatus: "unpaid",
      createdAt: new Date("2026-04-26T08:00:00"),
    },
    {
      client: "Mathieu Dumont",
      email: "mathieu.dumont@proton.me",
      items: [
        { productId: pMap["Alliance Homme Moderne"]?._id, name: "Alliance Homme Moderne", flavor: "Brossé mat", size: "Taille 60", quantity: 1, price: 149 },
      ],
      total: 149,
      mode: "delivery",
      address: "5 boulevard Voltaire, 75011 Paris",
      note: "Gravure intérieure : \"M & L 06/26\"",
      status: "confirmed",
      paymentStatus: "paid",
      createdAt: new Date("2026-04-25T18:45:00"),
    },
    {
      client: "Alexandre Mercier",
      email: "a.mercier@wanadoo.fr",
      phone: "06 11 22 33 44",
      items: [
        { productId: pMap["Gourmette Américaine Plate"]?._id, name: "Gourmette Américaine Plate", flavor: "Argent noirci", size: "21 cm", quantity: 1, price: 239 },
        { productId: pMap["Bague Onyx Carré"]?._id, name: "Bague Onyx Carré", flavor: "Argent noirci", size: "Taille 62", quantity: 1, price: 129 },
      ],
      total: 368,
      mode: "delivery",
      address: "22 rue Saint-Honoré, 75001 Paris",
      status: "pending",
      paymentStatus: "paid",
      createdAt: new Date("2026-04-26T11:20:00"),
    },
    {
      client: "Thomas Lefebvre",
      email: "thomas.l@gmail.com",
      phone: "07 66 77 88 99",
      items: [
        { productId: pMap["Bague Sceau Romain"]?._id, name: "Bague Sceau Romain", flavor: "Poli brillant", size: "Taille 56", quantity: 1, price: 109 },
        { productId: pMap["Gourmette Plaque Identité"]?._id, name: "Gourmette Plaque Identité", flavor: "Poli brillant", size: "20 cm", quantity: 1, price: 119 },
      ],
      total: 228,
      mode: "delivery",
      address: "14 cours Clemenceau, 33000 Bordeaux",
      note: "Gravure plaque : \"Thomas 1995\"",
      status: "delivered",
      paymentStatus: "paid",
      createdAt: new Date("2026-04-20T10:30:00"),
    },
    {
      client: "Samir Benali",
      email: "samir.bzd@yahoo.fr",
      phone: "06 99 88 77 66",
      items: [
        { productId: pMap["Chevalière Hexagonale"]?._id, name: "Chevalière Hexagonale", flavor: "Argent noirci", size: "Taille 62", quantity: 1, price: 179 },
      ],
      total: 179,
      mode: "delivery",
      address: "3 rue Berthelot, 69007 Lyon",
      status: "confirmed",
      paymentStatus: "paid",
      createdAt: new Date("2026-04-22T16:00:00"),
    },
    {
      client: "Nicolas Giraud",
      email: "nico.giraud@free.fr",
      items: [
        { productId: pMap["Bague Torsade"]?._id, name: "Bague Torsade", flavor: "Poli brillant", size: "Taille 58", quantity: 2, price: 89 },
      ],
      total: 178,
      mode: "delivery",
      address: "45 rue de la République, 44000 Nantes",
      note: "2 bagues identiques — cadeau couple",
      status: "pending",
      paymentStatus: "unpaid",
      createdAt: new Date("2026-04-26T07:45:00"),
    },
  ]);

  return NextResponse.json({
    ok: true,
    created: {
      categories: cats.length,
      products: products.length,
      orders: await Order.countDocuments(),
    },
    adminPassword: existingSettings ? "(existait déjà)" : "Admin1234!",
  });
}
