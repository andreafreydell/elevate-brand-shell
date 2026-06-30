import { useState } from "react";
import { Link } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { ProductGrid } from "@/components/ProductGrid";
import { ReactNode } from "react";
import { GrainOverlay } from "@/components/craft/GrainOverlay";
import { StackingTip } from "@/components/craft/StackingTip";
import { type ShopifyProduct } from "@/lib/shopify";

interface SubCollection {
  label: string;
  to: string;
}

interface FilterGroup {
  label: string;
  re: RegExp;
}

interface CategoryPageProps {
  title: string;
  subtitle: string;
  /** Shopify product_type value for filtering */
  productType: string;
  /** Optional Shopify search query override (defaults to `product_type:${productType}`) */
  query?: string;
  /** Optional custom headline with JSX (e.g. ScribbleUnderline) */
  headline?: ReactNode;
  /** Optional client-side predicate to narrow the set (e.g. by a metafield). */
  clientFilter?: (product: ShopifyProduct) => boolean;
  /** Optional "back up to the whole category" link(s) shown first (e.g. All Necklaces). */
  parentLinks?: SubCollection[];
  /** Optional sub-collection buttons shown at the top of the collection. */
  subCollections?: SubCollection[];
  /** Optional in-collection filter dropdown (matched against the product title). */
  filterGroups?: FilterGroup[];
}

const titleOf = (p: ShopifyProduct) => ((p.node as { title?: string }).title || "");

const CategoryPage = ({ title, subtitle, productType, query, headline, clientFilter, parentLinks, subCollections, filterGroups }: CategoryPageProps) => {
  const [active, setActive] = useState("all");

  const effectiveFilter = filterGroups
    ? (p: ShopifyProduct) => {
        const t = titleOf(p);
        if (active === "all") return filterGroups.some((g) => g.re.test(t));
        const g = filterGroups.find((x) => x.label === active);
        return g ? g.re.test(t) : true;
      }
    : clientFilter;

  return (
    <PageLayout>
      <section className="bg-foreground relative overflow-hidden">
        <GrainOverlay opacity={0.05} />
        <div className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 py-6 md:py-10 flex flex-col md:flex-row md:items-end md:justify-between gap-2 md:gap-8 relative z-[1]">
          <h1 className="font-serif text-2xl md:text-4xl lg:text-[3rem] font-medium leading-tight tracking-[-0.01em] text-background">
            {headline || title}
          </h1>
          <p className="text-[11px] md:text-[13px] leading-relaxed text-background/60 max-w-[440px] font-sans shrink-0">
            {subtitle}
          </p>
        </div>
      </section>

      {((parentLinks && parentLinks.length > 0) || (subCollections && subCollections.length > 0) || filterGroups) && (
        <div className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 pt-5 md:pt-6 flex flex-wrap items-center gap-2.5">
          {parentLinks?.map((p) => (
            <Link
              key={p.to}
              to={p.to}
              className="inline-flex items-center gap-1.5 border px-4 py-2 font-sans text-[11px] uppercase tracking-[0.16em] transition-transform hover:-translate-y-0.5"
              style={{ borderColor: "var(--poppy-deep)", background: "var(--poppy-deep)", color: "#fff" }}
            >
              <span aria-hidden="true">←</span> {p.label}
            </Link>
          ))}
          {subCollections?.map((s) => (
            <Link
              key={s.to}
              to={s.to}
              className="inline-block border border-dashed px-4 py-2 font-sans text-[11px] uppercase tracking-[0.16em] transition-transform hover:-translate-y-0.5"
              style={{ borderColor: "var(--poppy)", color: "var(--poppy-deep)", background: "var(--rose-soft)" }}
            >
              {s.label} ✿
            </Link>
          ))}
          {filterGroups && (
            <label className="inline-flex items-center gap-2">
              <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Filter</span>
              <select
                value={active}
                onChange={(e) => setActive(e.target.value)}
                className="cursor-pointer border px-3 py-2 font-sans text-[11px] uppercase tracking-[0.14em] outline-none"
                style={{ borderColor: "var(--seafoam)", color: "var(--meadow)", background: "hsl(170 30% 95%)" }}
              >
                <option value="all">All</option>
                {filterGroups.map((g) => (
                  <option key={g.label} value={g.label}>{g.label}</option>
                ))}
              </select>
            </label>
          )}
        </div>
      )}

      <StackingTip productType={productType} />
      <ProductGrid
        query={query ?? `product_type:${productType}`}
        heading={title}
        label="The Collection"
        showFilters
        clientFilter={effectiveFilter}
      />
    </PageLayout>
  );
};

export default CategoryPage;
