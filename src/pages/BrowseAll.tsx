import { PageLayout } from "@/components/layout/PageLayout";
import { PageHero } from "@/components/layout/PageHero";
import { ComingSoonSection } from "@/components/ComingSoonSection";

const BrowseAll = () => (
  <PageLayout>
    <PageHero headline="Browse All" subtitle="The complete GEA vault — every piece, every category." />
    <ComingSoonSection />
  </PageLayout>
);

export default BrowseAll;
