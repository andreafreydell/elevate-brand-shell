import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const NewsletterCapture = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from("founding_members")
        .insert({ email, source: "newsletter" });
      if (error && error.code === "23505") {
        // Already signed up — still show success
      } else if (error) throw error;
      setSubmitted(true);
    } catch {
      // Silently fail for newsletter
    } finally {
      setLoading(false);
      setEmail("");
    }
  };

  return (
    <div id="founding-access" className="border-b border-border">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 py-14 md:py-16">
        <div className="max-w-[520px] mx-auto text-center">
          <p className="text-[10px] tracking-[0.3em] uppercase font-sans text-muted-foreground mb-4">
            Founding Access
          </p>
          <h3 className="font-serif text-xl md:text-2xl tracking-[0.06em] uppercase font-medium mb-3">
            Apply for Founding Member Access
          </h3>
          <p className="text-[12px] text-muted-foreground font-sans mb-8 leading-relaxed">
            Unlock your first rotation. Founding members receive priority vault access,
            complimentary styling, and exclusive early drops.
          </p>

          {submitted ? (
            <p className="text-[11px] tracking-[0.2em] uppercase font-sans text-foreground">
              Welcome to the vault. We'll be in touch.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                className="flex-1 border border-border bg-transparent px-5 py-3 text-[12px] tracking-[0.1em] font-sans text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors rounded-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="btn-gea whitespace-nowrap rounded-none disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Apply for Access"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
