import { PageLayout } from "@/components/layout/PageLayout";
import { PageHero } from "@/components/layout/PageHero";
import { ComingSoonSection } from "@/components/ComingSoonSection";
import { ScribbleUnderline } from "@/components/craft/ScribbleUnderline";

const BrowseAll = () => (
  <PageLayout hideNewsletter>
    <PageHero headline={<>Browse <ScribbleUnderline>All</ScribbleUnderline></>} subtitle="The complete GEA vault — every piece, every category." />
    <ComingSoonSection />
  </PageLayout>
);

export default BrowseAll;
