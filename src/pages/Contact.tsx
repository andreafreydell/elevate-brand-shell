import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHero } from "@/components/layout/PageHero";
import { AnimateIn } from "@/components/shared/AnimateIn";
import { GrainOverlay } from "@/components/craft/GrainOverlay";
import { WaxSeal } from "@/components/craft/WaxSeal";
import { TornPaperEdge } from "@/components/craft/TornPaperEdge";
import { HandDrawnRect } from "@/components/craft/HandDrawnRect";
import { StampBadge } from "@/components/craft/StampBadge";
import { StitchLineDivider } from "@/components/craft/StitchLineDivider";
import { TagRedStamp } from "@/components/craft/TagRedStamp";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke("send-contact-email", {
        body: form,
      });
      if (error) throw error;
      setSubmitted(true);
      toast.success("Message received. We'll be in touch within 24 hours.");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <PageHero
        label="Concierge"
        headline={"We're Here\nfor You"}
        subtitle="Whether it's a styling question, a membership inquiry, or simply a conversation — our concierge team responds within 24 hours."
      />

      <TornPaperEdge className="max-w-[1440px] mx-auto" />

      <section className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 py-16 md:py-20">
        <AnimateIn variant="fadeUp" duration={0.6}>
          <div className="max-w-[600px] mx-auto relative">
            <WaxSeal size={32} className="absolute -top-2 -right-8 hidden md:inline-flex" />
            <StampBadge text="CONCIERGE" subtext="24h" rotation={8} className="absolute -top-4 -left-12 hidden lg:inline-flex" />
            {submitted ? (
              <HandDrawnRect>
                <div className="text-center py-16 relative overflow-hidden">
                  <GrainOverlay opacity={0.03} />
                  <TagRedStamp size={20} className="mx-auto mb-4" />
                  <h3 className="font-serif text-2xl font-semibold mb-4 relative z-[1]">Thank You</h3>
                  <p className="text-[13px] text-muted-foreground font-sans relative z-[1]">
                    Your message has been received. Our concierge team will respond within 24 hours.
                  </p>
                </div>
              </HandDrawnRect>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="text-[10px] tracking-[0.25em] uppercase font-sans text-muted-foreground block mb-2">Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full border border-border bg-transparent px-5 py-3 text-[13px] font-sans text-foreground focus:outline-none focus:border-foreground transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] tracking-[0.25em] uppercase font-sans text-muted-foreground block mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full border border-border bg-transparent px-5 py-3 text-[13px] font-sans text-foreground focus:outline-none focus:border-foreground transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] tracking-[0.25em] uppercase font-sans text-muted-foreground block mb-2">Subject</label>
                  <input
                    type="text"
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full border border-border bg-transparent px-5 py-3 text-[13px] font-sans text-foreground focus:outline-none focus:border-foreground transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] tracking-[0.25em] uppercase font-sans text-muted-foreground block mb-2">Message</label>
                  <textarea
                    required
                    rows={6}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full border border-border bg-transparent px-5 py-3 text-[13px] font-sans text-foreground focus:outline-none focus:border-foreground transition-colors resize-none"
                  />
                </div>
                <StitchLineDivider />
                <button type="submit" disabled={loading} className="btn-gea w-full disabled:opacity-50">
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>
        </AnimateIn>
      </section>
    </PageLayout>
  );
};

export default Contact;
