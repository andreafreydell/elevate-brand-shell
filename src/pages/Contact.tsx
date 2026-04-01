import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHero } from "@/components/layout/PageHero";
import { AnimateIn } from "@/components/shared/AnimateIn";
import { GrainOverlay } from "@/components/craft/GrainOverlay";
import { ScribbleUnderline } from "@/components/craft/ScribbleUnderline";
import { WaxSeal } from "@/components/craft/WaxSeal";
import { TornPaperEdge } from "@/components/craft/TornPaperEdge";
import { HandDrawnRect } from "@/components/craft/HandDrawnRect";
import { StampBadge } from "@/components/craft/StampBadge";
import { StitchLineDivider } from "@/components/craft/StitchLineDivider";
import { TagRedStamp } from "@/components/craft/TagRedStamp";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const topicPresets = {
  membership: {
    label: "Membership",
    subject: "Membership Question",
    message: "Hi GEA team,\n\nI have a question about membership, pricing, or how the cycle works.\n",
  },
  press: {
    label: "Press",
    subject: "Press Inquiry",
    message: "Hi GEA team,\n\nI'm reaching out with a press request.\n",
  },
  damage: {
    label: "Damage",
    subject: "Damage or Repair Help",
    message: "Hi GEA team,\n\nI need help with a piece that may need repair.\n",
  },
  "stacking-edit": {
    label: "The Stacking Edit",
    subject: "The Stacking Edit Question",
    message: "Hi GEA team,\n\nI have a question about The Stacking Edit, the style quiz, or current offers.\n",
  },
  ambassador: {
    label: "Ambassador",
    subject: "Ambassador Application",
    message:
      "Hi GEA team,\n\nI'd like to apply for the ambassador program.\n\nMy platform:\nMy audience:\nWhy GEA is a fit:\n",
  },
} as const;

const Contact = () => {
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const topicParam = searchParams.get("topic") as keyof typeof topicPresets | null;

  useEffect(() => {
    if (!topicParam || !(topicParam in topicPresets)) {
      return;
    }

    const preset = topicPresets[topicParam];
    setForm((current) => ({
      ...current,
      subject: current.subject || preset.subject,
      message: current.message || preset.message,
    }));
  }, [topicParam]);

  const applyPreset = (key: keyof typeof topicPresets) => {
    const preset = topicPresets[key];
    setForm((current) => ({
      ...current,
      subject: preset.subject,
      message: preset.message,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.functions.invoke("send-contact-email", {
        body: form,
      });

      if (error) {
        throw error;
      }

      setSubmitted(true);
      toast.success("Message received. We'll be in touch soon.");
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
        headline={
          <>
            We're Here
            <br />
            for <ScribbleUnderline>You</ScribbleUnderline>
          </>
        }
        subtitle="Whether it's membership, press, repair support, or a Stacking Edit question, send us a note and we'll route it to the right person."
      />

      <TornPaperEdge className="max-w-[1440px] mx-auto" />

      <section className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 py-16 md:py-24">
        <AnimateIn variant="fadeUp" duration={0.6}>
          <div className="max-w-[600px] mx-auto relative">
            <WaxSeal size={32} className="absolute -top-2 -right-8 hidden md:inline-flex" />
            <StampBadge
              text="CONCIERGE"
              subtext="GEA"
              rotation={8}
              className="absolute -top-4 -left-12 hidden lg:inline-flex"
            />
            {submitted ? (
              <HandDrawnRect>
                <div className="text-center py-16 relative overflow-hidden">
                  <GrainOverlay opacity={0.03} />
                  <TagRedStamp size={20} className="mx-auto mb-4" />
                  <h3 className="font-serif text-2xl font-semibold mb-4 relative z-[1]">Thank You</h3>
                  <p className="text-[13px] text-muted-foreground font-sans relative z-[1]">
                    Your message has been received. A member of the GEA team will follow up soon.
                  </p>
                </div>
              </HandDrawnRect>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <p className="text-[10px] tracking-[0.25em] uppercase font-sans text-muted-foreground block mb-3">
                    Quick Entry
                  </p>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {Object.entries(topicPresets).map(([key, preset]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => applyPreset(key as keyof typeof topicPresets)}
                        className="border border-border px-4 py-3 text-[10px] uppercase tracking-[0.2em] font-sans text-foreground transition-colors hover:border-foreground hover:bg-card"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                  <p className="mt-3 text-[12px] font-sans text-muted-foreground">
                    Choose the closest topic to prefill your note, then tailor it however you like.
                  </p>
                </div>

                <div>
                  <label className="text-[10px] tracking-[0.25em] uppercase font-sans text-muted-foreground block mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full border border-border bg-transparent px-5 py-3 text-[13px] font-sans text-foreground focus:outline-none focus:border-foreground transition-colors"
                  />
                </div>

                <div>
                  <label className="text-[10px] tracking-[0.25em] uppercase font-sans text-muted-foreground block mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full border border-border bg-transparent px-5 py-3 text-[13px] font-sans text-foreground focus:outline-none focus:border-foreground transition-colors"
                  />
                </div>

                <div>
                  <label className="text-[10px] tracking-[0.25em] uppercase font-sans text-muted-foreground block mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full border border-border bg-transparent px-5 py-3 text-[13px] font-sans text-foreground focus:outline-none focus:border-foreground transition-colors"
                  />
                </div>

                <div>
                  <label className="text-[10px] tracking-[0.25em] uppercase font-sans text-muted-foreground block mb-2">
                    Message
                  </label>
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
