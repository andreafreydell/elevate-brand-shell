export type MerchandisingCategory =
  | "default"
  | "bracelet"
  | "charm"
  | "earrings"
  | "hair accessory"
  | "necklace"
  | "sunglasses";

export interface ProductRankingColumns {
  categoryFit: number;
  stackability: number;
  everydayAppeal: number;
  trendSignal: number;
  statementAppeal: number;
  occasionBreadth: number;
  priceAccessibility: number;
  materialConfidence: number;
}

export interface ProductRankingOverrideRow extends Partial<ProductRankingColumns> {
  handle: string;
  manualBoost?: number;
  notes?: string;
}

export const CATEGORY_WEIGHT_PROFILES: Record<MerchandisingCategory, ProductRankingColumns> = {
  default: {
    categoryFit: 0.23,
    stackability: 0.18,
    everydayAppeal: 0.16,
    trendSignal: 0.15,
    statementAppeal: 0.08,
    occasionBreadth: 0.08,
    priceAccessibility: 0.06,
    materialConfidence: 0.06,
  },
  bracelet: {
    categoryFit: 0.23,
    stackability: 0.22,
    everydayAppeal: 0.15,
    trendSignal: 0.14,
    statementAppeal: 0.08,
    occasionBreadth: 0.07,
    priceAccessibility: 0.06,
    materialConfidence: 0.05,
  },
  charm: {
    categoryFit: 0.26,
    stackability: 0.18,
    everydayAppeal: 0.12,
    trendSignal: 0.18,
    statementAppeal: 0.07,
    occasionBreadth: 0.06,
    priceAccessibility: 0.06,
    materialConfidence: 0.07,
  },
  earrings: {
    categoryFit: 0.28,
    stackability: 0.18,
    everydayAppeal: 0.18,
    trendSignal: 0.16,
    statementAppeal: 0.08,
    occasionBreadth: 0.06,
    priceAccessibility: 0.03,
    materialConfidence: 0.03,
  },
  "hair accessory": {
    categoryFit: 0.23,
    stackability: 0.14,
    everydayAppeal: 0.14,
    trendSignal: 0.22,
    statementAppeal: 0.13,
    occasionBreadth: 0.07,
    priceAccessibility: 0.04,
    materialConfidence: 0.03,
  },
  necklace: {
    categoryFit: 0.28,
    stackability: 0.22,
    everydayAppeal: 0.14,
    trendSignal: 0.14,
    statementAppeal: 0.08,
    occasionBreadth: 0.06,
    priceAccessibility: 0.04,
    materialConfidence: 0.04,
  },
  sunglasses: {
    categoryFit: 0.22,
    stackability: 0.08,
    everydayAppeal: 0.18,
    trendSignal: 0.24,
    statementAppeal: 0.14,
    occasionBreadth: 0.08,
    priceAccessibility: 0.03,
    materialConfidence: 0.03,
  },
};

export const CATEGORY_SILHOUETTE_SCORES: Record<MerchandisingCategory, Record<string, number>> = {
  default: {
    Pendant: 9,
    Huggie: 9,
    Tennis: 9,
    "Link Bracelet": 8,
    Stud: 7,
    "Drop Earring": 7,
    "Delicate Bead Strand": 6,
  },
  bracelet: {
    Tennis: 10,
    "Link Bracelet": 8,
    Cuff: 7,
    Bangle: 7,
    "Chunky Metal Chain": 7,
    "Delicate Bead Strand": 6,
    "Thick Bead Strand": 5,
  },
  charm: {
    Pendant: 9,
    "Charm-Based": 8,
  },
  earrings: {
    Huggie: 10,
    Stud: 8,
    "Drop Earring": 7,
    "Ear Climber": 6,
  },
  "hair accessory": {
    "Bow Barrette": 9,
    "Statement Barrette": 8,
    "Rectangular Barrette": 7,
    "Barrette Clip": 7,
    "Claw Clip": 8,
    "Butterfly Clip": 7,
    "Sculpted Shell Clip": 7,
    "Chunky Link Band": 6,
    "Leaf Claw Clip": 7,
    "Sculptural Clip": 7,
    "Shaped Resin Clip": 6,
  },
  necklace: {
    Pendant: 10,
    Tennis: 9,
    "Delicate Chain": 8,
    "Chunky Metal Chain": 7,
    "Delicate Bead Strand": 6,
    "Structured Collar": 5,
  },
  sunglasses: {
    "Rounded Cat Eye": 10,
    "Thick Acetate Frame": 8,
    "Chunky Oval Frame": 8,
    "Chunky Acetate Frame": 7,
    "Oversized Round Frame": 7,
    "Structured Frame": 6,
    "Wrap Frame": 5,
    "Bold Acetate Frame": 7,
  },
};

