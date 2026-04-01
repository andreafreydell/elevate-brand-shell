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
    categoryFit: 0.24,
    stackability: 0.2,
    everydayAppeal: 0.12,
    trendSignal: 0.15,
    statementAppeal: 0.13,
    occasionBreadth: 0.06,
    priceAccessibility: 0.05,
    materialConfidence: 0.05,
  },
  charm: {
    categoryFit: 0.2,
    stackability: 0.22,
    everydayAppeal: 0.1,
    trendSignal: 0.22,
    statementAppeal: 0.08,
    occasionBreadth: 0.06,
    priceAccessibility: 0.06,
    materialConfidence: 0.06,
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
    categoryFit: 0.18,
    stackability: 0.14,
    everydayAppeal: 0.08,
    trendSignal: 0.28,
    statementAppeal: 0.19,
    occasionBreadth: 0.07,
    priceAccessibility: 0.04,
    materialConfidence: 0.02,
  },
  necklace: {
    categoryFit: 0.2,
    stackability: 0.25,
    everydayAppeal: 0.12,
    trendSignal: 0.18,
    statementAppeal: 0.11,
    occasionBreadth: 0.06,
    priceAccessibility: 0.04,
    materialConfidence: 0.04,
  },
  sunglasses: {
    categoryFit: 0.18,
    stackability: 0.08,
    everydayAppeal: 0.16,
    trendSignal: 0.24,
    statementAppeal: 0.18,
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
    Tennis: 9.5,
    "Link Bracelet": 9,
    Cuff: 8.4,
    Bangle: 7,
    "Chunky Metal Chain": 8.3,
    "Delicate Bead Strand": 6.5,
    "Thick Bead Strand": 7.1,
  },
  charm: {
    "Charm-Based": 10,
    Pendant: 7.5,
  },
  earrings: {
    Huggie: 10,
    Stud: 8,
    "Drop Earring": 7,
    "Ear Climber": 6,
  },
  "hair accessory": {
    "Bow Barrette": 9.6,
    "Statement Barrette": 8.8,
    "Rectangular Barrette": 6.7,
    "Barrette Clip": 6.6,
    "Claw Clip": 8.9,
    "Butterfly Clip": 7.2,
    "Sculpted Shell Clip": 8.9,
    "Chunky Link Band": 8.1,
    "Leaf Claw Clip": 8.6,
    "Sculptural Clip": 9,
    "Shaped Resin Clip": 5.4,
    "Decorative Barrette": 8.8,
    "Decorative Hair Clip": 8.6,
    "Bow Hair Fork": 8.8,
    "Tapered Hair Fork": 7.4,
  },
  necklace: {
    Tennis: 10,
    "Delicate Chain": 9,
    "Delicate Bead Strand": 9,
    Pendant: 8,
    "Thick Bead Strand": 8,
    "Chunky Metal Chain": 8,
    "Structured Collar": 7,
    "Fringe Drop Strand": 7,
  },
  sunglasses: {
    "Rounded Cat Eye": 9.5,
    "Thick Acetate Frame": 8,
    "Chunky Oval Frame": 8.6,
    "Chunky Acetate Frame": 7.6,
    "Oversized Round Frame": 8,
    "Oversized Square Frame": 8.4,
    "Structured Frame": 6.8,
    "Wrap Frame": 5.6,
    "Bold Acetate Frame": 7,
  },
};

export const STACKING_ROLE_SCORES: Record<string, number> = {
  "Chain Base": 10,
  "Delicate Layer": 9.5,
  "Huggie Layer": 9,
  "Pendant Focal": 7.5,
  "Vertical Lengthener": 8.5,
  "Micro Charm Accent": 8,
  "Drop Accent": 7,
  "Charm Focal": 7,
  "Wrist Anchor": 8,
  "Texture Builder": 8,
  "Chunky Metal Anchor": 7,
  "Link Statement": 7,
  "Mixed Metal Bridge": 6,
  "Integrated Multi-Layer": 6,
  "Slim Spacer": 8.5,
  "Pendant Focal ": 7,
};

