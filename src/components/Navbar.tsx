import { Link } from "react-router-dom";
import { CartDrawer } from "./CartDrawer";
import { Search, User, Heart } from "lucide-react";

export const Navbar = () => {
  return (
    <header className="bg-background">
      {/* Top utility bar */}
      <div className="border-b border-border">
        <div className="max-w-[1440px] mx-auto px-12 lg:px-16 h-[44px] flex items-center justify-between relative">
          {/* Left: Category tabs */}
          <nav className="hidden md:flex items-center gap-5">
            <Link
              to="/"
              className="text-[11px] tracking-[0.2em] uppercase font-sans font-semibold text-foreground border-b border-foreground pb-0.5"
            >
              Jewelry
            </Link>
            <Link
              to="/"
              className="text-[11px] tracking-[0.2em] uppercase font-sans text-muted-foreground hover:text-foreground transition-colors"
            >
              Membership
            </Link>
            <Link
              to="/"
              className="text-[11px] tracking-[0.2em] uppercase font-sans text-muted-foreground hover:text-foreground transition-colors"
            >
              Stories
            </Link>
          </nav>

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
            <button className="p-1.5 hover:opacity-70 transition-opacity hidden md:block">
              <User className="h-[18px] w-[18px] stroke-[1.5]" />
            </button>
            <button className="p-1.5 hover:opacity-70 transition-opacity hidden md:block">
              <Heart className="h-[18px] w-[18px] stroke-[1.5]" />
            </button>
            <CartDrawer />
          </div>
        </div>
      </div>

      {/* Primary navigation bar */}
      <div className="border-b border-border">
        <nav className="max-w-[1440px] mx-auto px-12 lg:px-16 h-[42px] hidden md:flex items-center justify-center gap-8 lg:gap-10">
          {[
            "New",
            "Collections",
            "Necklaces",
            "Bracelets",
            "Earrings",
            "Rings",
            "Accessories",
            "The Edit",
          ].map((item) => (
            <Link
              key={item}
              to="/"
              className="text-[11px] tracking-[0.18em] uppercase font-sans text-foreground hover:text-muted-foreground transition-colors whitespace-nowrap"
            >
              {item}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};
