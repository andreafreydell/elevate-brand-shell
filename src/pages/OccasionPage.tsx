import { Navigate, useParams } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { ProductGrid } from "@/components/ProductGrid";
import { GrainOverlay } from "@/components/craft/GrainOverlay";

const OccasionPage = () => {
  const { occasion } = useParams<{ occasion: string }>();
  const decodedOccasion = occasion ? decodeURIComponent(occasion) : "";

  if (!decodedOccasion) {
    return <Navigate to="/browse" replace />;
  }

  return (
    <PageLayout>
      <section className="bg-foreground relative overflow-hidden">
        <GrainOverlay opacity={0.05} />
        <div className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 py-6 md:py-10 flex flex-col md:flex-row md:items-end md:justify-between gap-2 md:gap-8 relative z-[1]">
          <h1 className="font-serif text-2xl md:text-4xl lg:text-[3rem] font-medium leading-tight tracking-[-0.01em] text-background">
            {decodedOccasion}
          </h1>
          <p className="text-[11px] md:text-[13px] leading-relaxed text-background/60 max-w-[440px] font-sans shrink-0">
            Pieces curated for {decodedOccasion.toLowerCase()} moments so you can style the look faster, wear it through membership, and keep the favorite that earns a permanent place in your collection.
          </p>
        </div>
      </section>
      <ProductGrid
        heading={decodedOccasion}
        label="Occasion"
        showFilters
        limit={250}
        lockedOccasion={decodedOccasion}
      />
    </PageLayout>
  );
};

export default OccasionPage;
