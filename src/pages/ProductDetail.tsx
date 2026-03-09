import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { storefrontApiRequest, PRODUCT_BY_HANDLE_QUERY } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { Navbar } from "@/components/Navbar";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { AnimateIn } from "@/components/shared/AnimateIn";
import { OfferUnit } from "@/components/membership/OfferUnit";
import { ScribbleUnderline } from "@/components/craft/ScribbleUnderline";
import { CircleEmphasis } from "@/components/craft/CircleEmphasis";
import { WavyDivider } from "@/components/craft/WavyDivider";
import { MarginNote } from "@/components/craft/MarginNote";
import { TagRedStamp } from "@/components/craft/TagRedStamp";
import { StampBadge } from "@/components/craft/StampBadge";
import { HandDrawnFrame } from "@/components/craft/HandDrawnFrame";
import { OrganicBlobTag } from "@/components/craft/OrganicBlobTag";
import { StitchLineDivider } from "@/components/craft/StitchLineDivider";
import { DiamondChainBorder } from "@/components/craft/DiamondChainBorder";
import { WaxSeal } from "@/components/craft/WaxSeal";
import { ScriptNumber } from "@/components/craft/ScriptNumber";
import { WashiTapeNote } from "@/components/craft/WashiTapeNote";
import { GrainOverlay } from "@/components/craft/GrainOverlay";
import { TornPaperEdge } from "@/components/craft/TornPaperEdge";
import { CategoryGraphic } from "@/components/product/CategoryGraphic";
import { Loader2, Shield, Package, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

interface Metafield { key: string; value: string | null }

interface ProductNode {
  id: string;
  title: string;
  description: string;
  handle: string;
  productType: string;
  tags: string[];
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  images: { edges: Array<{ node: { url: string; altText: string | null } }> };
  variants: { edges: Array<{ node: { id: string; title: string; price: { amount: string; currencyCode: string }; availableForSale: boolean; selectedOptions: Array<{ name: string; value: string }> } }> };
  options: Array<{ name: string; values: string[] }>;
  metafields: (Metafield | null)[];
}

const useMeta = (metafields: (Metafield | null)[], key: string): string => {
  return metafields?.find(m => m?.key === key)?.value || "";
};

// Splits comma/semicolon-separated strings to arrays
const splitList = (val: string): string[] =>
  val ? val.split(/[,;]+/).map(s => s.trim()).filter(Boolean) : [];

const ProductDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const [product, setProduct] = useState<ProductNode | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const addItem = useCartStore(state => state.addItem);
  const isCartLoading = useCartStore(state => state.isLoading);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await storefrontApiRequest(PRODUCT_BY_HANDLE_QUERY, { handle });
        if (data?.data?.productByHandle) setProduct(data.data.productByHandle);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [handle]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <p className="text-sm tracking-wider uppercase text-muted-foreground">Product not found</p>
        </div>
      </div>
    );
  }

  const variant = product.variants.edges[selectedVariantIdx]?.node;
  const images = product.images.edges;
  const meta = product.metafields || [];

  // All the rich metadata
  const heroPhrase      = useMeta(meta, "hero_descriptor_phrase");
  const diffDesc        = useMeta(meta, "differentiating_description");
  const silhouette      = useMeta(meta, "silhouette_category");
  const stackingRole    = useMeta(meta, "stacking_role");
  const platingColor    = useMeta(meta, "plating_color_primary");
  const otherColor      = useMeta(meta, "other_predominant_color");
  const materialCat     = useMeta(meta, "material_category");
  const sizeAndFit      = useMeta(meta, "size_and_fit");
  const weightComfort   = useMeta(meta, "weight_and_comfort");
  const closure         = useMeta(meta, "closure_and_security");
  const whatsIncluded   = useMeta(meta, "whats_included");
  const occasions       = splitList(useMeta(meta, "occasions_possible"));
  const outfitStyles    = splitList(useMeta(meta, "outfit_style"));
  const itemType        = useMeta(meta, "item_type");

  const category = product.productType || itemType || "Jewelry";
  const price = variant?.price || product.priceRange.minVariantPrice;
  const displayPrice = `${price.currencyCode} ${parseFloat(price.amount).toFixed(2)}`;

  // Occasion → blob variant cycle
  const blobVariants: Array<"classic" | "coastal" | "modern" | "statement"> = ["classic", "coastal", "modern", "statement"];

  const handleAddToCart = async () => {
    if (!variant) return;
    await addItem({
      product: { node: product },
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
    });
    toast.success("Added to bag", { position: "top-center" });
  };

  // Washi tape colors cycling for outfit style cards
  const tapeColors = [
    "hsl(36, 60%, 72%)", "hsl(180, 25%, 68%)", "hsl(350, 40%, 72%)", "hsl(60, 40%, 72%)"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ── Back crumb ── */}
      <div className="max-w-[1400px] mx-auto px-6 pt-6">
        <Link
          to={`/${category.toLowerCase()}s`}
          className="inline-flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase font-sans text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3 h-3" />
          {category}s
        </Link>
      </div>

      <main className="max-w-[1400px] mx-auto px-6 py-4 md:py-12 space-y-0">

        {/* ══════════════════════════════════════════
            SECTION 1 — Product Hero (Image + Buy Box)
        ══════════════════════════════════════════ */}
        <AnimateIn variant="fadeIn">
          <div className="grid md:grid-cols-[55%_45%] border border-border relative">

            {/* Images */}
            <div className="border-b md:border-b-0 md:border-r border-border">
              <div className="aspect-square overflow-hidden bg-card relative">
                {images[selectedImageIdx]?.node ? (
                  <img
                    src={images[selectedImageIdx].node.url}
                    alt={images[selectedImageIdx].node.altText || product.title}
                    className="w-full h-full object-cover transition-opacity duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-secondary flex items-center justify-center">
                    <span className="text-xs text-muted-foreground tracking-wider uppercase">No image</span>
                  </div>
                )}
                {/* Category blob tag over image */}
                <div className="absolute bottom-4 left-4">
                  <OrganicBlobTag variant="coastal">{category}</OrganicBlobTag>
                </div>
                {/* WaxSeal corner */}
                <WaxSeal size={28} className="absolute top-4 right-4" />
              </div>

              {/* Thumbnail strip */}
              {images.length > 1 && (
                <div className="grid grid-cols-5 border-t border-border">
                  {images.slice(0, 5).map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImageIdx(i)}
                      className={`aspect-square overflow-hidden border-r border-border last:border-r-0 transition-opacity ${
                        i === selectedImageIdx ? "opacity-100" : "opacity-40 hover:opacity-70"
                      }`}
                    >
                      <img
                        src={img.node.url}
                        alt={img.node.altText || ""}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* This Piece Belongs In — inside image column */}
              {outfitStyles.length > 0 && (
                <div className="p-6 md:p-8 border-t border-border">
                  <p className="text-[9px] tracking-[0.35em] uppercase font-sans text-muted-foreground mb-6">
                    This Piece Belongs In
                  </p>
                  <div className="flex flex-wrap gap-8 justify-start">
                    {outfitStyles.slice(0, 4).map((style, i) => (
                      <WashiTapeNote
                        key={style}
                        label={`Look ${i + 1}`}
                        tapeColor={tapeColors[i % tapeColors.length]}
                        rotation={i % 2 === 0 ? -1.5 : 1.5}
                      >
                        <p className="font-serif text-[15px] leading-snug">{style}</p>
                      </WashiTapeNote>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Buy Box */}
            <div className="p-8 md:p-10 lg:p-14 flex flex-col relative">
              <TagRedStamp size={18} className="absolute top-6 right-6" />

              {/* Category label */}
              <p className="text-[9px] tracking-[0.35em] uppercase font-sans text-muted-foreground mb-3">
                GEA · {category}
              </p>

              {/* Title */}
              <h1 className="font-serif text-3xl md:text-[2.2rem] font-medium leading-[1.1] tracking-[-0.01em] mb-2">
                {product.title}
              </h1>

              {/* Hero phrase — the emotional hook */}
              {heroPhrase && (
                <p className="font-serif italic text-lg text-muted-foreground leading-snug mb-6">
                  "{heroPhrase}"
                </p>
              )}

              <StitchLineDivider className="mb-5" />

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-2">
                <span className="font-serif text-3xl font-medium">{displayPrice}</span>
                <span className="text-[10px] tracking-[0.2em] uppercase font-sans text-muted-foreground">
                  / piece
                </span>
              </div>
              <p className="text-[10px] tracking-[0.15em] font-sans text-muted-foreground mb-6">
                Members access this at <ScriptNumber>40%</ScriptNumber> off retail
              </p>

              {/* Variant selector */}
              {product.options.length > 0 && product.options[0].name !== "Title" && (
                <div className="space-y-4 mb-6">
                  {product.options.map((option) => (
                    <div key={option.name}>
                      <p className="text-[9px] tracking-[0.25em] uppercase text-muted-foreground mb-2 font-sans">
                        {option.name}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {option.values.map((value) => {
                          const idx = product.variants.edges.findIndex(v =>
                            v.node.selectedOptions.some(o => o.name === option.name && o.value === value)
                          );
                          const isSelected = variant?.selectedOptions.some(o => o.name === option.name && o.value === value);
                          return (
                            <button
                              key={value}
                              onClick={() => idx >= 0 && setSelectedVariantIdx(idx)}
                              className={`border px-4 py-2 text-[10px] tracking-wider uppercase font-sans transition-colors ${
                                isSelected
                                  ? "border-foreground bg-foreground text-background"
                                  : "border-border hover:border-foreground"
                              }`}
                            >
                              {value}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Dual Access/Buy Options */}
              <div className="space-y-4 mb-3">
                {/* Access It Option */}
                <div className="border border-border bg-card p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-[10px] tracking-[0.3em] uppercase font-sans text-muted-foreground mb-1">
                        Option 1
                      </p>
                      <p className="font-serif text-xl font-medium mb-1">Access It</p>
                      <p className="text-[11px] text-muted-foreground font-sans leading-relaxed">
                        Wear this piece via membership
                      </p>
                    </div>
                    <CircleEmphasis className="mt-1">Access</CircleEmphasis>
                  </div>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="font-serif text-lg">$85</span>
                    <span className="text-[9px] tracking-[0.15em] uppercase font-sans text-muted-foreground">/month</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground font-sans mb-4">
                    Tier 2: 10 curated pieces per cycle · Cancel anytime
                  </p>
                  <button
                    disabled
                    className="w-full border border-border bg-secondary text-muted-foreground py-3 text-[10px] tracking-[0.25em] uppercase font-sans cursor-not-allowed"
                  >
                    Coming Soon
                  </button>
                </div>

                {/* Buy It Option */}
                <div className="border border-border bg-card p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-[10px] tracking-[0.3em] uppercase font-sans text-muted-foreground mb-1">
                        Option 2
                      </p>
                      <p className="font-serif text-xl font-medium mb-1">Buy It</p>
                      <p className="text-[11px] text-muted-foreground font-sans leading-relaxed">
                        Keep this piece forever
                      </p>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="font-serif text-lg">{displayPrice}</span>
                    <span className="text-[9px] tracking-[0.15em] uppercase font-sans text-muted-foreground">one-time</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground font-sans mb-4">
                    Full retail price · Yours to keep
                  </p>
                  <button
                    disabled
                    className="w-full border border-border bg-secondary text-muted-foreground py-3 text-[10px] tracking-[0.25em] uppercase font-sans cursor-not-allowed"
                  >
                    Coming Soon
                  </button>
                </div>
              </div>

              {/* Trust micro-strip */}
              <div className="flex items-center justify-center gap-4 mb-6">
                {["Cancel Anytime", "Free Returns", "Sanitized & Sealed"].map(t => (
                  <span key={t} className="text-[9px] tracking-[0.15em] uppercase font-sans text-muted-foreground">{t}</span>
                ))}
              </div>

              {/* Occasions */}
              {occasions.length > 0 && (
                <div className="border-t border-border pt-5 mt-4">
                  <p className="text-[9px] tracking-[0.35em] uppercase font-sans text-muted-foreground mb-4">
                    Occasions It Was Made For
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {occasions.map((occ, i) => (
                      <OrganicBlobTag key={occ} variant={blobVariants[i % 4]}>
                        {occ}
                      </OrganicBlobTag>
                    ))}
                  </div>
                </div>
              )}

              {/* Silhouette + Stacking */}
              {(silhouette || stackingRole) && (
                <div className="flex gap-3 mt-4">
                  {silhouette && (
                    <div className="flex-1 border border-border p-3">
                      <p className="text-[8px] tracking-[0.25em] uppercase font-sans text-muted-foreground mb-1">Silhouette</p>
                      <p className="font-serif text-sm">{silhouette}</p>
                    </div>
                  )}
                  {stackingRole && (
                    <div className="flex-1 border border-border p-3">
                      <p className="text-[8px] tracking-[0.25em] uppercase font-sans text-muted-foreground mb-1">Role</p>
                      <p className="font-serif text-sm">{stackingRole}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </AnimateIn>


        {/* ══════════════════════════════════════════
            SECTION 2 — Hero Phrase / Tagline Band
        ══════════════════════════════════════════ */}
        {(heroPhrase || product.description) && (
          <AnimateIn delay={0.1}>
            <div className="relative bg-foreground text-background py-12 md:py-16 px-8 md:px-16 overflow-hidden">
              <GrainOverlay opacity={0.03} />
              <StampBadge
                text="GEA"
                subtext="VAULT"
                rotation={-6}
                className="absolute top-5 right-8 hidden md:inline-flex opacity-30"
              />
              <div className="max-w-[780px] mx-auto text-center relative z-10">
                <p className="text-[9px] tracking-[0.4em] uppercase font-sans text-background/50 mb-6">
                  The Piece
                </p>
                <p className="font-serif text-2xl md:text-3xl lg:text-4xl font-medium leading-[1.2] tracking-[-0.01em]">
                  {heroPhrase || product.description.slice(0, 120)}
                </p>
              </div>
            </div>
          </AnimateIn>
        )}

        {/* ══════════════════════════════════════════
            SECTION 3 — The Story + Category Graphic
        ══════════════════════════════════════════ */}
        <AnimateIn delay={0.15}>
          <div className="grid md:grid-cols-[3fr_2fr] border-x border-b border-border">

            {/* Story text */}
            <div className="p-10 md:p-14 border-b md:border-b-0 md:border-r border-border relative">
              <p className="text-[9px] tracking-[0.35em] uppercase font-sans text-muted-foreground mb-6">
                The Story
              </p>

              {diffDesc ? (
                <HandDrawnFrame>
                  <p className="font-serif text-lg md:text-xl font-medium leading-[1.5] tracking-[0.01em] mb-4">
                    {diffDesc}
                  </p>
                  {product.description && diffDesc !== product.description && (
                    <p className="text-[12px] text-muted-foreground font-sans leading-[1.9] mt-4">
                      {product.description}
                    </p>
                  )}
                </HandDrawnFrame>
              ) : (
                <HandDrawnFrame>
                  <p className="font-serif text-lg leading-[1.5] mb-4">{product.title}</p>
                  <p className="text-[12px] text-muted-foreground font-sans leading-[1.9]">
                    {product.description}
                  </p>
                </HandDrawnFrame>
              )}

              {/* Margin stylist note */}
              <div className="mt-8 hidden md:block">
                <MarginNote attribution="GEA Curator">
                  {outfitStyles[0]
                    ? `Best worn in a ${outfitStyles[0].toLowerCase()} aesthetic — the piece commands presence without asking for it.`
                    : "This piece arrives restored and sealed. Wear it, return it, choose your next chapter."}
                </MarginNote>
              </div>
            </div>

            {/* Category Graphic */}
            <div className="bg-card flex flex-col items-center justify-center p-10 md:p-14 relative overflow-hidden">
              <div className="w-full max-w-[200px] mx-auto opacity-70">
                <CategoryGraphic category={category} />
              </div>
              {/* Detail micro-facts */}
              {whatsIncluded && (
                <div className="mt-8 border border-border p-4 w-full">
                  <p className="text-[8px] tracking-[0.3em] uppercase font-sans text-muted-foreground mb-2">
                    What's Included
                  </p>
                  <p className="text-[12px] font-sans">{whatsIncluded}</p>
                </div>
              )}
              {platingColor && (
                <div className="mt-2 border border-border p-4 w-full">
                  <p className="text-[8px] tracking-[0.3em] uppercase font-sans text-muted-foreground mb-2">
                    Finish
                  </p>
                  <p className="text-[12px] font-sans">{platingColor}{otherColor ? ` · ${otherColor}` : ""}</p>
                </div>
              )}
            </div>
          </div>
        </AnimateIn>


        {/* ══════════════════════════════════════════
            SECTION 5 — Material & Fit Details
        ══════════════════════════════════════════ */}
        <AnimateIn delay={0.2}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-x border-b border-border">
            {[
              { label: "Material", value: materialCat, fallback: "Premium Finish" },
              { label: "Size & Fit", value: sizeAndFit, fallback: "See description" },
              { label: "Feel", value: weightComfort, fallback: "Comfortable wear" },
              { label: "Closure", value: closure, fallback: "Secure closure" },
            ].map(({ label, value, fallback }, i) => (
              <div
                key={label}
                className={`p-8 md:p-10 border-b sm:border-b-0 ${i < 3 ? "sm:border-r border-border" : ""}`}
              >
                <p className="text-[8px] tracking-[0.3em] uppercase font-sans text-muted-foreground mb-3">
                  {label}
                </p>
                <p className="font-serif text-[15px] leading-snug">
                  {value || fallback}
                </p>
              </div>
            ))}
          </div>
        </AnimateIn>


        <DiamondChainBorder className="my-0" />

        {/* ══════════════════════════════════════════
            SECTION 7 — Risk Reversal / Trust
        ══════════════════════════════════════════ */}
        <AnimateIn delay={0.25}>
          <div className="grid md:grid-cols-3 border-x border-b border-border">
            {[
              {
                icon: Shield,
                label: "Damage Clarity Promise",
                body: "We document every piece before it ships. If it arrives damaged, we make it right — no questions.",
              },
              {
                icon: Package,
                label: "Sanitized & Sealed",
                body: "Every piece is professionally restored and sealed in our signature packaging before delivery.",
              },
              {
                icon: Loader2,
                label: "Cancel Anytime",
                body: "No commitment. No lock-in. Return when you're ready and choose your next chapter.",
              },
            ].map(({ icon: Icon, label, body }, i) => (
              <div
                key={label}
                className={`p-8 md:p-10 border-b md:border-b-0 ${i < 2 ? "md:border-r border-border" : ""} relative`}
              >
                <Icon className="h-4 w-4 stroke-[1.3] text-muted-foreground mb-4" />
                <p className="text-[10px] tracking-[0.2em] uppercase font-sans mb-3">{label}</p>
                <p className="text-[11px] text-muted-foreground font-sans leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </AnimateIn>

        <WavyDivider className="my-0" />

        {/* ══════════════════════════════════════════
            SECTION 8 — Membership Upsell (compact)
        ══════════════════════════════════════════ */}
        <AnimateIn delay={0.3}>
          <div className="border border-border">
            <OfferUnit variant="compact" />
          </div>
        </AnimateIn>

        {/* ══════════════════════════════════════════
            SECTION 9 — Sticky bottom CTA (mobile)
        ══════════════════════════════════════════ */}
        <AnimateIn delay={0.35}>
          <div className="border-x border-b border-border p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="font-serif text-2xl mb-1">{product.title}</p>
              <p className="font-serif text-xl text-muted-foreground">{displayPrice}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <button
                disabled
                className="border border-border bg-secondary text-muted-foreground px-12 py-3.5 text-[11px] tracking-[0.25em] uppercase font-sans cursor-not-allowed whitespace-nowrap"
              >
                Coming Soon
              </button>
              <Link
                to="/founding-100"
                className="border border-border px-8 py-3.5 text-[11px] tracking-[0.25em] uppercase font-sans text-muted-foreground hover:border-foreground hover:text-foreground transition-colors whitespace-nowrap text-center"
              >
                See Membership
              </Link>
            </div>
          </div>
        </AnimateIn>

      </main>

      <SiteFooter />
    </div>
  );
};

export default ProductDetail;
