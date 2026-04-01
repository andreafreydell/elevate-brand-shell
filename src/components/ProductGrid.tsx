import { useEffect, useState, useMemo, useCallback } from "react";
import { storefrontApiRequest, PRODUCTS_QUERY, type ShopifyProduct } from "@/lib/shopify";
import { rankProducts } from "@/lib/productRanking";
import { ProductCard } from "./ProductCard";
import { ProductFilters, applyFilters, type FilterState } from "./ProductFilters";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const copy = [...arr];
  let s = seed;
  for (let i = copy.length - 1; i > 0; i--) {
    s = (s * 16807 + 0) % 2147483647;
    const j = s % (i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const todaySeed = () => {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
};

const PAGE_SIZE = 48;
const FULL_RANKED_FETCH_SIZE = 250;

interface ProductGridProps {
  query?: string;
  heading?: string;
  label?: string;
  limit?: number;
  showFilters?: boolean;
  shuffle?: boolean;
  lockedOccasion?: string;
}

export const ProductGrid = ({
  query,
  heading = "Current Pieces",
  label = "The Collection",
  limit = 250,
  showFilters = false,
  shuffle = false,
  lockedOccasion,
}: ProductGridProps) => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [endCursor, setEndCursor] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    color: "",
    style: "",
    occasion: lockedOccasion || "",
    sort: "",
  });

  const displayProducts = useMemo(
    () => (shuffle ? seededShuffle(products, todaySeed()) : products),
    [products, shuffle]
  );
  const rankedProducts = useMemo(
    () => (shuffle ? displayProducts : rankProducts(displayProducts, { query, lockedOccasion })),
    [displayProducts, query, lockedOccasion, shuffle]
  );
  const effectiveFilters = lockedOccasion
    ? { ...filters, occasion: lockedOccasion }
    : filters;

  useEffect(() => {
    setFilters({
      color: "",
      style: "",
      occasion: lockedOccasion || "",
      sort: "",
    });
  }, [lockedOccasion]);

  const fetchProducts = useCallback(async (after?: string | null) => {
    const isInitial = !after;
    if (isInitial) setLoading(true);
    else setLoadingMore(true);

    try {
      // Category-style grids need the full set up front so ranking is based on
      // the whole assortment, not just the first Shopify page.
      const pageSize = isInitial && showFilters
        ? Math.min(FULL_RANKED_FETCH_SIZE, limit)
        : Math.min(PAGE_SIZE, limit);
      const variables: Record<string, unknown> = { first: pageSize };
      if (query) variables.query = query;
      if (after) variables.after = after;

      const data = await storefrontApiRequest(PRODUCTS_QUERY, variables);
      const edges = data?.data?.products?.edges || [];
      const pageInfo = data?.data?.products?.pageInfo;

      if (isInitial) {
        setProducts(edges);
      } else {
        setProducts(prev => [...prev, ...edges]);
      }

      const totalAfterLoad = isInitial ? edges.length : products.length + edges.length;
      setHasNextPage(pageInfo?.hasNextPage && totalAfterLoad < limit);
      setEndCursor(pageInfo?.endCursor || null);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      if (isInitial) setLoading(false);
      else setLoadingMore(false);
    }
  }, [query, limit, products.length]);

  useEffect(() => {
    setProducts([]);
    setEndCursor(null);
    setHasNextPage(false);
    fetchProducts(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, limit]);

  const handleLoadMore = () => {
    if (endCursor && hasNextPage && !loadingMore) {
      fetchProducts(endCursor);
    }
  };

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

  const filtered = showFilters ? applyFilters(rankedProducts, effectiveFilters) : rankedProducts;

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
        <ProductFilters
          products={products}
          filters={effectiveFilters}
          onChange={setFilters}
          hiddenFilters={lockedOccasion ? ["occasion"] : []}
        />
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
        {hasNextPage && (
          <div className="flex justify-center pt-12">
            <Button
              variant="outline"
              size="lg"
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="min-w-[200px]"
            >
              {loadingMore ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                "Load More Pieces"
              )}
            </Button>
          </div>
        )}
      </section>
    </>
  );
};
