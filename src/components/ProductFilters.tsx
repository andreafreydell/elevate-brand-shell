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
  products.forEach((product) => {
    const metafield = product.node.metafields?.find((item) => item?.key === key);
    if (metafield?.value) {
      metafield.value.split(",").forEach((value) => {
        const trimmed = value.trim();
        if (trimmed) {
          values.add(trimmed);
        }
      });
    }
  });

  return Array.from(values).sort();
}

const SORT_OPTIONS = [
  { value: "default", label: "GEA Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export function applyFilters(products: ShopifyProduct[], filters: FilterState): ShopifyProduct[] {
  let filtered = [...products];

  if (filters.color) {
    filtered = filtered.filter((product) => {
      const metafield = product.node.metafields?.find((item) => item?.key === "plating_color_primary");
      return metafield?.value?.toLowerCase().includes(filters.color.toLowerCase());
    });
  }

  if (filters.style) {
    filtered = filtered.filter((product) => {
      const metafield = product.node.metafields?.find((item) => item?.key === "silhouette_category");
      return metafield?.value?.toLowerCase().includes(filters.style.toLowerCase());
    });
  }

  if (filters.occasion) {
    filtered = filtered.filter((product) => {
      const metafield = product.node.metafields?.find((item) => item?.key === "occasions_possible");
      return metafield?.value?.toLowerCase().includes(filters.occasion.toLowerCase());
    });
  }

  if (filters.sort === "price-asc") {
    filtered.sort(
      (left, right) =>
        Number.parseFloat(left.node.priceRange.minVariantPrice.amount) -
        Number.parseFloat(right.node.priceRange.minVariantPrice.amount),
    );
  } else if (filters.sort === "price-desc") {
    filtered.sort(
      (left, right) =>
        Number.parseFloat(right.node.priceRange.minVariantPrice.amount) -
        Number.parseFloat(left.node.priceRange.minVariantPrice.amount),
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

  const hasActiveFilter =
    filters.color || filters.style || filters.occasion || (filters.sort && filters.sort !== "default");

  const update = (key: keyof FilterState, value: string) => {
    onChange({ ...filters, [key]: value === "all" ? "" : value });
  };

  const clearAll = () => onChange({ color: "", style: "", occasion: "", sort: "" });

  const filterGroups = [
    { key: "color" as const, label: "Color", options: colors },
    { key: "style" as const, label: "Style", options: styles },
    { key: "occasion" as const, label: "Occasion", options: occasions },
  ].filter((group) => group.options.length > 0 && !hiddenFilters.includes(group.key));

  if (filterGroups.length === 0 && products.length === 0) {
    return null;
  }

  return (
    <div className="max-w-[1400px] mx-auto px-6">
      <div className="flex flex-wrap items-center gap-3 py-4 border-b border-border">
        {filterGroups.map((group) => (
          <Select key={group.key} value={filters[group.key] || "all"} onValueChange={(value) => update(group.key, value)}>
            <SelectTrigger className="w-auto min-w-[120px] h-9 border-border bg-transparent text-xs tracking-[0.15em] uppercase font-sans">
              <SelectValue placeholder={group.label} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All {group.label}s</SelectItem>
              {group.options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}

        <Select value={filters.sort || "default"} onValueChange={(value) => update("sort", value)}>
          <SelectTrigger className="w-auto min-w-[140px] h-9 border-border bg-transparent text-xs tracking-[0.15em] uppercase font-sans">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
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
