import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { CartDrawer } from "./CartDrawer";
import { Search, User, Heart, Menu, X } from "lucide-react";

const navLinks = [
  { label: "New", href: "/" },
  { label: "Browse All", href: "/" },
  { label: "Earrings", href: "/" },
  { label: "Necklaces", href: "/" },
  { label: "Rings", href: "/" },
  { label: "Bracelets", href: "/" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Founding Circle", href: "/how-it-works#founding-circle" },
];

export const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const toggleMobile = (open: boolean) => {
    setMobileOpen(open);
    document.body.style.overflow = open ? 'hidden' : '';
  };

  return (
    <header className="bg-background relative z-50">
      {/* Top utility bar */}
      <div className="border-b border-border">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 h-[44px] flex items-center justify-between relative">
          {/* Mobile: Hamburger */}
          <button
            className="md:hidden p-1.5 hover:opacity-70 transition-opacity"
            onClick={() => toggleMobile(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="h-5 w-5 stroke-[1.5]" />
            ) : (
              <Menu className="h-5 w-5 stroke-[1.5]" />
            )}
          </button>

          {/* Desktop: left spacer for centering */}
          <div className="hidden md:block" />

          {/* Center: Logo */}
          <Link
            to="/"
            className="absolute left-1/2 -translate-x-1/2 font-serif text-[28px] md:text-[32px] tracking-[0.12em] font-semibold italic leading-none"
          >
            Gea
          </Link>

          {/* Right: Utility icons */}
          <div className="flex items-center gap-4">
            <button className="p-1.5 hover:opacity-70 transition-opacity hidden md:block">
              <Search className="h-[18px] w-[18px] stroke-[1.5]" />
            </button>
            <Link to="/account" className="p-1.5 hover:opacity-70 transition-opacity hidden md:block">
              <User className="h-[18px] w-[18px] stroke-[1.5]" />
            </Link>
            <button className="p-1.5 hover:opacity-70 transition-opacity hidden md:block">
              <Heart className="h-[18px] w-[18px] stroke-[1.5]" />
            </button>
            <CartDrawer />
          </div>
        </div>
      </div>

      {/* Primary navigation bar (desktop) */}
      <div className="border-b border-border">
        <nav className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 h-[42px] hidden md:flex items-center justify-center gap-8 lg:gap-10">
          {navLinks.map((item) => {
            const isActive = item.href === "/" ? location.pathname === "/" : location.pathname.startsWith(item.href);
            return (
              <Link
                key={item.label}
                to={item.href}
                className={`text-[11px] tracking-[0.18em] uppercase font-sans transition-colors whitespace-nowrap ${
                  isActive && item.label === "New"
                    ? "text-foreground border-b border-foreground pb-0.5"
                    : "text-foreground hover:text-muted-foreground"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 top-[44px] z-40">
          <div
            className="absolute inset-0 bg-foreground/20"
            onClick={() => toggleMobile(false)}
          />
          <nav className="relative bg-background border-b border-border animate-fade-in">
            <div className="px-6 py-6 space-y-1">
              {navLinks.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={() => toggleMobile(false)}
                  className="block py-3 text-[12px] tracking-[0.18em] uppercase font-sans text-foreground hover:text-muted-foreground transition-colors border-b border-border/40"
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex items-center gap-6 pt-5">
                <button className="p-1.5 hover:opacity-70 transition-opacity">
                  <Search className="h-[18px] w-[18px] stroke-[1.5]" />
                </button>
                <Link to="/account" onClick={() => toggleMobile(false)} className="p-1.5 hover:opacity-70 transition-opacity">
                  <User className="h-[18px] w-[18px] stroke-[1.5]" />
                </Link>
                <button className="p-1.5 hover:opacity-70 transition-opacity">
                  <Heart className="h-[18px] w-[18px] stroke-[1.5]" />
                </button>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
