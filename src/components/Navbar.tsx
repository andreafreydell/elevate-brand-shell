import { Link } from "react-router-dom";
import { CartDrawer } from "./CartDrawer";

export const Navbar = () => {
  return (
    <header className="border-b border-border bg-background">
      <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
        {/* Left nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-[11px] tracking-[0.25em] uppercase text-foreground hover:text-muted-foreground transition-colors font-sans font-medium">
            Shop
          </Link>
          <Link to="/" className="text-[11px] tracking-[0.25em] uppercase text-foreground hover:text-muted-foreground transition-colors font-sans font-medium">
            Collections
          </Link>
          <Link to="/" className="text-[11px] tracking-[0.25em] uppercase text-foreground hover:text-muted-foreground transition-colors font-sans font-medium">
            Membership
          </Link>
        </nav>

        {/* Center logo */}
        <Link to="/" className="font-serif text-3xl tracking-[0.05em] font-semibold italic absolute left-1/2 -translate-x-1/2">
          Gea
        </Link>

        {/* Right nav + cart */}
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-[11px] tracking-[0.25em] uppercase text-foreground hover:text-muted-foreground transition-colors font-sans font-medium">
              Stories
            </Link>
            <Link to="/" className="text-[11px] tracking-[0.25em] uppercase text-foreground hover:text-muted-foreground transition-colors font-sans font-medium">
              Journal
            </Link>
          </nav>
          <CartDrawer />
        </div>
      </div>
    </header>
  );
};
