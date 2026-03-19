import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimateIn } from "@/components/shared/AnimateIn";
import { saveFoundingAccessEmail } from "@/lib/foundingAccess";

export const ComingSoonSection = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError("");
    try {
      const result = await saveFoundingAccessEmail(email, "coming-soon");
      if (!result.success) throw new Error(result.error);
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      setEmail("");
    }
  };

  return (
    <>
      {/* Mission Statement */}
      <section className="bg-card">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 py-20 md:py-28">
          <div className="max-w-[680px] mx-auto text-center">
            <AnimateIn variant="fadeIn" duration={0.8}>
              <p className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground mb-8 font-sans font-medium">
                Under Construction
              </p>
            </AnimateIn>
            <AnimateIn variant="fadeUp" delay={0.15} duration={0.8}>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-[2.8rem] font-medium leading-[1.12] tracking-[-0.01em] mb-6">
                The Vault Is Being Built.
              </h2>
            </AnimateIn>
            <AnimateIn variant="fadeUp" delay={0.3} duration={0.8}>
              <p className="text-[13px] text-muted-foreground font-sans leading-[1.8] mb-6">
                GEA was born from a simple observation: the traditional jewelry model is broken.
                Thousands spent on pieces worn fewer than five times. Drawers full of forgotten beauty.
                Value depreciating in silence.
              </p>
            </AnimateIn>
            <AnimateIn variant="fadeUp" delay={0.4} duration={0.8}>
              <p className="text-[13px] text-muted-foreground font-sans leading-[1.8]">
                We believe luxury should be experienced, not accumulated. That access is more intelligent
                than ownership. That the modern woman deserves a collection that evolves as she does —
                without the weight of permanence.
              </p>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* Member Access CTA */}
      <section className="bg-[hsl(28,22%,34%)]">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 py-20 md:py-28 text-center">
          <AnimateIn variant="fadeIn" duration={0.8}>
            <p className="text-[10px] tracking-[0.4em] uppercase text-[hsl(36,25%,78%)] mb-6 font-sans font-medium">
              Membership Access
            </p>
          </AnimateIn>
          <AnimateIn variant="fadeUp" delay={0.15} duration={0.8}>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium leading-[1.1] tracking-[-0.01em] text-[hsl(36,33%,93%)] mb-4">
              Join the Revolution.
            </h2>
          </AnimateIn>
          <AnimateIn variant="fadeUp" delay={0.3} duration={0.8}>
            <p className="text-[13px] text-[hsl(36,20%,75%)] font-sans max-w-[480px] mx-auto mb-3 leading-relaxed">
              We're curating a vault of high-design jewelry for early members.
              Sign up now for priority access to drops, launch pricing,
              and a voice in shaping GEA from the ground up.
            </p>
          </AnimateIn>
          <AnimateIn variant="fadeUp" delay={0.4} duration={0.8}>
            <p className="text-[10px] tracking-[0.2em] uppercase text-[hsl(36,25%,78%)/0.6] font-sans mb-10">
              Early access opens in phases
            </p>
          </AnimateIn>

          <AnimateIn variant="fadeUp" delay={0.5} duration={0.8}>
            {submitted ? (
              <p className="text-[11px] tracking-[0.2em] uppercase font-sans text-[hsl(36,33%,93%)]">
                {error || "You're on the list. Welcome to the revolution."}
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="max-w-[480px] mx-auto flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="flex-1 border border-[hsl(36,25%,78%)/0.4] bg-transparent px-5 py-3.5 text-[12px] tracking-[0.1em] font-sans text-[hsl(36,33%,93%)] placeholder:text-[hsl(36,20%,75%)/0.5] focus:outline-none focus:border-[hsl(36,25%,78%)] transition-colors"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="border border-[hsl(36,25%,78%)] text-[hsl(28,22%,34%)] bg-[hsl(36,25%,78%)] px-8 py-3.5 text-[11px] tracking-[0.2em] uppercase font-sans font-medium hover:bg-transparent hover:text-[hsl(36,25%,78%)] transition-colors whitespace-nowrap disabled:opacity-50"
                >
                  {loading ? "Applying..." : "Apply for Access"}
                </button>
              </form>
            )}
          </AnimateIn>

          <AnimateIn variant="fadeUp" delay={0.6} duration={0.8}>
            <div className="mt-10">
              <Link
                to="/how-it-works"
                className="text-[11px] tracking-[0.15em] uppercase font-sans text-[hsl(36,25%,78%)] border-b border-[hsl(36,25%,78%)/0.3] pb-0.5 hover:border-[hsl(36,25%,78%)] transition-colors"
              >
                Learn How It Works
              </Link>
            </div>
          </AnimateIn>
        </div>
      </section>
    </>
  );
};
