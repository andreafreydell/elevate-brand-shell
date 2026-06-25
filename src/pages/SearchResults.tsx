import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHero } from "@/components/layout/PageHero";
import { ScribbleUnderline } from "@/components/craft/ScribbleUnderline";
import { loadSearchIndex, searchItems, type SearchItem } from "@/lib/searchIndex";

const withWidth = (url: string, w: number) => `${url}${url.includes("?") ? "&" : "?"}width=${w}`;

const SearchResults = () => {
  const [params] = useSearchParams();
  const q = params.get("q") || "";
  const [index, setIndex] = useState<SearchItem[] | null>(null);

  useEffect(() => {
    let active = true;
    loadSearchIndex()
      .then((items) => active && setIndex(items))
      .catch(() => active && setIndex([]));
    return () => {
      active = false;
    };
  }, []);

  const results = useMemo(() => (index ? searchItems(index, q, 120) : []), [index, q]);

  return (
    <PageLayout>
      <PageHero
        headline={<>Search the <ScribbleUnderline>Vault</ScribbleUnderline></>}
        subtitle={q ? `Showing pieces for “${q}”.` : "Find a piece by name, material, color, or occasion."}
        heroMobileCompact
      />
      <section className="mx-auto max-w-[1400px] px-5 py-10 sm:px-6 md:px-12 md:py-16 lg:px-16">
        {!index ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : results.length === 0 ? (
          <div className="py-20 text-center">
            <p className="mb-2 text-[1.4rem]" style={{ fontFamily: "var(--font-script)", color: "var(--poppy-deep)" }}>
              nothing blooming here yet ✿
            </p>
            <p className="font-sans text-sm uppercase tracking-wider text-muted-foreground">
              {q ? `No pieces match “${q}” — try another word.` : "Type a search to begin."}
            </p>
          </div>
        ) : (
          <>
            <p className="mb-6 font-sans text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
              {results.length} {results.length === 1 ? "piece" : "pieces"}
            </p>
            <div className="grid grid-cols-2 gap-[1px] bg-border lg:grid-cols-4">
              {results.map((r) => (
                <Link key={r.handle} to={`/product/${r.handle}`} className="group block bg-background p-3 sm:p-5">
                  <div className="aspect-square overflow-hidden border border-border bg-[#eaddc7]">
                    {r.image && (
                      <img
                        src={withWidth(r.image, 600)}
                        alt={r.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        decoding="async"
                      />
                    )}
                  </div>
                  <h3 className="mt-3 font-serif text-[15px] leading-snug">{r.title}</h3>
                  <p className="font-sans text-[12px] text-muted-foreground">
                    {[r.productType, r.color].filter(Boolean).join(" · ")}
                  </p>
                  {r.price && <p className="mt-0.5 font-sans text-[13px]">${parseFloat(r.price).toFixed(2)}</p>}
                </Link>
              ))}
            </div>
          </>
        )}
      </section>
    </PageLayout>
  );
};

export default SearchResults;
