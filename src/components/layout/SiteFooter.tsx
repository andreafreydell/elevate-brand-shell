import { Link } from "react-router-dom";
import { NewsletterCapture } from "@/components/shared/NewsletterCapture";

const footerLinks = {
  Membership: [
    { label: "Founding 100", href: "/founding-100" },
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

export const SiteFooter = () => {
  return (
    <footer className="border-t border-border bg-background">
      {/* Newsletter section */}
      <NewsletterCapture />

      {/* Links grid */}
      <div className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand column */}
          <div>
            <Link to="/" className="font-serif text-2xl tracking-[0.12em] font-semibold italic">
              Gea
            </Link>
            <p className="text-[11px] text-muted-foreground font-sans mt-4 leading-relaxed max-w-[200px]">
              Unlimited Designer Jewelry.<br />
              Access Is Luxury.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <p className="text-[10px] tracking-[0.25em] uppercase font-sans font-medium text-foreground mb-5">
                {category}
              </p>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-[11px] tracking-[0.1em] font-sans text-muted-foreground hover:text-foreground transition-colors"
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

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 py-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-[10px] text-muted-foreground tracking-[0.2em] uppercase font-sans">
            © {new Date().getFullYear()} GEA. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/legal" className="text-[10px] text-muted-foreground tracking-[0.15em] uppercase font-sans hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link to="/legal" className="text-[10px] text-muted-foreground tracking-[0.15em] uppercase font-sans hover:text-foreground transition-colors">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
