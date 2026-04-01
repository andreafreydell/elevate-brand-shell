import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { GrainOverlay } from "@/components/craft/GrainOverlay";
import { HandDrawnFrame } from "@/components/craft/HandDrawnFrame";
import { ScribbleUnderline } from "@/components/craft/ScribbleUnderline";
import { TagRedStamp } from "@/components/craft/TagRedStamp";
import { TornPaperEdge } from "@/components/craft/TornPaperEdge";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <PageLayout>
      <section className="relative overflow-hidden bg-[hsl(28,22%,34%)]">
        <GrainOverlay opacity={0.05} />
        <div className="relative z-[1] mx-auto max-w-[1440px] px-5 py-20 text-center sm:px-6 md:px-12 md:py-28 lg:px-16">
          <TagRedStamp size={24} className="mx-auto mb-4" />
          <p className="mb-6 font-sans text-[10px] uppercase tracking-[0.4em] text-[hsl(36,25%,78%)]">
            Lost the Trail
          </p>
          <h1 className="mb-4 font-serif text-4xl font-medium tracking-[-0.01em] text-[hsl(36,33%,93%)] md:text-5xl">
            This page is no longer{" "}
            <ScribbleUnderline color="var(--brass)" delay={0.4}>
              here
            </ScribbleUnderline>
          </h1>
          <p className="mx-auto max-w-[520px] font-sans text-[13px] leading-relaxed text-[hsl(36,20%,75%)]">
            The link may be outdated, or the route may have moved while the vault was being refreshed. Use one of the paths below to get back into the membership flow.
          </p>
        </div>
      </section>

      <TornPaperEdge className="mx-auto max-w-[1440px]" />

      <section className="relative overflow-hidden">
        <GrainOverlay opacity={0.03} />
        <div className="relative z-[1] mx-auto max-w-[1440px] px-5 py-16 text-center sm:px-6 md:px-12 md:py-24 lg:px-16">
          <HandDrawnFrame strokeColor="hsl(var(--foreground))">
            <h2 className="mb-4 font-serif text-2xl font-medium md:text-3xl">
              Pick up from the strongest next step
            </h2>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
              <Link to="/browse" className="btn-gea-outline">
                Browse the Vault
              </Link>
              <Link to="/how-it-works" className="btn-gea">
                See Membership
              </Link>
              <Link to="/#stacking-edit" className="btn-gea-outline">
                Get the Stacking Edit
              </Link>
            </div>
          </HandDrawnFrame>
        </div>
      </section>
    </PageLayout>
  );
};

export default NotFound;
