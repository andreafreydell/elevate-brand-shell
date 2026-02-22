import { Link } from "react-router-dom";
import { CartDrawer } from "./CartDrawer";

export const Navbar = () => {
  return (
    <header className="border-b border-border">
      <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="font-serif text-2xl tracking-[0.15em] font-semibold">
          GEA
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors font-sans">
            Collection
          </Link>
          <Link to="/" className="text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors font-sans">
            Membership
          </Link>
          <Link to="/" className="text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors font-sans">
            About
          </Link>
        </nav>
        <CartDrawer />
      </div>
    </header>
  );
};
