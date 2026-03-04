import { useState } from "react";

export const ComingSoonSection = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <section className="bg-[hsl(28,22%,34%)]">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 py-20 md:py-28 text-center">
        <p className="text-[10px] tracking-[0.4em] uppercase text-[hsl(36,25%,78%)] mb-6 font-sans">
          Coming Soon
        </p>
        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium leading-[1.1] tracking-[-0.01em] text-[hsl(36,33%,93%)] mb-4">
          We're Building{"\n"}Something Beautiful.
        </h2>
        <p className="text-[13px] text-[hsl(36,20%,75%)] font-sans max-w-[460px] mx-auto mb-4 leading-relaxed">
          GEA is launching soon. Sign up now to get priority access to drops,
          new features, a special discount on your first month, and more.
        </p>
        <p className="text-[10px] tracking-[0.2em] uppercase text-[hsl(36,25%,78%)/0.6] font-sans mb-10">
          Only 100 founding spots available
        </p>

        {submitted ? (
          <p className="text-[11px] tracking-[0.2em] uppercase font-sans text-[hsl(36,33%,93%)]">
            You're on the list. We'll be in touch.
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
              className="border border-[hsl(36,25%,78%)] text-[hsl(28,22%,34%)] bg-[hsl(36,25%,78%)] px-8 py-3.5 text-[11px] tracking-[0.2em] uppercase font-sans font-medium hover:bg-transparent hover:text-[hsl(36,25%,78%)] transition-colors whitespace-nowrap"
            >
              Get Early Access
            </button>
          </form>
        )}
      </div>
    </section>
  );
};
