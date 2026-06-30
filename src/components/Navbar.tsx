import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { CartDrawer } from "./CartDrawer";
import { SearchOverlay } from "./SearchOverlay";
import { Search, User, Heart, Menu, X, ChevronDown, ChevronRight, LogOut } from "lucide-react";
import { storefrontApiRequest, OCCASIONS_QUERY } from "@/lib/shopify";
import { useCustomerAuth } from "@/contexts/CustomerAuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const primaryLinks = [
  { label: "Home", href: "/" },
  { label: "Our Story", href: "/about" },
  { label: "How It Works", href: "/how-it-works" },
];

type CatLink = { label: string; href: string; children?: { label: string; href: string }[] };

const categoryLinks: CatLink[] = [
  { label: "Earrings", href: "/earrings" },
  {
    label: "Necklaces",
    href: "/necklaces",
    children: [
      { label: "All Necklaces", href: "/necklaces" },
      { label: "Beads & Stones", href: "/beaded-necklaces" },
      { label: "Crystals", href: "/crystal-necklaces" },
      { label: "Personalized Necklaces", href: "/personalized-necklaces" },
    ],
  },
  {
    label: "Charms",
    href: "/charms",
    children: [
      { label: "All Charms", href: "/charms" },
      { label: "Charm Chains", href: "/charm-chains" },
      { label: "Personalized Necklaces", href: "/personalized-necklaces" },
    ],
  },
  { label: "Bracelets", href: "/bracelets" },
  { label: "Rings", href: "/rings" },
  { label: "Sunglasses", href: "/sunglasses" },
  { label: "Hair", href: "/hair" },
  { label: "Watches", href: "/watches" },
];

type OccasionQueryResponse = {
  data?: {
    products?: {
      edges?: Array<{
        node?: {
          metafields?: Array<{
            key: string;
            value: string | null;
          } | null> | null;
        };
      }>;
    };
  };
};

const isPathActive = (pathname: string, href: string) =>
  href === "/"
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);

const getNavLinkClass = (isActive: boolean) =>
  `text-[11px] tracking-[0.1em] uppercase font-sans transition-colors whitespace-nowrap ${
    isActive
      ? "text-foreground border-b border-foreground pb-0.5"
      : "text-foreground hover:border-b hover:border-foreground hover:pb-0.5"
  }`;

const membershipCtaClass =
  "inline-flex items-center justify-center border px-4 py-2 text-[10px] tracking-[0.18em] uppercase font-sans text-[#faf4e8] transition-transform hover:-translate-y-px bg-[var(--poppy)] border-[var(--poppy-deep)] shadow-[2px_2px_0_var(--poppy-deep)]";

const getOccasionHref = (occasion: string) =>
  `/occasions/${encodeURIComponent(occasion)}`;

