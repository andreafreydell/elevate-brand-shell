import { type ShopifyProduct } from "@/lib/shopify";

export const ProductImageRow = ({ products }: { products: ShopifyProduct[] }) => {
  if (products.length === 0) return null;

  // Show up to 3 product images in a full-bleed row
  const images = products
    .flatMap(p => p.node.images.edges.map(img => ({ url: img.node.url, alt: img.node.altText || p.node.title })))
    .slice(0, 3);

  if (images.length === 0) return null;

  return (
    <section className="max-w-[1400px] mx-auto px-6 pb-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[2px]">
        {images.map((img, i) => (
          <div key={i} className="aspect-[4/5] overflow-hidden bg-card">
            <img
              src={img.url}
              alt={img.alt}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </section>
  );
};
