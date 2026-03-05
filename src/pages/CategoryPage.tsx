import { PageLayout } from "@/components/layout/PageLayout";
import { PageHero } from "@/components/layout/PageHero";
import { ComingSoonSection } from "@/components/ComingSoonSection";

interface CategoryPageProps {
  title: string;
  subtitle: string;
}

const CategoryPage = ({ title, subtitle }: CategoryPageProps) => (
  <PageLayout hideNewsletter>
    <PageHero headline={title} subtitle={subtitle} />
    <ComingSoonSection />
  </PageLayout>
);

export default CategoryPage;
