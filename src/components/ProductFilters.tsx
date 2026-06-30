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
  material: string;
  accentColor: string;
  stackingRole: string;
  sort: string;
}

interface ProductFiltersProps {
  products: ShopifyProduct[];
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  hiddenFilters?: Array<"color" | "style" | "occasion" | "material" | "accentColor" | "stackingRole">;
}

// Tidy a raw metafield value: unify the various dash characters (-, –, —) and
// collapse whitespace so near-duplicate options ("gold-finished" vs
// "gold–finished") merge into one clean choice instead of cluttering the list.
const cleanValue = (value: string) =>
  value.replace(/[‒-―]/g, "-").replace(/\s+/g, " ").trim();

// Lowercased form for matching (so the same dash/casing differences don't break filtering).
const normalizeForMatch = (value: string) => cleanValue(value).toLowerCase();

function getMetafieldValues(products: ShopifyProduct[], key: string): string[] {
  const values = new Set<string>();
  products.forEach((product) => {
    const metafield = product.node.metafields?.find((item) => item?.key === key);
    if (metafield?.value) {
      metafield.value.split(",").forEach((value) => {
        const cleaned = cleanValue(value);
        if (cleaned) {
          values.add(cleaned);
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

  const matchesMetafield = (product: ShopifyProduct, key: string, selected: string) => {
    const metafield = product.node.metafields?.find((item) => item?.key === key);
    if (!metafield?.value) return false;
    // Split the (possibly multi-value) metafield and require an exact value
    // match, so e.g. "Green" doesn't sweep in "Emerald Green".
    return metafield.value
      .split(",")
      .map((part) => normalizeForMatch(part))
      .includes(normalizeForMatch(selected));
  };

  if (filters.color) {
    filtered = filtered.filter((product) => matchesMetafield(product, "plating_color_primary", filters.color));
  }

  if (filters.style) {
    filtered = filtered.filter((product) => matchesMetafield(product, "silhouette_category", filters.style));
  }

  if (filters.material) {
    filtered = filtered.filter((product) => matchesMetafield(product, "material_category", filters.material));
  }

  if (filters.accentColor) {
    filtered = filtered.filter((product) => matchesMetafield(product, "other_predominant_color", filters.accentColor));
  }

  if (filters.stackingRole) {
    filtered = filtered.filter((product) => matchesMetafield(product, "stacking_role", filters.stackingRole));
  }

  if (filters.occasion) {
    filtered = filtered.filter((product) => matchesMetafield(product, "occasions_possible", filters.occasion));
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
  const materials = getMetafieldValues(products, "material_category");
  const accentColors = getMetafieldValues(products, "other_predominant_color");
  const stackingRoles = getMetafieldValues(products, "stacking_role");

  const hasActiveFilter =
    filters.color || filters.style || filters.occasion || filters.material ||
    filters.accentColor || filters.stackingRole || (filters.sort && filters.sort !== "default");

  const update = (key: keyof FilterState, value: string) => {
    onChange({ ...filters, [key]: value === "all" ? "" : value });
  };

  const clearAll = () => onChange({ color: "", style: "", occasion: "", material: "", accentColor: "", stackingRole: "", sort: "" });

  const filterGroups = [
    { key: "color" as const, label: "Finish", options: colors },
    { key: "material" as const, label: "Material", options: materials },
    { key: "accentColor" as const, label: "Accent Color", options: accentColors },
    { key: "stackingRole" as const, label: "Stacking Role", options: stackingRoles },
    { key: "style" as const, label: "Silhouette", options: styles },
    { key: "occasion" as const, label: "Occasion", options: occasions },
  ].filter((group) => group.options.length > 0 && !hiddenFilters.includes(group.key));

  if (filterGroups.length === 0 && products.length === 0) {
    return null;
  }

  return (
    <div className="max-w-[1400px] mx-auto px-6">
      <div className="flex flex-wrap items-center gap-3 py-4 border-b border-border">
        {filterGroups.map((group) => (
          <Select key={group.key} value={filters[group.key] || undefined} onValueChange={(value) => update(group.key, value)}>
            <SelectTrigger
              data-active={filters[group.key] ? "true" : undefined}
              className="w-[150px] shrink-0 h-9 border-border bg-transparent text-xs tracking-[0.15em] uppercase font-sans data-[active=true]:border-foreground data-[active=true]:bg-secondary [&>span]:truncate"
            >
              <SelectValue placeholder={`Pick ${group.label}`} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All {group.label}</SelectItem>
              {group.options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}

        <Select value={(filters.sort && filters.sort !== "default") ? filters.sort : undefined} onValueChange={(value) => update("sort", value)}>
          <SelectTrigger
            data-active={(filters.sort && filters.sort !== "default") ? "true" : undefined}
            className="w-[150px] shrink-0 h-9 border-border bg-transparent text-xs tracking-[0.15em] uppercase font-sans data-[active=true]:border-foreground data-[active=true]:bg-secondary [&>span]:truncate"
          >
            <SelectValue placeholder="Sort by" />
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
