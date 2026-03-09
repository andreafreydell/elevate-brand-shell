import { PageLayout } from "@/components/layout/PageLayout";
import { CategoryBanner } from "@/components/layout/CategoryBanner";
import { ProductGrid } from "@/components/ProductGrid";

interface CategoryPageProps {
  title: string;
  subtitle: string;
  /** Shopify product_type value for filtering */
  productType: string;
}

const CategoryPage = ({ title, subtitle, productType }: CategoryPageProps) => (
  <PageLayout>
    <CategoryBanner title={title} subtitle={subtitle} category={productType} />
    <ProductGrid
      query={`product_type:${productType}`}
      heading={title}
      label="The Collection"
      showFilters
    />
  </PageLayout>
);

export default CategoryPage;
