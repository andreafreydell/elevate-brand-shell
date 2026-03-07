import { Link } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHero } from "@/components/layout/PageHero";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { AnimateIn, StaggerContainer, StaggerItem } from "@/components/shared/AnimateIn";
import { GrainOverlay } from "@/components/craft/GrainOverlay";
import { WavyDivider } from "@/components/craft/WavyDivider";
import { ScribbleUnderline } from "@/components/craft/ScribbleUnderline";
import { TornPaperEdge } from "@/components/craft/TornPaperEdge";
import { HandDrawnFrame } from "@/components/craft/HandDrawnFrame";
import { TagRedStamp } from "@/components/craft/TagRedStamp";
import { StitchLineDivider } from "@/components/craft/StitchLineDivider";
import { WashiTapeNote } from "@/components/craft/WashiTapeNote";
import { MarkerCircle } from "@/components/craft/MarkerCircle";
import { ScriptNumber } from "@/components/craft/ScriptNumber";
import { OrganicBlobTag } from "@/components/craft/OrganicBlobTag";
import { Gift, Users, Sparkles } from "lucide-react";

const ReferFriend = () => {
  return (
    <PageLayout>
      <PageHero
        label="Community"
        headline={"Share the\nVault"}
        subtitle="Give a friend their first month free. Receive a month of bonus credits when they join. Access grows when shared."
      />

      <TornPaperEdge className="max-w-[1440px] mx-auto" />

      <SectionHeading label="How It Works" heading="Dual Reward Referral" />
      <section className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 pb-12">
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StaggerItem>
            <div className="border border-border bg-card p-8 text-center h-full relative overflow-hidden">
              <GrainOverlay opacity={0.03} />
              <Gift className="h-6 w-6 mx-auto mb-4 stroke-[1.3] relative z-[1]" />
              <h3 className="font-serif text-lg font-semibold mb-2 relative z-[1]">Your Friend Gets</h3>
              <p className="text-[12px] text-muted-foreground font-sans leading-relaxed relative z-[1]">
                First month <MarkerCircle color="var(--seafoam)"><span className="font-semibold text-foreground">free</span></MarkerCircle> on any tier. Full vault access. Free shipping. No commitment.
              </p>
            </div>
          </StaggerItem>
          <StaggerItem>
            <div className="border border-border bg-foreground text-background p-8 text-center h-full relative overflow-hidden">
              <GrainOverlay opacity={0.05} />
              <TagRedStamp size={18} className="absolute top-3 right-3" />
              <Users className="h-6 w-6 mx-auto mb-4 stroke-[1.3] relative z-[1]" />
              <h3 className="font-serif text-lg font-semibold mb-2 text-background relative z-[1]">You Receive</h3>
              <p className="text-[12px] text-background/70 font-sans leading-relaxed relative z-[1]">
                <ScriptNumber className="text-background/90">1</ScriptNumber> month of bonus credits toward your membership. Stackable for every referral that converts.
              </p>
            </div>
          </StaggerItem>
          <StaggerItem>
            <div className="border border-border bg-card p-8 text-center h-full relative overflow-hidden">
              <GrainOverlay opacity={0.03} />
              <Sparkles className="h-6 w-6 mx-auto mb-4 stroke-[1.3] relative z-[1]" />
              <h3 className="font-serif text-lg font-semibold mb-2 relative z-[1]">No Limit</h3>
              <p className="text-[12px] text-muted-foreground font-sans leading-relaxed relative z-[1]">
                Refer as many friends as you like. Each successful referral earns another month of credits.
              </p>
            </div>
          </StaggerItem>
        </StaggerContainer>
      </section>

      {/* WashiTape note */}
      <div className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 pb-8 hidden md:flex justify-center">
        <WashiTapeNote label="MEMBER TIP" tapeColor="var(--seafoam)" rotation={-1.5}>
          <p className="font-serif text-sm italic leading-relaxed text-foreground/80">
            "Our top referrers have earned over 6 months of free membership credits."
          </p>
        </WashiTapeNote>
      </div>

      {/* Stitch line divider */}
      <StitchLineDivider className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16" />

      <section className="border-t border-border relative overflow-hidden">
        <GrainOverlay opacity={0.03} />
        <div className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 py-16 md:py-20 text-center relative z-[1]">
          <AnimateIn variant="fadeUp" duration={0.5}>
            <HandDrawnFrame strokeColor="hsl(var(--foreground))">
              <h2 className="font-serif text-2xl md:text-3xl tracking-[0.06em] uppercase font-medium mb-4">
                Access Grows When <ScribbleUnderline color="var(--brass)" delay={0.4}>Shared</ScribbleUnderline>
              </h2>
              <p className="text-[12px] text-muted-foreground font-sans mb-8">
                Your unique referral link is available in your account dashboard.
              </p>
              <Link to="/how-it-works" className="btn-gea">
                Join to Unlock Referrals
              </Link>
            </HandDrawnFrame>
          </AnimateIn>
        </div>
      </section>
    </PageLayout>
  );
};

export default ReferFriend;
