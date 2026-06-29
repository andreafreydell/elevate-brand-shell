import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { CUSTOMER_ACCOUNT_URL } from "@/lib/membershipCheckout";
import { CartDrawer } from "./CartDrawer";
import { SearchOverlay } from "./SearchOverlay";
import { Search, User, Heart, Menu, X, ChevronDown } from "lucide-react";
import { storefrontApiRequest, OCCASIONS_QUERY } from "@/lib/shopify";

const primaryLinks = [
  { label: "Home", href: "/" },
  { label: "Our Story", href: "/about" },
  { label: "How It Works", href: "/how-it-works" },
];

const categoryLinks = [
  { label: "Earrings", href: "/earrings" },
  { label: "Necklaces", href: "/necklaces" },
  { label: "Charms", href: "/charms" },
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
            <a
              href={CUSTOMER_ACCOUNT_URL}
              className="p-1.5 hover:opacity-70 transition-opacity hidden md:block"
            >
              <User className="h-[20px] w-[20px] stroke-[1.5]" />
            </a>
            <button className="p-1.5 hover:opacity-70 transition-opacity hidden md:block">
              <Heart className="h-[20px] w-[20px] stroke-[1.5]" />
            </button>
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
            <div className="pointer-events-none absolute left-1/2 top-full z-50 w-[260px] -translate-x-1/2 pt-3 opacity-0 transition-opacity duration-150 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100">
              <div className="grid grid-cols-2 gap-x-2 border border-border bg-background p-3 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
                {categoryLinks.map((item) => (
                  <Link
                    key={item.label}
                    to={item.href}
                    className="block px-2 py-2 text-[10px] tracking-[0.18em] uppercase font-sans text-foreground hover:bg-accent transition-colors"
                  >
                    {item.label}
                  </Link>
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
                  <div className="grid grid-cols-2 pb-3">
                    {categoryLinks.map((item) => (
                      <Link
                        key={item.label}
                        to={item.href}
                        onClick={() => toggleMobile(false)}
                        className="block py-2 pl-4 text-[11px] tracking-[0.16em] uppercase font-sans text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {item.label}
                      </Link>
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
                <a
                  href={CUSTOMER_ACCOUNT_URL}
                  onClick={() => toggleMobile(false)}
                  className="p-1.5 hover:opacity-70 transition-opacity"
                >
                  <User className="h-[18px] w-[18px] stroke-[1.5]" />
                </a>
                <button className="p-1.5 hover:opacity-70 transition-opacity">
                  <Heart className="h-[18px] w-[18px] stroke-[1.5]" />
                </button>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
    </>
  );
};
