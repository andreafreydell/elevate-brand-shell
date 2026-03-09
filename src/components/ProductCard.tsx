import { Link } from "react-router-dom";
import { useCartStore } from "@/stores/cartStore";
import { type ShopifyProduct } from "@/lib/shopify";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export const ProductCard = ({ product, index = 0 }: { product: ShopifyProduct; index?: number }) => {
  const addItem = useCartStore(state => state.addItem);
  const isLoading = useCartStore(state => state.isLoading);
  const variant = product.node.variants.edges[0]?.node;
  const imageCount = product.node.images.edges.length;
  const image = imageCount > 0 ? product.node.images.edges[index % imageCount]?.node : undefined;
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
        <div className="aspect-square overflow-hidden">
          {image ? (
            <img
              src={image.url}
              alt={image.altText || product.node.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              loading="lazy"
            />
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
            className="block w-full border border-foreground text-foreground py-2.5 text-xs tracking-[0.2em] uppercase font-sans text-center group-hover:bg-foreground group-hover:text-hero-text transition-colors duration-200"
          >
            View Product
          </span>
        </div>
      </div>
    </Link>
  );
};