export const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileOccasionsOpen, setMobileOccasionsOpen] = useState(false);
  const [mobileShopOpen, setMobileShopOpen] = useState(false);
  const [occasionLinks, setOccasionLinks] = useState<string[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const { isSignedIn, profile, user, openAuthModal, signOut } = useCustomerAuth();

  // Account icon: signed-out opens the login modal; signed-in shows a menu with
  // the account link and a log-out option.
  const AccountMenu = ({ size, onNavigate }: { size: number; onNavigate?: () => void }) =>
    isSignedIn ? (
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label="Account menu"
          className="p-1.5 hover:opacity-70 transition-opacity focus:outline-none"
        >
          <User className="stroke-[1.5]" style={{ height: size, width: size }} />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 rounded-none">
          <DropdownMenuLabel className="font-sans">
            <span className="block text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Signed in as</span>
            <span className="block truncate text-[13px] font-normal text-foreground">
              {profile?.full_name || profile?.email || user?.email}
            </span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/account" onClick={onNavigate} className="text-[11px] tracking-[0.15em] uppercase">
              My Account
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              signOut();
              onNavigate?.();
            }}
            className="text-[11px] tracking-[0.15em] uppercase"
          >
            <LogOut className="mr-2 h-3.5 w-3.5" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ) : (
      <button
        type="button"
        aria-label="Account"
        onClick={() => {
          openAuthModal({ mode: "login", intent: "account" });
          onNavigate?.();
        }}
        className="p-1.5 hover:opacity-70 transition-opacity"
      >
        <User className="stroke-[1.5]" style={{ height: size, width: size }} />
      </button>
    );

  // Heart: favorites entry point. Signed-out shoppers are prompted to create an
  // account first (wishlist UI itself is not built yet).
  const FavoritesButton = ({ size, onNavigate }: { size: number; onNavigate?: () => void }) => (
    <button
      type="button"
      aria-label="Favorites"
      onClick={() => {
        if (!isSignedIn) {
          openAuthModal({ mode: "signup", intent: "favorites" });
        }
        onNavigate?.();
      }}
      className="p-1.5 hover:opacity-70 transition-opacity"
    >
      <Heart className="stroke-[1.5]" style={{ height: size, width: size }} />
    </button>
  );

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    let isMounted = true;

    const fetchOccasions = async () => {
      try {
        const data = (await storefrontApiRequest(OCCASIONS_QUERY, {
          first: 250,
        })) as OccasionQueryResponse | undefined;

        const values = new Set<string>();
        data?.data?.products?.edges?.forEach((edge) => {
          edge.node?.metafields?.forEach((metafield) => {
            if (!metafield?.value) return;
            metafield.value.split(",").forEach((value) => {
              const trimmed = value.trim();
              if (trimmed) values.add(trimmed);
            });
          });
        });

        if (isMounted) {
          setOccasionLinks(Array.from(values).sort((a, b) => a.localeCompare(b)));
        }
      } catch (error) {
        console.error("Failed to load occasion links:", error);
      }
    };

    fetchOccasions();

    return () => {
      isMounted = false;
    };
  }, []);

  const toggleMobile = (open: boolean) => {
    setMobileOpen(open);
    if (!open) {
      setMobileOccasionsOpen(false);
      setMobileShopOpen(false);
    }
    document.body.style.overflow = open ? "hidden" : "";
  };

  const isOccasionActive = location.pathname.startsWith("/occasions/");

  return (
    <>
    <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    <header className="bg-background relative z-50">
      <div className="border-b border-border">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 h-[60px] md:h-[72px] flex items-center justify-between relative">
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

          <div className="hidden md:flex w-[180px]">
            <Link to="/how-it-works" className={membershipCtaClass}>
              See Membership
            </Link>
          </div>

          <Link
            to="/"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pt-2 md:pt-3 font-brand text-[32px] md:text-[40px] tracking-[0.04em] font-normal leading-[1]"
            style={{ color: "hsl(30, 16%, 34%)" }}
          >
            Gea
          </Link>

          <div className="flex items-center gap-5">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="p-1.5 hover:opacity-70 transition-opacity md:hidden"
            >
              <Search className="h-5 w-5 stroke-[1.5]" />
            </button>
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="p-1.5 hover:opacity-70 transition-opacity hidden md:block"
            >
              <Search className="h-[20px] w-[20px] stroke-[1.5]" />
            </button>
            <div className="hidden md:block">
              <AccountMenu size={20} />
            </div>
            <div className="hidden md:block">
              <FavoritesButton size={20} />
            </div>
            <CartDrawer />
          </div>
        </div>
      </div>

      <div className="border-b border-border">
        <nav className="max-w-[1080px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 h-[42px] hidden md:flex items-center justify-between gap-x-1">
          {primaryLinks.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className={getNavLinkClass(isPathActive(location.pathname, item.href))}
            >
              {item.label}
            </Link>
          ))}

          <a
            href="/next-chapter/index.html"
            className={`${getNavLinkClass(false)} inline-flex items-center gap-1`}
          >
            The Next Chapter
            <span aria-hidden="true" className="text-[var(--poppy)] normal-case tracking-normal">✿</span>
          </a>

          <div className="relative group">
            <button
              type="button"
              className={`${getNavLinkClass(categoryLinks.some((c) => isPathActive(location.pathname, c.href)))} inline-flex items-center gap-1`}
            >
              Categories
              <ChevronDown className="h-3 w-3 stroke-[1.7]" />
            </button>
            <div className="pointer-events-none absolute left-1/2 top-full z-50 w-[280px] -translate-x-1/2 pt-3 opacity-0 transition-opacity duration-150 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100">
              <div className="border border-border bg-background p-2 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
                {categoryLinks.map((item) => (
                  <div key={item.label} className="group/cat">
                    <div className="flex items-center justify-between transition-colors hover:bg-accent">
                      <Link
                        to={item.href}
                        className="block flex-1 px-2 py-2 text-[10px] tracking-[0.18em] uppercase font-sans text-foreground"
                      >
                        {item.label}
                      </Link>
                      {item.children && (
                        <Link
                          to={item.children[0].href}
                          aria-label={`${item.label} subcategories`}
                          className="px-2 py-2 text-[var(--poppy-deep)]"
                        >
                          <ChevronRight className="h-3.5 w-3.5 stroke-[2]" />
                        </Link>
                      )}
                    </div>
                    {item.children && (
                      <div className="hidden pb-1 pl-3 group-hover/cat:block">
                        {item.children.map((c) => (
                          <Link
                            key={c.href}
                            to={c.href}
                            className="block px-2 py-1.5 text-[10px] tracking-[0.16em] uppercase font-sans text-muted-foreground transition-colors hover:text-foreground"
                          >
                            › {c.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative group">
            <button
              type="button"
              className={`${getNavLinkClass(isOccasionActive)} inline-flex items-center gap-1`}
            >
              Occasions
              <ChevronDown className="h-3 w-3 stroke-[1.7]" />
            </button>
            <div className="pointer-events-none absolute left-1/2 top-full z-50 w-[240px] -translate-x-1/2 pt-3 opacity-0 transition-opacity duration-150 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100">
              <div className="border border-border bg-background p-3 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
                {occasionLinks.length > 0 ? (
                  occasionLinks.map((occasion) => (
                    <Link
                      key={occasion}
                      to={getOccasionHref(occasion)}
                      className="block px-2 py-2 text-[10px] tracking-[0.18em] uppercase font-sans text-foreground hover:bg-accent transition-colors"
                    >
                      {occasion}
                    </Link>
                  ))
                ) : (
                  <p className="px-2 py-2 text-[10px] tracking-[0.18em] uppercase font-sans text-muted-foreground">
                    Loading
                  </p>
                )}
              </div>
            </div>
          </div>
        </nav>
      </div>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 top-[44px] z-40">
          <div
            className="absolute inset-0 bg-foreground/20"
            onClick={() => toggleMobile(false)}
          />
          <nav className="relative bg-background border-b border-border animate-fade-in">
            <div className="px-6 py-6 space-y-1">
              <div className="border-b border-border/40 pb-4 mb-1">
                <Link
                  to="/how-it-works"
                  onClick={() => toggleMobile(false)}
                  className={`${membershipCtaClass} w-full`}
                >
                  See Membership
                </Link>
              </div>

              {primaryLinks.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={() => toggleMobile(false)}
                  className="block py-3 text-[12px] tracking-[0.18em] uppercase font-sans text-foreground hover:text-muted-foreground transition-colors border-b border-border/40"
                >
                  {item.label}
                </Link>
              ))}

              <a
                href="/next-chapter/index.html"
                className="block py-3 text-[12px] tracking-[0.18em] uppercase font-sans text-foreground hover:text-muted-foreground transition-colors border-b border-border/40"
              >
                The Next Chapter <span aria-hidden="true" className="text-[var(--poppy)]">✿</span>
              </a>

              <div className="border-b border-border/40">
                <button
                  type="button"
                  onClick={() => setMobileShopOpen((current) => !current)}
                  className="w-full flex items-center justify-between py-3 text-[12px] tracking-[0.18em] uppercase font-sans text-foreground hover:text-muted-foreground transition-colors"
                >
                  Categories
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      mobileShopOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {mobileShopOpen && (
                  <div className="pb-3">
                    {categoryLinks.map((item) => (
                      <div key={item.label}>
                        <Link
                          to={item.href}
                          onClick={() => toggleMobile(false)}
                          className="block py-2 pl-4 text-[11px] tracking-[0.16em] uppercase font-sans text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {item.label}
                        </Link>
                        {item.children?.map((c) => (
                          <Link
                            key={c.href}
                            to={c.href}
                            onClick={() => toggleMobile(false)}
                            className="block py-1.5 pl-8 text-[10px] tracking-[0.14em] uppercase font-sans text-muted-foreground/80 hover:text-foreground transition-colors"
                          >
                            › {c.label}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="border-b border-border/40">
                <button
                  type="button"
                  onClick={() => setMobileOccasionsOpen((current) => !current)}
                  className="w-full flex items-center justify-between py-3 text-[12px] tracking-[0.18em] uppercase font-sans text-foreground hover:text-muted-foreground transition-colors"
                >
                  Occasions
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      mobileOccasionsOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {mobileOccasionsOpen && (
                  <div className="pb-3">
                    {occasionLinks.length > 0 ? (
                      occasionLinks.map((occasion) => (
                        <Link
                          key={occasion}
                          to={getOccasionHref(occasion)}
                          onClick={() => toggleMobile(false)}
                          className="block py-2 pl-4 text-[11px] tracking-[0.16em] uppercase font-sans text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {occasion}
                        </Link>
                      ))
                    ) : (
                      <p className="py-2 pl-4 text-[11px] tracking-[0.16em] uppercase font-sans text-muted-foreground">
                        Loading
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-6 pt-5">
                <button
                  onClick={() => { toggleMobile(false); setSearchOpen(true); }}
                  aria-label="Search"
                  className="p-1.5 hover:opacity-70 transition-opacity"
                >
                  <Search className="h-[18px] w-[18px] stroke-[1.5]" />
                </button>
                <AccountMenu size={18} onNavigate={() => toggleMobile(false)} />
                <FavoritesButton size={18} onNavigate={() => toggleMobile(false)} />
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
    </>
  );
};
