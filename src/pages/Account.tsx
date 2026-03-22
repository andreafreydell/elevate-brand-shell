import { Link } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { GrainOverlay } from "@/components/craft/GrainOverlay";
import { ScribbleUnderline } from "@/components/craft/ScribbleUnderline";
import { AnimateIn } from "@/components/shared/AnimateIn";
import { TornPaperEdge } from "@/components/craft/TornPaperEdge";
import { WaxSeal } from "@/components/craft/WaxSeal";
import { HandDrawnFrame } from "@/components/craft/HandDrawnFrame";
import { DiamondChainBorder } from "@/components/craft/DiamondChainBorder";
import { OrganicBlobTag } from "@/components/craft/OrganicBlobTag";
import { TagRedStamp } from "@/components/craft/TagRedStamp";
import { User, Package, Clock, Heart, RefreshCw, Gem } from "lucide-react";

const blobVariants: Array<"coastal" | "statement" | "modern" | "classic"> = [
  "coastal",
  "statement",
  "modern",
  "classic",
  "coastal",
  "statement",
];

const dashboardSections = [
  {
    icon: User,
    title: "Profile & Preferences",
    description:
      "Style profile, size preferences, metal affinities, and communication settings.",
  },
  {
    icon: Package,
    title: "Current Access",
    description:
      "What's in your hands right now. Return, keep, or prepare your next selection - all from here.",
  },
  {
    icon: Clock,
    title: "Access History",
    description:
      "Every piece you've worn. Dates, photos, and the option to re-request favorites.",
  },
  {
    icon: Heart,
    title: "Vault Wishlist",
    description:
      "Save pieces for future selections. Get notified when wishlisted items are available.",
  },
  {
    icon: RefreshCw,
    title: "Returns & Next Selection",
    description:
      "Initiate returns, track shipment status, and get ready for your next cycle.",
  },
  {
    icon: Gem,
    title: "Keep Your Favorite",
    description:
      "One piece per cycle is included to keep, with member pricing available on additional favorites.",
  },
];

const Account = () => {
  return (
    <PageLayout>
      <section className="relative overflow-hidden bg-[hsl(28,22%,34%)]">
        <GrainOverlay opacity={0.05} />
        <div className="relative z-[1] mx-auto max-w-[1440px] px-5 py-20 text-center sm:px-6 md:px-12 md:py-28 lg:px-16">
          <WaxSeal size={40} className="mx-auto mb-4" />
          <p className="mb-6 font-sans text-[10px] uppercase tracking-[0.4em] text-[hsl(36,25%,78%)]">
            Dashboard
          </p>
          <h1 className="mb-4 font-serif text-4xl font-medium tracking-[-0.01em] text-[hsl(36,33%,93%)] md:text-5xl">
            Your Account
          </h1>
          <p className="mx-auto max-w-[440px] font-sans text-[13px] text-[hsl(36,20%,75%)]">
            Manage your access, track shipments, adjust preferences, and keep
            the pieces you love.
          </p>
        </div>
      </section>

      <TornPaperEdge className="mx-auto max-w-[1440px]" />

      <SectionHeading heading="Dashboard Modules" />
      <section className="mx-auto max-w-[1440px] px-5 pb-16 sm:px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {dashboardSections.map((section, idx) => (
            <div
              key={section.title}
              className="relative overflow-hidden border border-border bg-card p-8"
            >
              <GrainOverlay opacity={0.03} />
              <div className="relative z-[1] mb-4 flex items-center justify-between">
                <OrganicBlobTag variant={blobVariants[idx]}>
                  {section.title.split(" ")[0]}
                </OrganicBlobTag>
                <section.icon className="h-5 w-5 stroke-[1.3] text-foreground" />
              </div>
              <h3 className="relative z-[1] mb-2 font-serif text-lg font-semibold tracking-[0.02em]">
                {section.title}
              </h3>
              <p className="relative z-[1] font-sans text-[12px] leading-relaxed text-muted-foreground">
                {section.description}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <p className="font-sans text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
            Full dashboard available to members upon login
          </p>
        </div>
      </section>

      <DiamondChainBorder className="mx-auto max-w-[1440px] px-5 sm:px-6 md:px-12 lg:px-16" />

      <section className="relative overflow-hidden border-t border-border">
        <GrainOverlay opacity={0.03} />
        <div className="relative z-[1] mx-auto max-w-[1440px] px-5 py-16 text-center sm:px-6 md:px-12 md:py-24 lg:px-16">
          <TagRedStamp size={20} className="mx-auto mb-4" />
          <AnimateIn variant="fadeUp" duration={0.5}>
            <HandDrawnFrame strokeColor="hsl(var(--foreground))">
              <h2 className="mb-4 font-serif text-2xl font-medium uppercase tracking-[0.06em] md:text-3xl">
                Not a Member{" "}
                <ScribbleUnderline color="var(--brass)" delay={0.4}>
                  Yet?
                </ScribbleUnderline>
              </h2>
              <p className="mb-8 font-sans text-[12px] text-muted-foreground">
                Your access is waiting.
              </p>
              <Link to="/how-it-works" className="btn-gea">
                Apply for Access
              </Link>
            </HandDrawnFrame>
          </AnimateIn>
        </div>
      </section>
    </PageLayout>
  );
};

export default Account;
