import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigationType } from "react-router-dom";
import { useCartSync } from "@/hooks/useCartSync";
import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";
import LaunchGate from "@/components/LaunchGate";
import { EmailCapturePopup } from "@/components/EmailCapturePopup";
import Index from "./pages/Index";
import AdminLogin from "./pages/admin/AdminLogin";
import RentalOps from "./pages/admin/RentalOps";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminRoute } from "@/components/auth/AdminRoute";
import ProductDetail from "./pages/ProductDetail";
import HowItWorks from "./pages/HowItWorks";
import About from "./pages/About";
import Sustainability from "./pages/Sustainability";
import CareRepair from "./pages/CareRepair";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import ReferFriend from "./pages/ReferFriend";
import Ambassador from "./pages/Ambassador";
import Press from "./pages/Press";
import Legal from "./pages/Legal";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Stories from "./pages/Stories";
import Account from "./pages/Account";
import BrowseAll from "./pages/BrowseAll";
import SearchResults from "./pages/SearchResults";
import CategoryPage from "./pages/CategoryPage";
import OccasionPage from "./pages/OccasionPage";
import NotFound from "./pages/NotFound";

// Per-history-entry scroll positions (in-memory, survives within the SPA session).
const scrollPositions = new Map<string, number>();

const ScrollManager = () => {
  const { hash, key } = useLocation();
  const navType = useNavigationType(); // "POP" (back/forward) | "PUSH" | "REPLACE"

  // Continuously remember where we are on this history entry.
  useEffect(() => {
    const save = () => scrollPositions.set(key, window.scrollY);
    window.addEventListener("scroll", save, { passive: true });
    return () => {
      save();
      window.removeEventListener("scroll", save);
    };
  }, [key]);

  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth" });
      }, 100);
      return;
    }

    if (navType === "POP") {
      // Returning to a previous page: restore its scroll. Retry briefly so it
      // sticks once async content (e.g. product grids) finishes growing the page.
      const target = scrollPositions.get(key) ?? 0;
      if (target === 0) {
        window.scrollTo(0, 0);
        return;
      }
      let tries = 0;
      const id = window.setInterval(() => {
        window.scrollTo(0, target);
        tries += 1;
        if (tries >= 25 || Math.abs(window.scrollY - target) <= 2) {
          window.clearInterval(id);
        }
      }, 60);
      return () => window.clearInterval(id);
    }

    // New navigation (PUSH/REPLACE): start at the top.
    window.scrollTo(0, 0);
  }, [key, hash, navType]);

  return null;
};

const ScrollToTopButton = () => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!show) return null;
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Scroll to top"
      className="fixed bottom-5 right-5 z-[80] flex h-11 w-11 items-center justify-center text-[#faf4e8] transition-transform hover:-translate-y-0.5"
      style={{ background: "var(--poppy)", border: "1px solid var(--poppy-deep)", boxShadow: "3px 3px 0 hsl(30 12% 10% / 0.35)" }}
    >
      <ChevronUp className="h-5 w-5 stroke-[2]" />
    </button>
  );
};

const queryClient = new QueryClient();

// Collection "families" — the full set of links shown at the end of the filters
// so every sub-collection page (and the parent) links to the rest, and visitors
// can always get to the complete category ("All Necklaces" / "All Charms").
const NECKLACE_LINKS = {
  all: { label: "All Necklaces", to: "/necklaces" },
  beads: { label: "Beads & Stones", to: "/beaded-necklaces" },
  crystals: { label: "Crystals", to: "/crystal-necklaces" },
  personalized: { label: "Personalized Necklaces", to: "/personalized-necklaces" },
};
const CHARM_LINKS = {
  all: { label: "All Charms", to: "/charms" },
  chains: { label: "Charm Chains", to: "/charm-chains" },
  personalized: { label: "Personalized Necklaces", to: "/personalized-necklaces" },
};

const NextChapterRedirect = () => {
  useEffect(() => {
    window.location.replace("/next-chapter/index.html");
  }, []);
  return null;
};

