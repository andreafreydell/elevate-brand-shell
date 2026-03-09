import { type ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export const FeaturedProduct = ({ product }: { product: ShopifyProduct }) => {
  const addItem = useCartStore(state => state.addItem);
  const isLoading = useCartStore(state => state.isLoading);
  const variant = product.node.variants.edges[0]?.node;
  const image = product.node.images.edges[0]?.node;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
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
    <section className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 py-6">
      <div className="grid md:grid-cols-2 border border-border min-h-[500px]">
        {/* Left: Image */}
        <Link to={`/product/${product.node.handle}`} className="overflow-hidden bg-card">
          {image ? (
            <img
              src={image.url}
              alt={image.altText || product.node.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full min-h-[400px] bg-secondary flex items-center justify-center">
              <span className="text-xs text-muted-foreground tracking-wider uppercase">No image</span>
            </div>
          )}
        </Link>

        {/* Right: Details */}
        <div className="bg-card flex flex-col justify-center px-8 md:px-14 py-12">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium leading-[1.05] mb-3 uppercase">
            {product.node.title}
          </h2>
          <p className="text-sm text-muted-foreground font-sans italic mb-8">Form / Light / Craft</p>

          {product.node.description && (
            <ul className="space-y-2 mb-10">
              {product.node.description.split('.').filter(Boolean).slice(0, 3).map((line, i) => (
                <li key={i} className="flex items-start gap-2 text-sm font-sans text-foreground">
                  <span className="mt-1.5 w-1.5 h-1.5 bg-foreground flex-shrink-0" />
                  {line.trim()}
                </li>
              ))}
            </ul>
          )}

          <button
            disabled
            className="self-start border border-border bg-secondary text-muted-foreground px-10 py-3.5 text-xs tracking-[0.2em] uppercase font-sans cursor-not-allowed"
          >
            Coming Soon
          </button>
        </div>
      </div>
    </section>
  );
};
