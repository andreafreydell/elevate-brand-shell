import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ShoppingCart, Minus, Plus, Trash2, ExternalLink, Loader2 } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";

export const CartDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { items, isLoading, isSyncing, updateQuantity, removeItem, getCheckoutUrl, syncCart } = useCartStore();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (parseFloat(item.price.amount) * item.quantity), 0);

  useEffect(() => { if (isOpen) syncCart(); }, [isOpen, syncCart]);

  const handleCheckout = () => {
    const checkoutUrl = getCheckoutUrl();
    if (checkoutUrl) {
      window.open(checkoutUrl, '_blank');
      setIsOpen(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button className="relative p-2 border border-border hover:bg-accent transition-colors rounded-none">
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-none p-0 flex items-center justify-center text-xs bg-foreground text-background">
              {totalItems}
            </Badge>
          )}
        </button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg flex flex-col h-full rounded-none border-l border-border">
        <SheetHeader className="flex-shrink-0 text-left">
          <SheetTitle className="text-2xl tracking-wide">Your Bag</SheetTitle>
          <SheetDescription className="font-sans text-sm tracking-wider uppercase text-muted-foreground">
            {totalItems === 0 ? "No items yet" : `${totalItems} item${totalItems !== 1 ? 's' : ''}`}
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col flex-1 pt-8 min-h-0">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center space-y-3">
                <ShoppingCart className="h-10 w-10 text-muted-foreground mx-auto" />
                <p className="text-sm text-muted-foreground tracking-wider uppercase">Your bag is empty</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto pr-2 min-h-0">
                <div className="divide-y divide-border">
                  {items.map((item) => (
                    <div key={item.variantId} className="flex gap-4 py-6">
                      <div className="w-20 h-20 bg-card border border-border overflow-hidden flex-shrink-0">
                        {item.product.node.images?.edges?.[0]?.node && (
                          <img src={item.product.node.images.edges[0].node.url} alt={item.product.node.title} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif text-sm font-medium leading-tight">{item.product.node.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1 tracking-wider uppercase">{item.selectedOptions.map(o => o.value).join(' · ')}</p>
                        <p className="text-sm font-medium mt-2">{item.price.currencyCode} {parseFloat(item.price.amount).toFixed(2)}</p>
                      </div>
                      <div className="flex flex-col items-end gap-3 flex-shrink-0">
                        <button className="p-1 hover:bg-accent transition-colors" onClick={() => removeItem(item.variantId)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                        <div className="flex items-center border border-border">
                          <button className="p-1.5 hover:bg-accent transition-colors" onClick={() => updateQuantity(item.variantId, item.quantity - 1)}>
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center text-xs">{item.quantity}</span>
                          <button className="p-1.5 hover:bg-accent transition-colors" onClick={() => updateQuantity(item.variantId, item.quantity + 1)}>
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-shrink-0 space-y-4 pt-6 border-t border-border">
                <div className="flex justify-between items-center">
                  <span className="text-xs tracking-wider uppercase text-muted-foreground">Subtotal</span>
                  <span className="font-serif text-lg">{items[0]?.price.currencyCode || '$'} {totalPrice.toFixed(2)}</span>
                </div>
                <Button onClick={handleCheckout} className="w-full rounded-none h-12 text-xs tracking-[0.2em] uppercase font-sans" size="lg" disabled={items.length === 0 || isLoading || isSyncing}>
                  {isLoading || isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <><ExternalLink className="w-4 h-4 mr-3" />Proceed to Checkout</>}
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
