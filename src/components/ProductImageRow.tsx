import { type ShopifyProduct } from "@/lib/shopify";

const EDITORIAL_IMAGES = [
  { url: "/images/edit-1.png", alt: "Model wearing gold earrings and moissanite ring" },
  { url: "/images/edit-2.png", alt: "Model wearing gold chain necklace and hoop earrings" },
  { url: "/images/edit-3.png", alt: "Model styled with layered gold jewelry and emerald rings" },
];

export const ProductImageRow = ({ products }: { products: ShopifyProduct[] }) => {
  return (
    <section className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 pb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[2px]">
        {EDITORIAL_IMAGES.map((img, i) => (
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
