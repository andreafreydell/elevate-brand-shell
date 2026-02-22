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

      {/* Section intro */}
      <div className="max-w-[1440px] mx-auto px-12 lg:px-16 pt-20 md:pt-28 pb-10 text-center">
        <h2 className="font-serif text-2xl md:text-3xl tracking-[0.08em] uppercase font-medium">
          What's New
        </h2>
      </div>

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
          {/* Section intro: The Edit */}
          <div className="max-w-[1440px] mx-auto px-12 lg:px-16 pt-16 md:pt-20 pb-10 text-center">
            <h2 className="font-serif text-2xl md:text-3xl tracking-[0.08em] uppercase font-medium">
              The Edit
            </h2>
          </div>
          <ProductImageRow products={products} />

          {/* Section intro: Featured */}
          {products[0] && (
            <>
              <div className="max-w-[1440px] mx-auto px-12 lg:px-16 pt-16 md:pt-20 pb-10 text-center">
                <h2 className="font-serif text-2xl md:text-3xl tracking-[0.08em] uppercase font-medium">
                  Featured Piece
                </h2>
              </div>
              <FeaturedProduct product={products[0]} />
            </>
          )}
        </>
      )}
      <footer className="border-t border-border mt-12">
        <div className="max-w-[1440px] mx-auto px-12 lg:px-16 py-14 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-serif text-lg tracking-[0.08em] italic">Gea</p>
          <p className="text-[10px] text-muted-foreground tracking-[0.2em] uppercase font-sans">
            © {new Date().getFullYear()} GEA. Unlimited Designer Jewelry.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