export const STACKING_ROLE_SCORES: Record<string, number> = {
  "Chain Base": 10,
  "Delicate Layer": 9,
  "Huggie Layer": 9,
  "Pendant Focal": 8,
  "Vertical Lengthener": 8,
  "Micro Charm Accent": 8,
  "Drop Accent": 7,
  "Charm Focal": 7,
  "Wrist Anchor": 8,
  "Texture Builder": 8,
  "Chunky Metal Anchor": 7,
  "Link Statement": 7,
  "Mixed Metal Bridge": 6,
  "Integrated Multi-Layer": 6,
};

export const KEYWORD_SIGNAL_SCORES: Record<string, number> = {
  huggie: 2.4,
  hoop: 2.2,
  pendant: 2.4,
  chain: 2.1,
  tennis: 2.5,
  pearl: 1.6,
  initial: 1.8,
  letter: 1.8,
  bow: 1.7,
  cat: 0.8,
  "cat eye": 2.0,
  shell: 1.5,
  layered: 1.8,
  stack: 1.7,
  stacking: 1.7,
  charm: 1.7,
  drop: 1.3,
  dome: 1.4,
  bold: 1.4,
  pavé: 1.8,
  pave: 1.8,
  herringbone: 1.8,
  link: 1.5,
  mixed: 1.1,
  beaded: 1.2,
  sculptural: 1.5,
};

export const MATERIAL_SIGNAL_SCORES: Record<string, number> = {
  stainless: 9,
  sterling: 8,
  silver: 7,
  gold: 8,
  vermeil: 8,
  moissanite: 8,
  pearl: 7,
  resin: 5,
  acrylic: 4,
  acetate: 6,
  gemstone: 6,
  diamond: 8,
};

export const MANUAL_PRODUCT_RANKING_ROWS: ProductRankingOverrideRow[] = [
  {
    handle: "thanea-earrings",
    manualBoost: 2.5,
    notes: "Gold teardrop huggie maps closely to Mejuri- and gorjana-style everyday heroes.",
  },
  {
    handle: "theonia-earrings",
    manualBoost: 2.1,
    notes: "Oval huggie silhouette is easy to style and highly likely to convert as a first-ear stack piece.",
  },
  {
    handle: "meolia-earrings",
    manualBoost: 1.5,
    notes: "Halo huggie gives the assortment a lighter everyday sparkle option.",
  },
  {
    handle: "zionna-necklace",
    manualBoost: 2.4,
    notes: "Initial pendant follows the strongest personalized-necklace pattern across Mejuri and Kendra Scott.",
  },
  {
    handle: "zolia-necklace",
    manualBoost: 2.2,
    notes: "Pendant-led, giftable, and easy to understand in one glance.",
  },
  {
    handle: "qiolia-necklace",
    manualBoost: 1.6,
    notes: "Pendant focal with broader styling range than the more statement necklace silhouettes.",
  },
  {
    handle: "violia-necklace",
    manualBoost: 1.8,
    notes: "Tennis silhouette supports the sparkle-forward stack story the site is leaning into.",
  },
  {
    handle: "zaephia-bracelet",
    manualBoost: 2.5,
    notes: "Tennis bracelet is one of the clearest conversion drivers in current competitor merchandising.",
  },
  {
    handle: "vialia-bracelet",
    manualBoost: 1.8,
    notes: "Simple gold link bracelet reads like an accessible everyday stack anchor.",
  },
  {
    handle: "nealia-bracelet",
    manualBoost: 1.2,
    notes: "Silver cuff gives the bracelet category a strong non-gold hero option.",
  },
  {
    handle: "neavira-charm",
    manualBoost: 1.4,
    notes: "Heart charm aligns with current giftable and charm-forward assortment patterns.",
  },
  {
    handle: "viantha-charm",
    manualBoost: 1.2,
    notes: "Pendant charm shape is easy to merchandise beside necklace bases and initial pieces.",
  },
  {
    handle: "zaeonia-hair-accessory",
    manualBoost: 1.6,
    notes: "Claw-clip utility plus shell trend signal makes this a strong category leader.",
  },
  {
    handle: "leonia-hair-accessory",
    manualBoost: 1.3,
    notes: "Butterfly motif is visual, giftable, and easy to understand at a glance.",
  },
  {
    handle: "biolia-sunglasses",
    manualBoost: 2.2,
    notes: "Cat-eye frame is the clearest fashion-forward shape in the sunglasses assortment.",
  },
  {
    handle: "gaelia-sunglasses",
    manualBoost: 1.4,
    notes: "Oversized square frame gives the category a strong everyday hero alongside cat-eye shapes.",
  },
];