export const KEYWORD_SIGNAL_SCORES: Record<string, number> = {
  huggie: 2.4,
  hoop: 2.2,
  pendant: 1.2,
  chain: 2.3,
  tennis: 2.5,
  pearl: 2.4,
  initial: 0.9,
  letter: 0.9,
  monogram: 1.1,
  bow: 1.7,
  cat: 0.8,
  "cat eye": 2.0,
  shell: 2.0,
  pearlescent: 1.8,
  iridescent: 1.8,
  butterfly: 1.5,
  claw: 1.6,
  barrette: 1.5,
  rhinestone: 1.7,
  seaside: 1.4,
  coastal: 1.2,
  marbled: 1.4,
  swirl: 1.3,
  tortoise: 2.0,
  oversized: 1.9,
  oval: 1.5,
  square: 1.3,
  aviator: 1.6,
  geometric: 1.7,
  layered: 2.5,
  layer: 2.1,
  stack: 2.0,
  stacking: 2.0,
  charm: 1.7,
  drop: 1.3,
  dome: 1.4,
  bold: 1.4,
  "pave": 1.8,
  "pavé": 1.4,
  herringbone: 2.4,
  snake: 2.0,
  link: 1.5,
  mixed: 1.1,
  enamel: 2.2,
  tile: 1.9,
  chevron: 1.5,
  floral: 1.4,
  flower: 1.4,
  beaded: 2.2,
  bead: 1.8,
  strand: 2.0,
  choker: 1.9,
  orb: 1.6,
  rondelle: 1.5,
  turquoise: 1.8,
  emerald: 1.5,
  colorful: 2.0,
  color: 1.3,
  resin: 1.6,
  acrylic: 1.4,
  stone: 1.6,
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
  "natural stone": 8,
  resin: 6,
  acrylic: 5,
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
    manualBoost: 1.1,
    notes: "Keep one personalized pendant hero in the mix, but not at the expense of the broader stack story.",
  },
  {
    handle: "zolia-necklace",
    manualBoost: 0.9,
    notes: "Personalized pendant still matters, just no longer as the dominant necklace story.",
  },
  {
    handle: "qiolia-necklace",
    manualBoost: 0.8,
    notes: "Keep one pavé pendant focal high, but let layered chains and bead strands lead the category mood.",
  },
  {
    handle: "violia-necklace",
    manualBoost: 2.5,
    notes: "Tennis chain is a core current-stack hero and should stay near the front of the necklace category.",
  },
  {
    handle: "kaevia-necklace",
    manualBoost: 2.3,
    notes: "Silver tennis-disc chain supports the same current layered-sparkle direction as Anthropologie-style stack merchandising.",
  },
  {
    handle: "niosia-necklace",
    manualBoost: 2.4,
    notes: "Explicit layered chain necklace should read immediately as a stack-ready hero.",
  },
  {
    handle: "marelia-necklace",
    manualBoost: 2.1,
    notes: "Orb choker gives a current, styled-up front row option beyond plain pendants.",
  },
  {
    handle: "kaelina-necklace",
    manualBoost: 2.5,
    notes: "Natural-stone strand is part of the intended category identity and should lead more often.",
  },
  {
    handle: "meralia-necklace",
    manualBoost: 2.4,
    notes: "Colorful natural-stone beaded necklace supports the jewelry-styling direction the assortment was bought for.",
  },
  {
    handle: "saevia-necklace",
    manualBoost: 2.2,
    notes: "Orb strand necklace gives the front of category a more editorial, current-stack feel.",
  },
  {
    handle: "veonia-necklace",
    manualBoost: 2.1,
    notes: "Beaded orb strand should compete with pendants, not disappear behind them.",
  },
  {
    handle: "haevia-necklace",
    manualBoost: 2.3,
    notes: "Pearl strand supports the softer fashion-layered story winning in current necklace assortments.",
  },
  {
    handle: "seolia-necklace",
    manualBoost: 2.2,
    notes: "Pearl strand with clearer fashion signal belongs near the front edit.",
  },
  {
    handle: "theosia-necklace",
    manualBoost: 2.5,
    notes: "Natural-stone orb bead strand is exactly the colorful stacked-necklace energy the category needs.",
  },
  {
    handle: "zaelina-necklace",
    manualBoost: 2.1,
    notes: "Rondelle strand adds texture and color variety to the first screen of the necklace category.",
  },
  {
    handle: "vialia-necklace",
    manualBoost: 2.4,
    notes: "Emerald orb strand should show earlier because it reads current, covetable, and visually distinct.",
  },
  {
    handle: "gionia-necklace",
    manualBoost: 1.8,
    notes: "Shell-and-stone statement strand gives the edit a stronger Anthropologie-style fashion read.",
  },
  {
    handle: "zaephia-bracelet",
    manualBoost: 2.3,
    notes: "Tennis bracelet is one of the clearest conversion drivers in current competitor merchandising.",
  },
  {
    handle: "vialia-bracelet",
    manualBoost: 2.0,
    notes: "Simple gold link bracelet reads like an accessible everyday stack anchor.",
  },
  {
    handle: "nealia-bracelet",
    manualBoost: 1.6,
    notes: "Silver cuff gives the bracelet category a strong non-gold hero option.",
  },
  {
    handle: "saenia-bracelet",
    manualBoost: 0.9,
    notes: "Keep one soft stone strand visible, but not as the lead bracelet story.",
  },
  {
    handle: "ziania-bracelet",
    manualBoost: 0.8,
    notes: "Natural-stone set still matters, but it should support the category rather than dominate the opening row.",
  },
  {
    handle: "ziovia-bracelet",
    manualBoost: 0.6,
    notes: "Keep one mint stone option in the mix without overloading the first screen with stretch strands.",
  },
  {
    handle: "theasia-bracelet",
    manualBoost: 1.3,
    notes: "Pearl-and-bead statement bracelet adds resort texture and visual diversity to the top row.",
  },
  {
    handle: "raenia-bracelet",
    manualBoost: 1.5,
    notes: "Double-row tennis bracelet deserves to show early because it reads elevated and immediately legible.",
  },
  {
    handle: "laelia-bracelet",
    manualBoost: 1.3,
    notes: "Green tennis bracelet gives the opening edit a clearer color statement than generic stone strands.",
  },
  {
    handle: "thionia-bracelet",
    manualBoost: 1.2,
    notes: "Silver tennis piece adds needed metal variety near the front of bracelets.",
  },
  {
    handle: "gaennia-bracelet",
    manualBoost: 1.2,
    notes: "Polished oval link bracelet belongs earlier to balance out the tennis-heavy shapes.",
  },
  {
    handle: "lioria-bracelet",
    manualBoost: 1.1,
    notes: "Triple flat chain bracelet helps the opening edit feel more structured and less strand-heavy.",
  },
  {
    handle: "thaelia-bracelet",
    manualBoost: 1.4,
    notes: "Emerald enamel tile link bracelet should sit high because it is one of the most distinctive structured bracelet stories.",
  },
  {
    handle: "laenia-bracelet",
    manualBoost: 1.2,
    notes: "Turquoise enamel link bracelet deserves to sit much earlier as a more unique color-and-metal hero.",
  },
  {
    handle: "zaenia-bracelet",
    manualBoost: 1.0,
    notes: "Mixed-metal chevron link bracelet brings the kind of special structured variety the top bracelet rows need.",
  },
  {
    handle: "zeolia-bracelet",
    manualBoost: 0.9,
    notes: "Black enamel tile link bracelet should read as an editorial structured option, not get buried.",
  },
  {
    handle: "tiamia-bracelet",
    manualBoost: 0.9,
    notes: "Floral mixed-metal link bracelet adds a more decorative statement beat high in the bracelet category.",
  },
  {
    handle: "zaevia-bracelet",
    manualBoost: 0.9,
    notes: "Turquoise enamel link bracelet should rise because it is more distinctive than another generic chain or stretch strand.",
  },
  {
    handle: "neavira-charm",
    manualBoost: 2.2,
    notes: "Heart charm aligns with current giftable and charm-forward assortment patterns.",
  },
  {
    handle: "viantha-charm",
    manualBoost: 1.1,
    notes: "Keep one clean panel pendant charm high, but not as the only dominant shape.",
  },
  {
    handle: "vealia-charm",
    manualBoost: 2.2,
    notes: "Initial charm supports the build-your-story charm direction and should surface earlier.",
  },
  {
    handle: "leolia-charm",
    manualBoost: 2.1,
    notes: "Bar charm is a cleaner layering accent and adds silhouette variety to the first charm rows.",
  },
  {
    handle: "ziania-charm",
    manualBoost: 1.9,
    notes: "Bird charm makes the charm grid feel more collectible and less repetitive.",
  },
  {
    handle: "veilia-charm",
    manualBoost: 2.0,
    notes: "Crescent charm gives the first screen a more curated motif mix.",
  },
  {
    handle: "maevia-charm",
    manualBoost: 2.1,
    notes: "Bow charm brings a stronger fashion-trend signal to the charm assortment.",
  },
  {
    handle: "laenia-charm",
    manualBoost: 1.9,
    notes: "Letter charm gives the category a personalization option without overloading it with pendants.",
  },
  {
    handle: "niovia-charm",
    manualBoost: 1.9,
    notes: "Letter charm adds another collectible, stackable story element.",
  },
  {
    handle: "zaeonia-hair-accessory",
    manualBoost: 2.1,
    notes: "Claw-clip utility plus shell trend signal makes this a strong category leader.",
  },
  {
    handle: "leonia-hair-accessory",
    manualBoost: 1.1,
    notes: "Keep one butterfly hero visible, but let bows and shells lead the fashion story.",
  },
  {
    handle: "veolia-hair-accessory",
    manualBoost: 2.2,
    notes: "Bow barrette is one of the clearest high-conversion hair-accessory shapes and should sit near the top.",
  },
  {
    handle: "zealia-hair-accessory",
    manualBoost: 2.0,
    notes: "Second bow option keeps the front of category feeling trend-right and giftable.",
  },
  {
    handle: "liona-hair-accessory",
    manualBoost: 1.9,
    notes: "Pearlescent shell barrette adds softer texture and keeps the first rows from feeling too clip-heavy.",
  },
  {
    handle: "vaelina-hair-accessory",
    manualBoost: 1.8,
    notes: "Shell barrette deserves to show early alongside bows and claw clips.",
  },
  {
    handle: "maevia-hair-accessory",
    manualBoost: 1.7,
    notes: "Statement bar clip gives the category a cleaner polished option in the opening edit.",
  },
  {
    handle: "meolia-hair-accessory",
    manualBoost: 0.7,
    notes: "Keep one clean barrette in the mix, but do not let the opening edit become too safe.",
  },
  {
    handle: "thionia-hair-accessory",
    manualBoost: 1.6,
    notes: "Sculptural shell barrette gives the first rows more character than another plain polished clip.",
  },
  {
    handle: "zeira-hair-accessory",
    manualBoost: 1.5,
    notes: "Leaf clip with rhinestone detail adds a more memorable dressed-up option near the front.",
  },
  {
    handle: "theovia-hair-accessory",
    manualBoost: 1.4,
    notes: "Shell clip with rhinestone detail keeps the front of category more visually interesting.",
  },
  {
    handle: "zaevia-hair-accessory",
    manualBoost: 1.3,
    notes: "Chunky link headband gives the opening edit a stronger fashion-accessory beat.",
  },
  {
    handle: "cealia-hair-accessory",
    manualBoost: 1.2,
    notes: "Bow hair fork adds needed silhouette variety so the top rows do not feel clip-only.",
  },
  {
    handle: "biolia-sunglasses",
    manualBoost: 2.0,
    notes: "Cat-eye frame is the clearest fashion-forward shape in the sunglasses assortment.",
  },
  {
    handle: "gaelia-sunglasses",
    manualBoost: 1.9,
    notes: "Oversized square frame gives the category a strong everyday hero alongside cat-eye shapes.",
  },
  {
    handle: "zaephia-sunglasses",
    manualBoost: 1.9,
    notes: "Tortoise oval frame adds needed shape variety near the top of sunglasses.",
  },
  {
    handle: "raelia-sunglasses",
    manualBoost: 1.7,
    notes: "Oversized tortoise square belongs earlier to balance the cat-eye dominance.",
  },
  {
    handle: "thionia-sunglasses",
    manualBoost: 1.8,
    notes: "Oval frame gives the first screen a softer shape break from cat-eye and square silhouettes.",
  },
  {
    handle: "laevia-sunglasses",
    manualBoost: 1.6,
    notes: "Aviator shape adds a distinct fashion lane to the first sunglasses edit.",
  },
  {
    handle: "veonia-sunglasses",
    manualBoost: 1.7,
    notes: "Geometric frame makes the category feel more editorial and less repetitive.",
  },
];
