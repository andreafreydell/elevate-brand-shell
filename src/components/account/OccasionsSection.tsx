import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Loader2, Pencil, Trash2, X, Check, Plus } from "lucide-react";
import { useCustomerAuth, type WishlistOccasion } from "@/contexts/CustomerAuthContext";
import { fetchProductsByHandles, type ShopifyProduct } from "@/lib/shopify";

const optimize = (url: string, w: number) => {
  try {
    const u = new URL(url);
    u.searchParams.set("width", String(w));
    return u.toString();
  } catch {
    return url;
  }
};

/** A single saved item card with a remove-from-this-Occasion control. */
const OccasionItem = ({
  product,
  onRemove,
}: {
  product: ShopifyProduct;
  onRemove: () => void;
}) => {
  const node = product.node;
  const image = node.images.edges[0]?.node;
  const price = node.priceRange.minVariantPrice;
  return (
    <div className="group relative border border-border bg-card">
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${node.title} from this Occasion`}
        className="absolute right-2 top-2 z-10 flex items-center justify-center border border-border bg-background/85 p-1.5 text-foreground opacity-0 backdrop-blur-sm transition-opacity hover:bg-background focus:opacity-100 focus:outline-none group-hover:opacity-100"
      >
        <X className="h-3.5 w-3.5" />
      </button>
      <Link to={`/product/${node.handle}`} className="block">
        <div className="aspect-square overflow-hidden">
          {image ? (
            <img
              src={optimize(image.url, 420)}
              alt={image.altText || node.title}
              className="h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-secondary">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">No image</span>
            </div>
          )}
        </div>
        <div className="space-y-1 p-3">
          <h4 className="font-serif text-[14px] leading-snug">{node.title}</h4>
          <p className="font-sans text-[12px] text-muted-foreground">
            ${parseFloat(price.amount).toFixed(2)}
          </p>
        </div>
      </Link>
    </div>
  );
};

const OccasionBlock = ({
  occasion,
  products,
}: {
  occasion: WishlistOccasion;
  products: ShopifyProduct[];
}) => {
  const { renameOccasion, deleteOccasion, removeProductFromOccasion } = useCustomerAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(occasion.name);
  const renameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) renameRef.current?.focus();
  }, [editing]);

  const items = useMemo(
    () => occasion.items.map((h) => products.find((p) => p.node.handle === h)).filter(Boolean) as ShopifyProduct[],
    [occasion.items, products],
  );

  const saveName = async () => {
    if (name.trim() && name.trim() !== occasion.name) {
      await renameOccasion(occasion.id, name);
    }
    setEditing(false);
  };

  const handleDelete = async () => {
    if (window.confirm(`Delete the “${occasion.name}” Occasion? This can't be undone.`)) {
      await deleteOccasion(occasion.id);
    }
  };

  return (
    <div className="border border-border bg-background">
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 md:px-6">
        {editing ? (
          <div className="flex flex-1 items-center gap-2">
            <input
              ref={renameRef}
              value={name}
              maxLength={60}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  saveName();
                }
                if (e.key === "Escape") {
                  setName(occasion.name);
                  setEditing(false);
                }
              }}
              className="flex-1 rounded-none border border-border bg-card px-3 py-1.5 font-serif text-lg focus:border-foreground focus:outline-none"
            />
            <button
              type="button"
              onClick={saveName}
              aria-label="Save name"
              className="border border-foreground bg-foreground p-2 text-background transition-colors hover:bg-transparent hover:text-foreground"
            >
              <Check className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex min-w-0 items-center gap-2">
            <h3 className="truncate font-serif text-lg font-medium">{occasion.name}</h3>
            <span className="shrink-0 font-sans text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
              {items.length} {items.length === 1 ? "piece" : "pieces"}
            </span>
          </div>
        )}

        {!editing && (
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={() => setEditing(true)}
              aria-label={`Rename ${occasion.name}`}
              className="p-1.5 text-muted-foreground transition-colors hover:text-foreground"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleDelete}
              aria-label={`Delete ${occasion.name}`}
              className="p-1.5 text-muted-foreground transition-colors hover:text-[var(--poppy)]"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 p-4 md:grid-cols-3 lg:grid-cols-4 md:p-6">
          {items.map((product) => (
            <OccasionItem
              key={product.node.handle}
              product={product}
              onRemove={() => removeProductFromOccasion(occasion.id, product.node.handle)}
            />
          ))}
        </div>
      ) : (
        <p className="px-4 py-8 text-center font-sans text-[12px] text-muted-foreground md:px-6">
          No pieces saved yet. Tap the heart on any piece to add it here.
        </p>
      )}
    </div>
  );
};

export const OccasionsSection = () => {
  const { wishlist, createOccasion } = useCustomerAuth();
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");

  // All unique handles across every Occasion — fetched once as a batch.
  const allHandles = useMemo(() => {
    const set = new Set<string>();
    wishlist.forEach((o) => o.items.forEach((h) => set.add(h)));
    return Array.from(set);
  }, [wishlist]);

  useEffect(() => {
    let active = true;
    if (allHandles.length === 0) {
      setProducts([]);
      setLoadingProducts(false);
      return;
    }
    setLoadingProducts(true);
    fetchProductsByHandles(allHandles)
      .then((res) => active && setProducts(res))
      .catch((err) => {
        console.error(err);
        if (active) setProducts([]);
      })
      .finally(() => active && setLoadingProducts(false));
    return () => {
      active = false;
    };
  }, [allHandles.join(",")]);

  const handleCreate = async () => {
    if (!newName.trim() || creating) return;
    setCreating(true);
    await createOccasion(newName);
    setCreating(false);
    setNewName("");
  };

  const hasOccasions = wishlist.length > 0;

  return (
    <section className="mx-auto max-w-[1440px] px-5 pb-20 sm:px-6 md:px-12 lg:px-16">
      <div className="mb-6 flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 flex items-center gap-2 font-sans text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            <Heart className="h-3.5 w-3.5" /> Your Wishlist
          </p>
          <h2 className="font-serif text-2xl font-medium md:text-3xl">Occasions</h2>
        </div>
        <div className="flex items-center gap-2">
          <input
            value={newName}
            maxLength={60}
            placeholder="New Occasion name"
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleCreate();
              }
            }}
            className="w-44 rounded-none border border-border bg-background px-3 py-2 text-[13px] font-sans focus:border-foreground focus:outline-none"
          />
          <button
            type="button"
            onClick={handleCreate}
            disabled={!newName.trim() || creating}
            className="flex items-center gap-1.5 border border-foreground bg-foreground px-4 py-2 text-[10px] tracking-[0.2em] uppercase font-sans text-background transition-colors hover:bg-transparent hover:text-foreground disabled:opacity-50"
          >
            {creating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
            Create
          </button>
        </div>
      </div>

      {!hasOccasions ? (
        <div className="border border-dashed border-border py-16 text-center">
          <Heart className="mx-auto mb-4 h-6 w-6 text-muted-foreground" />
          <p className="mb-1 font-serif text-lg">Create your first Occasion</p>
          <p className="mx-auto max-w-sm font-sans text-[13px] text-muted-foreground">
            Group the pieces you love by moment — a wedding, a holiday, a everyday rotation.
            Tap the heart on any piece to save it here.
          </p>
        </div>
      ) : loadingProducts ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="space-y-6">
          {wishlist.map((occasion) => (
            <OccasionBlock key={occasion.id} occasion={occasion} products={products} />
          ))}
        </div>
      )}
    </section>
  );
};
