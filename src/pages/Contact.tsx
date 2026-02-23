import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHero } from "@/components/layout/PageHero";
import { toast } from "sonner";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success("Message received. We'll be in touch within 24 hours.");
  };

  return (
    <PageLayout>
      <PageHero
        label="Concierge"
        headline={"We're Here\nfor You"}
        subtitle="Whether it's a styling question, a membership inquiry, or simply a conversation — our concierge team responds within 24 hours."
      />

      <section className="max-w-[1440px] mx-auto px-12 lg:px-16 py-16 md:py-20">
        <div className="max-w-[600px] mx-auto">
          {submitted ? (
            <div className="text-center py-16">
              <h3 className="font-serif text-2xl font-semibold mb-4">Thank You</h3>
              <p className="text-[13px] text-muted-foreground font-sans">
                Your message has been received. Our concierge team will respond within 24 hours.
              </p>
            </div>
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
              <button type="submit" className="btn-gea w-full">
                Send Message
              </button>
            </form>
          )}
        </div>
      </section>
    </PageLayout>
  );
};

export default Contact;
