import { useEffect, useState } from "react";
import { storefrontApiRequest, PRODUCTS_QUERY, type ShopifyProduct } from "@/lib/shopify";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { ValueProps } from "@/components/ValueProps";
import { ProductImageRow } from "@/components/ProductImageRow";
import { FeaturedProduct } from "@/components/FeaturedProduct";
import { Loader2 } from "lucide-react";

const Index = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await storefrontApiRequest(PRODUCTS_QUERY, { first: 20 });
        if (data?.data?.products?.edges) {
          setProducts(data.data.products.edges);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <ValueProps />
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-sm tracking-wider uppercase text-muted-foreground">No products found</p>
        </div>
      ) : (
        <>
          <ProductImageRow products={products} />
          {products[0] && <FeaturedProduct product={products[0]} />}
        </>
      )}
      <footer className="border-t border-border mt-8">
        <div className="max-w-[1400px] mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-serif text-lg tracking-[0.05em] italic">Gea</p>
          <p className="text-xs text-muted-foreground tracking-wider font-sans">
            © {new Date().getFullYear()} GEA. Unlimited Designer Jewelry.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
