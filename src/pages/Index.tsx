import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { ProductGrid } from "@/components/ProductGrid";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <ProductGrid />
      <footer className="border-t border-border">
        <div className="max-w-[1400px] mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-serif text-lg tracking-[0.1em]">GEA</p>
          <p className="text-xs text-muted-foreground tracking-wider font-sans">
            © {new Date().getFullYear()} GEA. Unlimited Designer Jewelry.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
