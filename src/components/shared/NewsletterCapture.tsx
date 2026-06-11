import { useState } from "react";
import { GrainOverlay } from "@/components/craft/GrainOverlay";
import { WaxSeal } from "@/components/craft/WaxSeal";
import { saveFoundingAccessEmail } from "@/lib/foundingAccess";

export const NewsletterCapture = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email || !name) return;

    setLoading(true);
    try {
      const result = await saveFoundingAccessEmail(email, "next-chapter");
      if (!result.success) throw new Error(result.error);
    } catch {
      // Capture failure shouldn't block the experience.
    } finally {
      // Start The Next Chapter with their identity in hand.
      window.location.href = `/next-chapter/index.html?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`;
    }
  };

  return (
    <div
      id="next-chapter"
      className="border-b border-border relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, var(--rose-soft) 0%, transparent 45%)" }}
    >
      <GrainOverlay opacity={0.03} />
      <div className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 py-14 md:py-16 relative z-[1]">
        <div
          className="max-w-[600px] mx-auto text-center relative border border-dashed p-8 md:p-10"
          style={{ borderColor: "var(--poppy)" }}
        >
          <WaxSeal size={36} className="absolute -top-4 -right-4 hidden md:inline-flex" />
          <p className="text-[10px] tracking-[0.3em] uppercase font-sans text-muted-foreground mb-2">
            The Next Chapter <span aria-hidden="true" style={{ color: "var(--poppy)" }}>✿</span>
          </p>
          <p
            className="mb-4 text-[1.25rem]"
            style={{ fontFamily: "var(--font-script)", color: "var(--poppy-deep)" }}
          >
            a notebook for the journey ✿
          </p>
          <h3 className="font-serif text-xl md:text-2xl tracking-[0.04em] font-medium mb-3">
            A monthly companion, written for who you're becoming.
          </h3>
          <p className="text-[12px] text-muted-foreground font-sans mb-8 leading-relaxed max-w-[460px] mx-auto">
            Answer a few playful questions, receive your Becoming Profile, and open your first
            chapter — styling challenges, gentle goals, jewelry rituals, and word from members
            out in the world.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-[440px] mx-auto">
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your first name"
              required
              className="border border-border bg-transparent px-5 py-3 text-[12px] tracking-[0.1em] font-sans text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors rounded-none"
            />
            <div className="flex flex-col sm:flex-row gap-3">
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
                {loading ? "Opening..." : "Start My Notebook"}
              </button>
            </div>
          </form>
          <p
            className="mt-5 text-[1.05rem]"
            style={{ fontFamily: "var(--font-script)", color: "var(--meadow)" }}
          >
            takes about three minutes — your first chapter is waiting ✿
          </p>
        </div>
      </div>
    </div>
  );
};
