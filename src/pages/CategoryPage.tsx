import { PageLayout } from "@/components/layout/PageLayout";
import { PageHero } from "@/components/layout/PageHero";
import { ProductGrid } from "@/components/ProductGrid";
import { ReactNode } from "react";

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
    <PageHero headline={headline || title} subtitle={subtitle} compact />
    <ProductGrid
      query={`product_type:${productType}`}
      heading={title}
      label="The Collection"
      showFilters
    />
  </PageLayout>
);

export default CategoryPage;
