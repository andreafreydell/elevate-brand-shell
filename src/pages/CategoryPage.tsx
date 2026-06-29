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
  /** Optional sub-collection buttons shown at the top of the collection. */
  subCollections?: SubCollection[];
}

const CategoryPage = ({ title, subtitle, productType, query, headline, clientFilter, subCollections }: CategoryPageProps) => (
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
    {subCollections && subCollections.length > 0 && (
      <div className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 pt-5 md:pt-6 flex flex-wrap gap-2.5">
        {subCollections.map((s) => (
          <Link
            key={s.to}
            to={s.to}
            className="inline-block border border-dashed px-4 py-2 font-sans text-[11px] uppercase tracking-[0.16em] transition-transform hover:-translate-y-0.5"
            style={{ borderColor: "var(--poppy)", color: "var(--poppy-deep)", background: "var(--rose-soft)" }}
          >
            {s.label} ✿
          </Link>
        ))}
      </div>
    )}
    <StackingTip productType={productType} />
    <ProductGrid
      query={query ?? `product_type:${productType}`}
      heading={title}
      label="The Collection"
      showFilters
      clientFilter={clientFilter}
    />
  </PageLayout>
);

export default CategoryPage;
