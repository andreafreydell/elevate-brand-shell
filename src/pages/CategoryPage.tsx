import { PageLayout } from "@/components/layout/PageLayout";
import { ProductGrid } from "@/components/ProductGrid";
import { ReactNode } from "react";
import { GrainOverlay } from "@/components/craft/GrainOverlay";

interface CategoryPageProps {
  title: string;
  subtitle: string;
  /** Shopify product_type value for filtering */
  productType: string;
  /** Optional custom headline with JSX (e.g. ScribbleUnderline) */
  headline?: ReactNode;
}

const CategoryPage = ({ title, subtitle, productType, headline }: CategoryPageProps) => (
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
    <ProductGrid
      query={`product_type:${productType}`}
      heading={title}
      label="The Collection"
      showFilters
    />
  </PageLayout>
);

export default CategoryPage;
