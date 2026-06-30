import { useEffect, useRef, useState } from "react";
import { Heart, Plus, Check, Loader2, ArrowLeft } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useCustomerAuth } from "@/contexts/CustomerAuthContext";
import { cn } from "@/lib/utils";

interface WishlistHeartProps {
  /** Shopify product handle to save/remove. */
  handle: string;
  /** Icon size in px. */
  size?: number;
  /** Extra classes for the trigger button (positioning, etc.). */
  className?: string;
}

/**
 * Heart button + Occasions popover. Signed-out shoppers are routed to the auth
 * modal; signed-in shoppers get an accessible popover to add/remove the product
 * from their Occasions or create a new one.
 */
export const WishlistHeart = ({ handle, size = 18, className }: WishlistHeartProps) => {
  const {
    isSignedIn,
    openAuthModal,
    wishlist,
    isInWishlist,
    createOccasion,
    toggleProductInOccasion,
  } = useCustomerAuth();

  const [open, setOpen] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const saved = isInWishlist(handle);
  const hasOccasions = wishlist.length > 0;

  // When the create field is revealed, focus it for keyboard users.
  useEffect(() => {
    if (showCreate) inputRef.current?.focus();
  }, [showCreate]);

  // Reset the inline create state whenever the popover closes.
  useEffect(() => {
    if (!open) {
      setShowCreate(false);
      setNewName("");
    }
  }, [open]);

  // We manage opening manually (not via Radix's trigger) because the heart often
  // lives inside a product <Link>: we must preventDefault to stop navigation,
  // which would otherwise also cancel Radix's built-in trigger toggle.
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isSignedIn) {
      openAuthModal({ mode: "signup", intent: "favorites" });
      return;
    }
    setOpen((o) => !o);
  };

  const handleCreate = async () => {
    if (!newName.trim() || busy) return;
    setBusy(true);
    await createOccasion(newName, handle);
    setBusy(false);
    setNewName("");
    setShowCreate(false);
  };

  const handleToggle = async (occasionId: string) => {
    setBusy(true);
    await toggleProductInOccasion(occasionId, handle);
    setBusy(false);
  };

  return (
    <Popover open={open} onOpenChange={(next) => !next && setOpen(false)}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={saved ? "Saved to Occasions — edit" : "Save to an Occasion"}
          aria-pressed={saved}
          onClick={handleClick}
          className={cn(
            "flex items-center justify-center bg-background/85 backdrop-blur-sm border border-border p-2 text-foreground transition-colors hover:bg-background focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40",
            className,
          )}
        >
          <Heart
            style={{ height: size, width: size }}
            className={cn("stroke-[1.5] transition-colors", saved ? "fill-[var(--poppy)] text-[var(--poppy)]" : "text-foreground")}
          />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-64 rounded-none border-border bg-card p-0"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <div className="border-b border-border px-4 py-3">
          <p className="text-[10px] tracking-[0.25em] uppercase font-sans text-muted-foreground">
            {hasOccasions ? "Save to an Occasion" : "Start your wishlist"}
          </p>
        </div>

        {hasOccasions && !showCreate && (
          <ul className="max-h-56 overflow-y-auto py-1" role="listbox" aria-label="Your Occasions">
            {wishlist.map((occasion) => {
              const inThis = occasion.items.includes(handle);
              return (
                <li key={occasion.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={inThis}
                    disabled={busy}
                    onClick={() => handleToggle(occasion.id)}
                    className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-[13px] font-sans transition-colors hover:bg-accent disabled:opacity-60"
                  >
                    <span className="truncate">{occasion.name}</span>
                    <span
                      className={cn(
                        "flex h-4 w-4 shrink-0 items-center justify-center border",
                        inThis ? "border-[var(--poppy)] bg-[var(--poppy)] text-[#faf4e8]" : "border-border",
                      )}
                    >
                      {inThis && <Check className="h-3 w-3 stroke-[3]" />}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {showCreate || !hasOccasions ? (
          <div className="px-4 py-3 space-y-2">
            <label
              htmlFor={`new-occasion-${handle}`}
              className="block text-[10px] tracking-[0.2em] uppercase font-sans text-muted-foreground"
            >
              {hasOccasions ? "New Occasion" : "Create your first Occasion"}
            </label>
            <input
              ref={inputRef}
              id={`new-occasion-${handle}`}
              type="text"
              value={newName}
              maxLength={60}
              placeholder="e.g. Wedding guest"
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleCreate();
                }
              }}
              className="w-full rounded-none border border-border bg-background px-3 py-2 text-[13px] font-sans focus:border-foreground focus:outline-none"
            />
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCreate}
                disabled={!newName.trim() || busy}
                className="flex flex-1 items-center justify-center gap-1.5 border border-foreground bg-foreground py-2 text-[10px] tracking-[0.2em] uppercase font-sans text-background transition-colors hover:bg-transparent hover:text-foreground disabled:opacity-50"
              >
                {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                Save
              </button>
              {hasOccasions && (
                <button
                  type="button"
                  onClick={() => {
                    setShowCreate(false);
                    setNewName("");
                  }}
                  aria-label="Back to Occasions"
                  className="flex items-center justify-center border border-border p-2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="border-t border-border">
            <button
              type="button"
              onClick={() => setShowCreate(true)}
              className="flex w-full items-center gap-2 px-4 py-3 text-left text-[12px] tracking-[0.05em] font-sans text-foreground transition-colors hover:bg-accent"
            >
              <Plus className="h-4 w-4" />
              Create new Occasion
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