const AppContent = () => {
  useCartSync();
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/next-chapter/*" element={<NextChapterRedirect />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/rental-ops" element={<AdminRoute><RentalOps /></AdminRoute>} />
      <Route path="/product/:handle" element={<ProductDetail />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/membership" element={<Navigate to="/how-it-works" replace />} />
      <Route path="/about" element={<About />} />
      <Route path="/sustainability" element={<Sustainability />} />
      <Route path="/care" element={<CareRepair />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/refer" element={<ReferFriend />} />
      <Route path="/ambassador" element={<Ambassador />} />
      <Route path="/press" element={<Press />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/legal" element={<Legal />} />
      <Route path="/stories" element={<Stories />} />
      <Route path="/account" element={<Account />} />
      <Route path="/browse" element={<BrowseAll />} />
      <Route path="/search" element={<SearchResults />} />
      <Route path="/occasions/:occasion" element={<OccasionPage />} />
      <Route
        path="/earrings"
        element={<CategoryPage title="Earrings" subtitle="Hoops, studs, drops, and ear cuffs — curated for every occasion." productType="Earrings" />}
      />
      <Route
        path="/necklaces"
        element={<CategoryPage title="Necklaces" subtitle="Chains, pendants, and layering pieces — crafted to elevate." productType="Necklace" filterFooter={[NECKLACE_LINKS.beads, NECKLACE_LINKS.crystals, NECKLACE_LINKS.personalized]} />}
      />
      <Route
        path="/rings"
        element={<CategoryPage title="Rings" subtitle="Bands, statement rings, and stacking sets — designed to be worn boldly." productType="Ring" />}
      />
      <Route
        path="/bracelets"
        element={<CategoryPage title="Bracelets" subtitle="Bangles, cuffs, and tennis bracelets — a garden for your wrist." productType="Bracelet" />}
      />
      <Route
        path="/sunglasses"
        element={<CategoryPage title="Sunglasses" subtitle="Frames that define your gaze — bold, refined, unapologetic." productType="Sunglasses" />}
      />
      <Route
        path="/charms"
        element={<CategoryPage title="Charms" subtitle="Tokens, pendants, and add-ons — build a piece that tells your story." productType="Charm" filterFooter={[CHARM_LINKS.chains, CHARM_LINKS.personalized]} />}
      />
      <Route
        path="/charm-chains"
        element={(
          <CategoryPage
            title="Charm Chains"
            subtitle="Chain necklaces with lobster, spring-ring & carabiner clasps — ready to layer your charms."
            productType="Necklace"
            filterFooter={[CHARM_LINKS.all, CHARM_LINKS.personalized]}
            filterFooterLabel="Also in Charms"
            clientFilter={(p) => {
              const mfs = (p.node as { metafields?: Array<{ key: string; value: string | null } | null> }).metafields || [];
              const closure = mfs.find((m) => m?.key === "closure_and_security")?.value || "";
              return /lobster|spring|carabiner/i.test(closure);
            }}
          />
        )}
      />
      <Route
        path="/personalized-necklaces"
        element={(
          <CategoryPage
            title="Personalized Necklaces"
            subtitle="Initials A–Z, word pieces (MOM, LOVE), and zodiac discs — use the filter to jump between them."
            productType="Charm"
            query="Letter OR Label OR Zodiac"
            filterFooter={[NECKLACE_LINKS.all, NECKLACE_LINKS.beads, NECKLACE_LINKS.crystals]}
            filterFooterLabel="Also in Necklaces"
            filterGroups={[
              { label: "Letters", re: /letter/i },
              { label: "Text", re: /label/i },
              { label: "Zodiac", re: /zodiac/i },
            ]}
          />
        )}
      />
      <Route
        path="/beaded-necklaces"
        element={(
          <CategoryPage
            title="Beads & Stones"
            subtitle="Beaded, strand & natural-stone necklaces — texture made to layer."
            productType="Necklace"
            query="product_type:Necklace AND (title:bead* OR title:strand* OR title:stone*)"
            filterFooter={[NECKLACE_LINKS.all, NECKLACE_LINKS.crystals, NECKLACE_LINKS.personalized]}
            filterFooterLabel="Also in Necklaces"
          />
        )}
      />
      <Route
        path="/crystal-necklaces"
        element={(
          <CategoryPage
            title="Crystals"
            subtitle="Tennis, crystal & CZ necklaces — all the sparkle, none of the commitment."
            productType="Necklace"
            query="product_type:Necklace AND (title:tennis* OR title:crystal* OR title:cz OR title:zirconia OR title:pave* OR title:pavé* OR title:rhinestone*)"
            filterFooter={[NECKLACE_LINKS.all, NECKLACE_LINKS.beads, NECKLACE_LINKS.personalized]}
            filterFooterLabel="Also in Necklaces"
          />
        )}
      />
      <Route
        path="/watches"
        element={<CategoryPage title="Watches" subtitle="Classic faces for the modern wrist." productType="Watch" query="product_type:Watch AND -product_type:strap" />}
      />
      <Route
        path="/hair"
        element={<CategoryPage title="Hair" subtitle="Clips, pins, and accessories — the finishing gesture." productType="Hair" />}
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <LaunchGate>
        <BrowserRouter>
          <AuthProvider>
            <ScrollManager />
            <EmailCapturePopup />
            <AppContent />
            <ScrollToTopButton />
          </AuthProvider>
        </BrowserRouter>
      </LaunchGate>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
