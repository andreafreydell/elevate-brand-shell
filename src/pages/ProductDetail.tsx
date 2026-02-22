import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { storefrontApiRequest, PRODUCT_BY_HANDLE_QUERY } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { Navbar } from "@/components/Navbar";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ProductNode {
  id: string;
  title: string;
  description: string;
  handle: string;
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  images: { edges: Array<{ node: { url: string; altText: string | null } }> };
  variants: { edges: Array<{ node: { id: string; title: string; price: { amount: string; currencyCode: string }; availableForSale: boolean; selectedOptions: Array<{ name: string; value: string }> } }> };
  options: Array<{ name: string; values: string[] }>;
}

const ProductDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const [product, setProduct] = useState<ProductNode | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const addItem = useCartStore(state => state.addItem);
  const isLoading = useCartStore(state => state.isLoading);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await storefrontApiRequest(PRODUCT_BY_HANDLE_QUERY, { handle });
        if (data?.data?.productByHandle) setProduct(data.data.productByHandle);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-[1400px] mx-auto px-6 py-12 md:py-20">
        <div className="grid md:grid-cols-2 gap-0 border border-border">
          {/* Images */}
          <div className="border-r border-border">
            <div className="aspect-square overflow-hidden bg-card">
              {images[selectedImageIdx]?.node ? (
                <img
                  src={images[selectedImageIdx].node.url}
                  alt={images[selectedImageIdx].node.altText || product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-secondary flex items-center justify-center">
                  <span className="text-xs text-muted-foreground tracking-wider uppercase">No image</span>
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex border-t border-border">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImageIdx(i)}
                    className={`flex-1 aspect-square border-r border-border last:border-r-0 overflow-hidden ${i === selectedImageIdx ? 'opacity-100' : 'opacity-50 hover:opacity-75'} transition-opacity`}
                  >
                    <img src={img.node.url} alt={img.node.altText || ''} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4 font-sans">GEA Collection</p>
            <h1 className="font-serif text-3xl md:text-4xl font-medium leading-tight mb-4">{product.title}</h1>
            <p className="font-serif text-2xl mb-8">
              {variant?.price.currencyCode} {parseFloat(variant?.price.amount || '0').toFixed(2)}
            </p>

            {product.options.length > 0 && product.options[0].name !== 'Title' && (
              <div className="space-y-4 mb-8">
                {product.options.map((option, optIdx) => (
                  <div key={option.name}>
                    <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3 font-sans">{option.name}</p>
                    <div className="flex gap-2">
                      {option.values.map((value) => {
                        const matchingVariantIdx = product.variants.edges.findIndex(v =>
                          v.node.selectedOptions.some(o => o.name === option.name && o.value === value)
                        );
                        const isSelected = variant?.selectedOptions.some(o => o.name === option.name && o.value === value);
                        return (
                          <button
                            key={value}
                            onClick={() => matchingVariantIdx >= 0 && setSelectedVariantIdx(matchingVariantIdx)}
                            className={`border px-4 py-2 text-xs tracking-wider uppercase font-sans transition-colors ${isSelected ? 'border-foreground bg-foreground text-background' : 'border-border hover:border-foreground'}`}
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

            <button
              onClick={handleAddToCart}
              disabled={isLoading || !variant?.availableForSale}
              className="w-full border border-foreground bg-foreground text-background py-3.5 text-xs tracking-[0.2em] uppercase font-sans hover:bg-transparent hover:text-foreground transition-colors disabled:opacity-50 mb-8"
            >
              {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin mx-auto" /> : variant?.availableForSale ? "Add to Bag" : "Sold Out"}
            </button>

            {product.description && (
              <div className="border-t border-border pt-8">
                <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3 font-sans">Details</p>
                <p className="text-sm text-muted-foreground leading-relaxed font-sans">{product.description}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;
