import { useEffect, useState } from "react";
import { storefrontApiRequest, PRODUCTS_QUERY, type ShopifyProduct } from "@/lib/shopify";
import { ProductCard } from "./ProductCard";
import { ProductFilters, applyFilters, type FilterState } from "./ProductFilters";
import { Loader2 } from "lucide-react";

interface ProductGridProps {
  query?: string;
  heading?: string;
  label?: string;
  limit?: number;
  showFilters?: boolean;
}

export const ProductGrid = ({
  query,
  heading = "Current Pieces",
  label = "The Collection",
  limit = 50,
  showFilters = false,
}: ProductGridProps) => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({ color: "", style: "", occasion: "", sort: "" });

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const variables: Record<string, unknown> = { first: limit };
        if (query) variables.query = query;
        const data = await storefrontApiRequest(PRODUCTS_QUERY, variables);
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
  }, [query, limit]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const filtered = showFilters ? applyFilters(products, filters) : products;

  if (products.length === 0) {
    return (
      <div className="text-center py-24">
        <p className="text-sm tracking-wider uppercase text-muted-foreground">No products found</p>
      </div>
    );
  }

  return (
    <>
      {showFilters && (
        <ProductFilters products={products} filters={filters} onChange={setFilters} />
      )}
      <section className="max-w-[1400px] mx-auto px-6 py-16 md:py-24">
        {heading && (
          <div className="mb-12">
            {label && (
              <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3 font-sans">{label}</p>
            )}
            <h2 className="font-serif text-3xl md:text-4xl font-medium">{heading}</h2>
          </div>
        )}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-[1px] bg-border">
          {filtered.map((product, i) => (
            <div key={product.node.id} className="bg-background p-3 sm:p-6">
              <ProductCard product={product} index={i} />
            </div>
          ))}
        </div>
        {showFilters && filtered.length === 0 && products.length > 0 && (
          <div className="text-center py-16">
            <p className="text-sm tracking-wider uppercase text-muted-foreground">No pieces match your filters</p>
          </div>
        )}
      </section>
    </>
  );
};
