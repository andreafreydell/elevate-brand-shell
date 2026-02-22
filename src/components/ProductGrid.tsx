import { useEffect, useState } from "react";
import { storefrontApiRequest, PRODUCTS_QUERY, type ShopifyProduct } from "@/lib/shopify";
import { ProductCard } from "./ProductCard";
import { Loader2 } from "lucide-react";

export const ProductGrid = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await storefrontApiRequest(PRODUCTS_QUERY, { first: 20 });
        if (data?.data?.products?.edges) {
          setProducts(data.data.products.edges);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-24">
        <p className="text-sm tracking-wider uppercase text-muted-foreground">No products found</p>
      </div>
    );
  }

  return (
    <section id="collection" className="max-w-[1400px] mx-auto px-6 py-16 md:py-24">
      <div className="mb-12">
        <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3 font-sans">The Collection</p>
        <h2 className="font-serif text-3xl md:text-4xl font-medium">Current Pieces</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1px] bg-border">
        {products.map((product) => (
          <div key={product.node.id} className="bg-background p-6">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
};
