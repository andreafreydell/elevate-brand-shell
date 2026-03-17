import { type ShopifyProduct } from "@/lib/shopify";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";

export interface FilterState {
  color: string;
  style: string;
  occasion: string;
  sort: string;
}

interface ProductFiltersProps {
  products: ShopifyProduct[];
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  hiddenFilters?: Array<"color" | "style" | "occasion">;
}

function getMetafieldValues(products: ShopifyProduct[], key: string): string[] {
  const values = new Set<string>();
  products.forEach((p) => {
    const mf = p.node.metafields?.find((m) => m?.key === key);
    if (mf?.value) {
      // Support comma-separated values (e.g. occasions)
      mf.value.split(",").forEach((v) => {
        const trimmed = v.trim();
        if (trimmed) values.add(trimmed);
      });
    }
  });
  return Array.from(values).sort();
}

const SORT_OPTIONS = [
  { value: "default", label: "Default" },
  { value: "price-asc", label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
];

export function applyFilters(
  products: ShopifyProduct[],
  filters: FilterState
): ShopifyProduct[] {
  let filtered = [...products];

  if (filters.color) {
    filtered = filtered.filter((p) => {
      const mf = p.node.metafields?.find((m) => m?.key === "plating_color_primary");
      return mf?.value?.toLowerCase().includes(filters.color.toLowerCase());
    });
  }

  if (filters.style) {
    filtered = filtered.filter((p) => {
      const mf = p.node.metafields?.find((m) => m?.key === "silhouette_category");
      return mf?.value?.toLowerCase().includes(filters.style.toLowerCase());
    });
  }

  if (filters.occasion) {
    filtered = filtered.filter((p) => {
      const mf = p.node.metafields?.find((m) => m?.key === "occasions_possible");
      return mf?.value?.toLowerCase().includes(filters.occasion.toLowerCase());
    });
  }

  if (filters.sort === "price-asc") {
    filtered.sort(
      (a, b) =>
        parseFloat(a.node.priceRange.minVariantPrice.amount) -
        parseFloat(b.node.priceRange.minVariantPrice.amount)
    );
  } else if (filters.sort === "price-desc") {
    filtered.sort(
      (a, b) =>
        parseFloat(b.node.priceRange.minVariantPrice.amount) -
        parseFloat(a.node.priceRange.minVariantPrice.amount)
    );
  }

  return filtered;
}

export const ProductFilters = ({
  products,
  filters,
  onChange,
  hiddenFilters = [],
}: ProductFiltersProps) => {
  const colors = getMetafieldValues(products, "plating_color_primary");
  const styles = getMetafieldValues(products, "silhouette_category");
  const occasions = getMetafieldValues(products, "occasions_possible");

  const hasActiveFilter = filters.color || filters.style || filters.occasion || (filters.sort && filters.sort !== "default");

  const update = (key: keyof FilterState, value: string) => {
    onChange({ ...filters, [key]: value === "all" ? "" : value });
  };

  const clearAll = () => onChange({ color: "", style: "", occasion: "", sort: "" });

  const filterGroups = [
    { key: "color" as const, label: "Color", options: colors },
    { key: "style" as const, label: "Style", options: styles },
    { key: "occasion" as const, label: "Occasion", options: occasions },
  ].filter((g) => g.options.length > 0 && !hiddenFilters.includes(g.key));

  if (filterGroups.length === 0 && products.length === 0) return null;

  return (
    <div className="max-w-[1400px] mx-auto px-6">
      <div className="flex flex-wrap items-center gap-3 py-4 border-b border-border">
        {filterGroups.map((group) => (
          <Select
            key={group.key}
            value={filters[group.key] || "all"}
            onValueChange={(v) => update(group.key, v)}
          >
            <SelectTrigger className="w-auto min-w-[120px] h-9 border-border bg-transparent text-xs tracking-[0.15em] uppercase font-sans">
              <SelectValue placeholder={group.label} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All {group.label}s</SelectItem>
              {group.options.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}

        <Select
          value={filters.sort || "default"}
          onValueChange={(v) => update("sort", v)}
        >
          <SelectTrigger className="w-auto min-w-[140px] h-9 border-border bg-transparent text-xs tracking-[0.15em] uppercase font-sans">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilter && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1 text-xs tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors font-sans ml-auto"
          >
            <X className="w-3 h-3" />
            Clear
          </button>
        )}
      </div>
    </div>
  );
};
