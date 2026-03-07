import { Link } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { GrainOverlay } from "@/components/craft/GrainOverlay";
import { WavyDivider } from "@/components/craft/WavyDivider";
import { ScribbleUnderline } from "@/components/craft/ScribbleUnderline";
import { AnimateIn } from "@/components/shared/AnimateIn";
import { TornPaperEdge } from "@/components/craft/TornPaperEdge";
import { WaxSeal } from "@/components/craft/WaxSeal";
import { HandDrawnFrame } from "@/components/craft/HandDrawnFrame";
import { DiamondChainBorder } from "@/components/craft/DiamondChainBorder";
import { OrganicBlobTag } from "@/components/craft/OrganicBlobTag";
import { TagRedStamp } from "@/components/craft/TagRedStamp";
import { StitchLineDivider } from "@/components/craft/StitchLineDivider";
import { User, Package, Clock, Heart, RefreshCw, Gem } from "lucide-react";

const blobVariants: Array<"coastal" | "statement" | "modern" | "classic"> = ["coastal", "statement", "modern", "classic", "coastal", "statement"];

const dashboardSections = [
  { icon: User, title: "Profile & Preferences", description: "Style profile, size preferences, metal affinities, and communication settings." },
  { icon: Package, title: "Current Access", description: "What's in your hands right now. Return, keep, or refresh — all from here." },
  { icon: Clock, title: "Access History", description: "Every piece you've worn. Dates, photos, and the option to re-request favorites." },
  { icon: Heart, title: "Vault Wishlist", description: "Save pieces for future selections. Get notified when wishlisted items are available." },
  { icon: RefreshCw, title: "Returns & Refresh", description: "Initiate returns, request mid-cycle refreshes, and track shipment status." },
  { icon: Gem, title: "Keep Your Favorite", description: "Browse your current and past pieces with member-exclusive pricing." },
];

const Account = () => {
  return (
    <PageLayout>
      <section className="bg-[hsl(28,22%,34%)] relative overflow-hidden">
        <GrainOverlay opacity={0.05} />
        <div className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 py-20 md:py-28 text-center relative z-[1]">
          <WaxSeal size={40} className="mx-auto mb-4" />
          <p className="text-[10px] tracking-[0.4em] uppercase text-[hsl(36,25%,78%)] mb-6 font-sans">
            Dashboard
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-medium text-[hsl(36,33%,93%)] tracking-[-0.01em] mb-4">
            Your Account
          </h1>
          <p className="text-[13px] text-[hsl(36,20%,75%)] font-sans max-w-[440px] mx-auto">
            Manage your access, track shipments, adjust preferences, and keep the pieces you love.
          </p>
        </div>
      </section>

      <TornPaperEdge className="max-w-[1440px] mx-auto" />

      <SectionHeading heading="Dashboard Modules" />
      <section className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dashboardSections.map((s, idx) => (
            <div key={s.title} className="border border-border bg-card p-8 relative overflow-hidden">
              <GrainOverlay opacity={0.03} />
              <div className="flex items-center justify-between mb-4 relative z-[1]">
                <OrganicBlobTag variant={blobVariants[idx]}>
                  {s.title.split(' ')[0]}
                </OrganicBlobTag>
                <s.icon className="h-5 w-5 stroke-[1.3] text-foreground" />
              </div>
              <h3 className="font-serif text-lg font-semibold tracking-[0.02em] mb-2 relative z-[1]">{s.title}</h3>
              <p className="text-[12px] text-muted-foreground font-sans leading-relaxed relative z-[1]">{s.description}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <p className="text-[11px] text-muted-foreground font-sans tracking-[0.15em] uppercase">
            Full dashboard available to members upon login
          </p>
        </div>
      </section>

      {/* Diamond chain border */}
      <DiamondChainBorder className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16" />

      <section className="border-t border-border relative overflow-hidden">
        <GrainOverlay opacity={0.03} />
        <div className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 py-16 md:py-20 text-center relative z-[1]">
          <TagRedStamp size={20} className="mx-auto mb-4" />
          <AnimateIn variant="fadeUp" duration={0.5}>
            <HandDrawnFrame strokeColor="hsl(var(--foreground))">
              <h2 className="font-serif text-2xl md:text-3xl tracking-[0.06em] uppercase font-medium mb-4">
                Not a Member <ScribbleUnderline color="var(--brass)" delay={0.4}>Yet?</ScribbleUnderline>
              </h2>
              <p className="text-[12px] text-muted-foreground font-sans mb-8">
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
