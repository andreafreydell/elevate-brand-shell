import { type ShopifyProduct } from "@/lib/shopify";
import { photoSrcSet } from "@/lib/responsiveImages";

const EDITORIAL_IMAGES = [
  { url: "/images/edit-1.webp", name: "edit-1", alt: "Model wearing gold earrings and moissanite ring" },
  { url: "/images/edit-2.webp", name: "edit-2", alt: "Model wearing gold chain necklace and hoop earrings" },
  { url: "/images/edit-3.webp", name: "edit-3", alt: "Model styled with layered gold jewelry and emerald rings" },
];

export const ProductImageRow = ({ products }: { products: ShopifyProduct[] }) => {
  return (
    <section className="edit-gallery-section-mobile max-w-[1440px] mx-auto px-5 sm:px-6 md:px-12 lg:px-16 pb-6">
      <div className="edit-gallery-grid-mobile grid grid-cols-1 md:grid-cols-3 gap-[2px]">
        {EDITORIAL_IMAGES.map((img, i) => (
          <div key={i} className="edit-gallery-image-mobile aspect-[4/5] overflow-hidden bg-card">
            <img
              src={img.url}
              srcSet={photoSrcSet(img.name)}
              sizes="(min-width: 768px) 470px, 100vw"
              alt={img.alt}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              loading="lazy"
              decoding="async"
            />
          </div>
        ))}
      </div>
    </section>
  );
};
