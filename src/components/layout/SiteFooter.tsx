import { Link } from "react-router-dom";
import { NewsletterCapture } from "@/components/shared/NewsletterCapture";
import { WavyDivider } from "@/components/craft/WavyDivider";

const footerLinks = {
  Membership: [
    { label: "How It Works", href: "/how-it-works" },
    { label: "Refer a Friend", href: "/refer" },
    { label: "Ambassador", href: "/ambassador" },
  ],
  Company: [
    { label: "About GEA", href: "/about" },
    { label: "Sustainability", href: "/sustainability" },
    { label: "The Edit", href: "/stories" },
    { label: "Press", href: "/press" },
  ],
  Help: [
    { label: "FAQ", href: "/faq" },
    { label: "Care & Repair", href: "/care" },
    { label: "Contact", href: "/contact" },
  ],
};

export const SiteFooter = ({ hideNewsletter }: { hideNewsletter?: boolean }) => {
  return (
    <footer className="border-t border-border bg-background">
      {!hideNewsletter && <NewsletterCapture />}

      <WavyDivider className="mx-auto max-w-[1440px] px-5 sm:px-6 md:px-12 lg:px-16" />

      <div className="mx-auto max-w-[1440px] px-5 py-14 sm:px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div>
            <Link
              to="/"
              className="font-serif text-2xl font-semibold italic tracking-[0.12em]"
            >
              Gea
            </Link>
            <p className="mt-4 max-w-[200px] font-sans text-[11px] leading-relaxed text-muted-foreground">
              Unlimited Designer Jewelry.
              <br />
              Access Is Luxury.
            </p>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <p className="mb-5 font-sans text-[10px] font-medium uppercase tracking-[0.25em] text-foreground">
                {category}
              </p>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="font-sans text-[11px] tracking-[0.1em] text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto max-w-[1440px] px-5 py-6 sm:px-6 md:px-12 lg:px-16">
          <div className="flex items-center justify-center gap-6">
            <Link
              to="/terms"
              className="font-sans text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
            >
              Terms of Service
            </Link>
            <span className="font-sans text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              &middot;
            </span>
            <Link
              to="/privacy"
              className="font-sans text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
            >
              Privacy Policy
            </Link>
          </div>
          <p className="mt-6 text-center font-sans text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            &copy; {new Date().getFullYear()} GEA. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
