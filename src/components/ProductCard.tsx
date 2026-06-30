import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "@/stores/cartStore";
import { type ShopifyProduct } from "@/lib/shopify";
import { toast } from "sonner";

/** Append width param to Shopify CDN URLs for optimized loading */
function optimizeShopifyImage(url: string, width: number): string {
  try {
    const u = new URL(url);
    u.searchParams.set("width", String(width));
    return u.toString();
  } catch {
    return url;
  }
}

// Candidate widths the Shopify CDN should render, so the browser can pick the
// right one per device instead of always downloading a single oversized file.
const SRCSET_WIDTHS = [180, 240, 320, 420, 540, 640];
function shopifySrcSet(url: string): string {
  return SRCSET_WIDTHS.map((w) => `${optimizeShopifyImage(url, w)} ${w}w`).join(", ");
}
// Real rendered card width: ~37vw on mobile (2-up, after grid padding) and
// ~33vw in the 3-up desktop grid. Kept tight so retina devices still pull a
// crisp file without over-fetching.
const CARD_SIZES = "(min-width: 1024px) 33vw, 38vw";

export const ProductCard = ({
  product,
  priority = false,
  eager = false,
}: {
  product: ShopifyProduct;
  /** Fetch the primary image at high priority (above-the-fold hero cards only). */
  priority?: boolean;
  /** Load the primary image immediately instead of lazily (e.g. a just-revealed "load more" batch). */
  eager?: boolean;
}) => {
  const variant = product.node.variants.edges[0]?.node;
  const price = product.node.priceRange.minVariantPrice;
  const displayPrice = `$${parseFloat(price.amount).toFixed(2)}`;

  // Use up to the first three product images for the hover slideshow
  const slideshowImages = product.node.images.edges.slice(0, 3).map((edge) => edge.node);
  const hasMultiple = slideshowImages.length > 1;

  const [activeIdx, setActiveIdx] = useState(0);
  // The hover images (2nd/3rd) are only mounted once the user actually hovers,
  // so the initial grid downloads one image per card instead of three.
  const [armed, setArmed] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopSlideshow = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setActiveIdx(0);
  };

  const startSlideshow = () => {
    if (!hasMultiple || intervalRef.current) return;
    setArmed(true);
    intervalRef.current = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % slideshowImages.length);
    }, 667);
  };

  // Clean up the interval if the card unmounts mid-hover
  useEffect(() => () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  return (
    <Link to={`/product/${product.node.handle}`} className="group block">
      <div className="border border-border bg-card overflow-hidden">
        <div
          className="aspect-square overflow-hidden"
          onMouseEnter={startSlideshow}
          onMouseLeave={stopSlideshow}
        >
          {slideshowImages.length > 0 ? (
            <div className="relative w-full h-full">
              {slideshowImages.map((img, index) => {
                // Only the primary image loads up front; hover images mount on
                // first hover so the grid isn't downloading 3 images per card.
                if (index > 0 && !armed) return null;
                const isPrimary = index === 0;
                return (
                  <img
                    key={img.url}
                    src={optimizeShopifyImage(img.url, 420)}
                    srcSet={shopifySrcSet(img.url)}
                    sizes={CARD_SIZES}
                    alt={img.altText || product.node.title}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                      index === activeIdx ? "opacity-100" : "opacity-0"
                    }`}
                    loading={isPrimary && (priority || eager) ? "eager" : "lazy"}
                    // lowercase attribute name avoids the React camelCase prop warning
                    {...(isPrimary && priority ? ({ fetchpriority: "high" } as Record<string, string>) : {})}
                    decoding="async"
                  />
                );
              })}
            </div>
          ) : (
            <div className="w-full h-full bg-secondary flex items-center justify-center">
              <span className="text-xs text-muted-foreground tracking-wider uppercase">No image</span>
            </div>
          )}
        </div>
        <div className="p-5 space-y-2.5">
          {variant?.sku && (
            <p
              className="font-sans text-[9px] tracking-[0.22em] uppercase text-muted-foreground/80 cursor-pointer hover:text-muted-foreground select-all"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                navigator.clipboard.writeText(variant.sku);
                toast.success("Reference copied", { position: "top-center" });
              }}
              title="Click to copy reference"
            >
              Ref {variant.sku}
            </p>
          )}
          <h3 className="font-serif text-base font-medium leading-snug">{product.node.title}</h3>
          <p className="text-sm text-muted-foreground">{displayPrice}</p>
          <span
            className="block w-full border border-foreground text-foreground py-2.5 text-xs tracking-[0.2em] uppercase font-sans text-center group-hover:bg-foreground group-hover:text-hero-text transition-colors duration-200"
          >
            View Product
          </span>
        </div>
      </div>
    </Link>
  );
};
