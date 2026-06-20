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

export const ProductCard = ({ product }: { product: ShopifyProduct }) => {
  const variant = product.node.variants.edges[0]?.node;
  const price = product.node.priceRange.minVariantPrice;
  const displayPrice = `$${parseFloat(price.amount).toFixed(2)}`;

  // Use up to the first three product images for the hover slideshow
  const slideshowImages = product.node.images.edges.slice(0, 3).map((edge) => edge.node);
  const hasMultiple = slideshowImages.length > 1;

  const [activeIdx, setActiveIdx] = useState(0);
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
    intervalRef.current = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % slideshowImages.length);
    }, 500);
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
              {slideshowImages.map((img, index) => (
                <img
                  key={img.url}
                  src={optimizeShopifyImage(img.url, 600)}
                  alt={img.altText || product.node.title}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                    index === activeIdx ? "opacity-100" : "opacity-0"
                  }`}
                  loading="lazy"
                  decoding="async"
                />
              ))}
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
