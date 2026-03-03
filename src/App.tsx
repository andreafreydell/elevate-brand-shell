import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useCartSync } from "@/hooks/useCartSync";
import { useEffect } from "react";
import LaunchGate from "@/components/LaunchGate";
import Index from "./pages/Index";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};
import ProductDetail from "./pages/ProductDetail";
import Membership from "./pages/Membership";
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
import Stories from "./pages/Stories";
import Account from "./pages/Account";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  useCartSync();
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/product/:handle" element={<ProductDetail />} />
      <Route path="/founding-100" element={<Membership />} />
      <Route path="/membership" element={<Navigate to="/founding-100" replace />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/about" element={<About />} />
      <Route path="/sustainability" element={<Sustainability />} />
      <Route path="/care" element={<CareRepair />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/refer" element={<ReferFriend />} />
      <Route path="/ambassador" element={<Ambassador />} />
      <Route path="/press" element={<Press />} />
      <Route path="/legal" element={<Legal />} />
      <Route path="/stories" element={<Stories />} />
      <Route path="/account" element={<Account />} />
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
          <AppContent />
        </BrowserRouter>
      </LaunchGate>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
