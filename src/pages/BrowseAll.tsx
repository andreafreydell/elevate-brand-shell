import { PageLayout } from "@/components/layout/PageLayout";
import { PageHero } from "@/components/layout/PageHero";
import { ProductGrid } from "@/components/ProductGrid";
import { ScribbleUnderline } from "@/components/craft/ScribbleUnderline";

const BrowseAll = () => (
  <PageLayout>
    <PageHero headline={<>Browse <ScribbleUnderline>All</ScribbleUnderline></>} subtitle="The complete GEA vault — every piece, every category." />
    <ProductGrid heading="All Pieces" label="The Vault" limit={250} showFilters shuffle />
  </PageLayout>
);

export default BrowseAll;
