import { Link } from "react-router-dom";
import { useCartStore } from "@/stores/cartStore";
import { type ShopifyProduct } from "@/lib/shopify";
import { Loader2 } from "lucide-react";
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
  const addItem = useCartStore(state => state.addItem);
  const isLoading = useCartStore(state => state.isLoading);
  const variant = product.node.variants.edges[0]?.node;
  const image = product.node.images.edges[0]?.node;
  const hoverImage = product.node.images.edges[1]?.node;
  const price = product.node.priceRange.minVariantPrice;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!variant) return;
    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
    });
    toast.success("Added to bag", { position: "top-center" });
  };

  return (
    <Link to={`/product/${product.node.handle}`} className="group block">
      <div className="border border-border bg-card overflow-hidden">
        <div className="aspect-square overflow-hidden hover-product-zoom">
          {image ? (
            <div className="relative w-full h-full">
              <img
                src={optimizeShopifyImage(image.url, 600)}
                alt={image.altText || product.node.title}
                className={`w-full h-full object-cover transition-all duration-700 ease-out ${hoverImage ? 'group-hover:opacity-0' : ''}`}
                loading="lazy"
                decoding="async"
              />
              {hoverImage && (
                <img
                  src={optimizeShopifyImage(hoverImage.url, 600)}
                  alt={hoverImage.altText || product.node.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out"
                  loading="lazy"
                  decoding="async"
                />
              )}
            </div>
          ) : (
            <div className="w-full h-full bg-secondary flex items-center justify-center">
              <span className="text-xs text-muted-foreground tracking-wider uppercase">No image</span>
            </div>
          )}
        </div>
        <div className="p-5 space-y-3">
          <h3 className="font-serif text-base font-medium leading-snug">{product.node.title}</h3>
          <p className="text-sm text-muted-foreground">{price.currencyCode} {parseFloat(price.amount).toFixed(2)}</p>
          <span
            className="block w-full border border-foreground text-foreground py-2.5 text-xs tracking-[0.2em] uppercase font-sans text-center hover-btn-fade group-hover:bg-foreground group-hover:text-hero-text transition-all duration-300"
          >
            View Product
          </span>
        </div>
      </div>
    </Link>
  );
};
