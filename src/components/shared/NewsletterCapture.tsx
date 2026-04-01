import { useState } from "react";
import { GrainOverlay } from "@/components/craft/GrainOverlay";
import { WaxSeal } from "@/components/craft/WaxSeal";
import { saveFoundingAccessEmail } from "@/lib/foundingAccess";

export const NewsletterCapture = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const result = await saveFoundingAccessEmail(email, "newsletter");
      if (!result.success) throw new Error(result.error);
      setSubmitted(true);
    } catch {
      // Silently fail for newsletter.
    } finally {
      setLoading(false);
      setEmail("");
    }
  };

  return (
    <div id="stacking-edit" className="border-b border-border relative overflow-hidden">
      <GrainOverlay opacity={0.03} />
      <div className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 py-14 md:py-16 relative z-[1]">
        <div className="max-w-[560px] mx-auto text-center relative">
          <WaxSeal size={36} className="absolute -top-2 -right-8 hidden md:inline-flex" />
          <p className="text-[10px] tracking-[0.3em] uppercase font-sans text-muted-foreground mb-4">
            The Stacking Edit
          </p>
          <h3 className="font-serif text-xl md:text-2xl tracking-[0.04em] font-medium mb-3">
            Get the styling formulas behind the jewelry looks everyone saves.
          </h3>
          <p className="text-[12px] text-muted-foreground font-sans mb-8 leading-relaxed">
            Weekly stack ideas, trend-led styling notes, what pieces are peaking now,
            and early access to drops before they get picked over.
          </p>
          <p className="text-[11px] text-muted-foreground font-sans mb-8 leading-relaxed max-w-[440px] mx-auto">
            Beta bonus: take the style quiz and connect with our team to join the private beta segment and receive a complimentary tennis necklace.
          </p>

          {submitted ? (
            <p className="text-[11px] tracking-[0.2em] uppercase font-sans text-foreground">
              You&apos;re on the edit. Watch for your first stack guide, beta note, and style quiz invite.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Your email address"
                required
                className="flex-1 border border-border bg-transparent px-5 py-3 text-[12px] tracking-[0.1em] font-sans text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors rounded-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="btn-gea whitespace-nowrap rounded-none disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Get the Edit"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
