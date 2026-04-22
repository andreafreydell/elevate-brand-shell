import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useCartSync } from "@/hooks/useCartSync";
import { useEffect } from "react";
import LaunchGate from "@/components/LaunchGate";
import { EmailCapturePopup } from "@/components/EmailCapturePopup";
import Index from "./pages/Index";
import AdminRentalOps from "./pages/AdminRentalOps";

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const el = document.getElementById(hash.slice(1));
        el?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);
  return null;
};
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
import CategoryPage from "./pages/CategoryPage";
import OccasionPage from "./pages/OccasionPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  useCartSync();
  return (
    <Routes>
      <Route path="/" element={<Index />} />
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
      <Route path="/occasions/:occasion" element={<OccasionPage />} />
      <Route path="/earrings" element={<CategoryPage title="Earrings" subtitle="Hoops, studs, drops, and ear cuffs — curated for every occasion." productType="Earrings" />} />
      <Route path="/necklaces" element={<CategoryPage title="Necklaces" subtitle="Chains, pendants, and layering pieces — crafted to elevate." productType="Necklace" />} />
      <Route path="/rings" element={<CategoryPage title="Rings" subtitle="Bands, statement rings, and stacking sets — designed to be worn boldly." productType="Ring" />} />
      <Route path="/bracelets" element={<CategoryPage title="Bracelets" subtitle="Bangles, cuffs, and tennis bracelets — effortless luxury." productType="Bracelet" />} />
      <Route path="/sunglasses" element={<CategoryPage title="Sunglasses" subtitle="Frames that define your gaze — bold, refined, unapologetic." productType="Sunglasses" />} />
      <Route path="/hair" element={<CategoryPage title="Hair" subtitle="Clips, pins, and accessories — the finishing gesture." productType="Hair" />} />
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
          <ScrollToTop />
          <EmailCapturePopup />
          <AppContent />
        </BrowserRouter>
      </LaunchGate>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
