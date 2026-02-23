import { Link } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { User, Package, Clock, Heart, RefreshCw, Gem } from "lucide-react";

const dashboardSections = [
  { icon: User, title: "Profile & Preferences", description: "Style profile, size preferences, metal affinities, and communication settings." },
  { icon: Package, title: "Current Rotation", description: "What's in your hands right now. Return, keep, or swap — all from here." },
  { icon: Clock, title: "Rotation History", description: "Every piece you've worn. Dates, photos, and the option to re-request favorites." },
  { icon: Heart, title: "Vault Wishlist", description: "Save pieces for future rotations. Get notified when wishlisted items are available." },
  { icon: RefreshCw, title: "Swap & Return", description: "Initiate returns, request mid-cycle swaps, and track shipment status." },
  { icon: Gem, title: "Keep for Less", description: "Browse your current and past pieces with member-exclusive buyout pricing." },
];

const Account = () => {
  return (
    <PageLayout>
      <section className="bg-[hsl(28,22%,34%)]">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 py-20 md:py-28 text-center">
          <p className="text-[10px] tracking-[0.4em] uppercase text-[hsl(36,25%,78%)] mb-6 font-sans">
            Dashboard
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-medium text-[hsl(36,33%,93%)] tracking-[-0.01em] mb-4">
            Your Account
          </h1>
          <p className="text-[13px] text-[hsl(36,20%,75%)] font-sans max-w-[440px] mx-auto">
            Manage your rotation, track shipments, adjust preferences, and keep the pieces you love.
          </p>
        </div>
      </section>

      <SectionHeading heading="Dashboard Modules" />
      <section className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dashboardSections.map((s) => (
            <div key={s.title} className="border border-border bg-card p-8">
              <s.icon className="h-6 w-6 mb-4 stroke-[1.3] text-foreground" />
              <h3 className="font-serif text-lg font-semibold tracking-[0.02em] mb-2">{s.title}</h3>
              <p className="text-[12px] text-muted-foreground font-sans leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <p className="text-[11px] text-muted-foreground font-sans tracking-[0.15em] uppercase">
            Full dashboard available to members upon login
          </p>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 py-16 md:py-20 text-center">
          <h2 className="font-serif text-2xl md:text-3xl tracking-[0.06em] uppercase font-medium mb-4">
            Not a Member Yet?
          </h2>
          <p className="text-[12px] text-muted-foreground font-sans mb-8">
            Your rotation is waiting.
          </p>
          <Link to="/membership" className="btn-gea">
            Apply for Access
          </Link>
        </div>
      </section>
    </PageLayout>
  );
};

export default Account;
