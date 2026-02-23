import { Link } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { SectionHeading } from "@/components/layout/SectionHeading";

const editorials = [
  { title: "The Art of Rotation", label: "Style Guide", description: "How to build a monthly rotation that transitions from desk to dinner to weekend." },
  { title: "Moissanite vs Diamond", label: "Material Story", description: "Why lab-created brilliance outperforms mined stones — optically, ethically, and economically." },
  { title: "Your First Rotation Ritual", label: "New Member", description: "A guide to unpacking, styling, and photographing your first GEA shipment." },
  { title: "Event Dressing by Piece", label: "Occasion Guide", description: "Matching your rotation to your calendar: galas, meetings, brunches, and everything between." },
  { title: "The Monthly Drop", label: "New Arrivals", description: "What's entering the vault this month. First look, first access, first rotation." },
  { title: "Founding Members Speak", label: "Community", description: "Transformation stories from women who replaced their jewelry drawers with a rotation." },
];

const Stories = () => {
  return (
    <PageLayout>
      <section className="bg-[hsl(28,22%,34%)]">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 py-20 md:py-28 text-center">
          <p className="text-[10px] tracking-[0.4em] uppercase text-[hsl(36,25%,78%)] mb-6 font-sans">
            Journal
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-medium text-[hsl(36,33%,93%)] tracking-[-0.01em] mb-4">
            The Edit
          </h1>
          <p className="text-[13px] text-[hsl(36,20%,75%)] font-sans max-w-[440px] mx-auto">
            Style guides, rotation rituals, material stories, and monthly drops — 
            curated for women who live lighter.
          </p>
        </div>
      </section>

      <SectionHeading label="Latest" heading="From the House" />
      <section className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {editorials.map((e) => (
            <div key={e.title} className="border border-border bg-card group">
              <div className="aspect-[4/3] bg-secondary flex items-center justify-center">
                <span className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
                  Editorial Image
                </span>
              </div>
              <div className="p-6">
                <p className="text-[10px] tracking-[0.25em] uppercase font-sans text-muted-foreground mb-2">
                  {e.label}
                </p>
                <h3 className="font-serif text-lg font-semibold tracking-[0.02em] mb-2 group-hover:opacity-70 transition-opacity">
                  {e.title}
                </h3>
                <p className="text-[12px] text-muted-foreground font-sans leading-relaxed">
                  {e.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </PageLayout>
  );
};

export default Stories;
