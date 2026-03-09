import { useEffect, useState } from "react";
import { storefrontApiRequest, PRODUCTS_QUERY, type ShopifyProduct } from "@/lib/shopify";
import { ProductCard } from "./ProductCard";
import { ProductFilters, applyFilters, type FilterState } from "./ProductFilters";
import { Skeleton } from "@/components/ui/skeleton";

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
      <section className="max-w-[1400px] mx-auto px-6 py-16 md:py-24">
        <div className="mb-12">
          <Skeleton className="h-3 w-24 mb-3" />
          <Skeleton className="h-9 w-56" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-[1px] bg-border">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-background p-3 sm:p-6">
              <div className="border border-border bg-card overflow-hidden">
                <Skeleton className="aspect-square w-full" />
                <div className="p-5 space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
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
          {filtered.map((product) => (
            <div key={product.node.id} className="bg-background p-3 sm:p-6">
              <ProductCard product={product} />
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
