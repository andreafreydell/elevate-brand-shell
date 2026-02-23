import { Link } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHero } from "@/components/layout/PageHero";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { Gift, Users, Sparkles } from "lucide-react";

const ReferFriend = () => {
  return (
    <PageLayout>
      <PageHero
        label="Community"
        headline={"Share the\nVault"}
        subtitle="Give a friend their first rotation free. Receive a month of bonus credits when they join. Access grows when shared."
      />

      <SectionHeading label="How It Works" heading="Dual Reward Referral" />
      <section className="max-w-[1440px] mx-auto px-12 lg:px-16 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-border bg-card p-8 text-center">
            <Gift className="h-6 w-6 mx-auto mb-4 stroke-[1.3]" />
            <h3 className="font-serif text-lg font-semibold mb-2">Your Friend Gets</h3>
            <p className="text-[12px] text-muted-foreground font-sans leading-relaxed">
              First month free on any tier. Full vault access. Free shipping. No commitment.
            </p>
          </div>
          <div className="border border-border bg-foreground text-background p-8 text-center">
            <Users className="h-6 w-6 mx-auto mb-4 stroke-[1.3]" />
            <h3 className="font-serif text-lg font-semibold mb-2">You Receive</h3>
            <p className="text-[12px] text-background/70 font-sans leading-relaxed">
              One month of bonus credits toward your membership. Stackable for every referral that converts.
            </p>
          </div>
          <div className="border border-border bg-card p-8 text-center">
            <Sparkles className="h-6 w-6 mx-auto mb-4 stroke-[1.3]" />
            <h3 className="font-serif text-lg font-semibold mb-2">No Limit</h3>
            <p className="text-[12px] text-muted-foreground font-sans leading-relaxed">
              Refer as many friends as you like. Each successful referral earns another month of credits.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="max-w-[1440px] mx-auto px-12 lg:px-16 py-16 md:py-20 text-center">
          <h2 className="font-serif text-2xl md:text-3xl tracking-[0.06em] uppercase font-medium mb-4">
            Access Grows When Shared
          </h2>
          <p className="text-[12px] text-muted-foreground font-sans mb-8">
            Your unique referral link is available in your account dashboard.
          </p>
          <Link to="/membership" className="btn-gea">
            Join to Unlock Referrals
          </Link>
        </div>
      </section>
    </PageLayout>
  );
};

export default ReferFriend;
