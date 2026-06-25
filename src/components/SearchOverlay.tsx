import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, X, Loader2 } from "lucide-react";
import { loadSearchIndex, searchItems, suggestAttributes, type SearchItem } from "@/lib/searchIndex";

const withWidth = (url: string, w: number) => `${url}${url.includes("?") ? "&" : "?"}width=${w}`;

export const SearchOverlay = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [term, setTerm] = useState("");
  const [debounced, setDebounced] = useState("");
  const [index, setIndex] = useState<SearchItem[] | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // load the index + focus the input whenever the overlay opens
  useEffect(() => {
    if (!open) return;
    let active = true;
    loadSearchIndex().then((items) => active && setIndex(items)).catch(() => {});
    const focus = window.setTimeout(() => inputRef.current?.focus(), 60);
    document.body.style.overflow = "hidden";
    return () => {
      active = false;
      window.clearTimeout(focus);
      document.body.style.overflow = "";
    };
  }, [open]);

  // debounce the typed term
  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(term), 170);
    return () => window.clearTimeout(t);
  }, [term]);

  // reset on close + escape to close
  useEffect(() => {
    if (!open) {
      setTerm("");
      setDebounced("");
      return;
    }
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const results = useMemo(() => (index ? searchItems(index, debounced, 7) : []), [index, debounced]);
  const chips = useMemo(() => suggestAttributes(debounced, 5), [debounced]);

  if (!open) return null;

  const submit = () => {
    const q = term.trim();
    if (!q) return;
    onClose();
    navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <div className="fixed inset-0 z-[95]">
      <div className="absolute inset-0 bg-foreground/30" onClick={onClose} aria-hidden="true" />
      <div className="relative mx-auto w-full max-w-[680px] border-b border-border bg-background px-5 py-5 shadow-[0_24px_60px_rgba(33,25,18,0.22)] sm:px-6 md:rounded-b-2xl">
        <div className="flex items-center gap-3 border-b border-border pb-3">
          <Search className="h-5 w-5 shrink-0 stroke-[1.5] text-muted-foreground" />
          <input
            ref={inputRef}
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="Search the vault — try emerald, evening, gold hoops…"
            className="min-w-0 flex-1 bg-transparent font-sans text-[15px] outline-none placeholder:text-muted-foreground/70"
          />
          <button onClick={onClose} aria-label="Close search" className="p-1 transition-opacity hover:opacity-70">
            <X className="h-5 w-5 stroke-[1.5]" />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto pt-3">
          {chips.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {chips.map((c) => (
                <button
                  key={c}
                  onClick={() => setTerm(c)}
                  className="rounded-full border border-border px-3 py-1 font-sans text-[11px] tracking-[0.06em] text-foreground/80 transition-colors hover:border-[var(--poppy)] hover:text-foreground"
                >
                  {c}
                </button>
              ))}
            </div>
          )}

          {!debounced && (
            <p className="py-7 text-center font-sans text-[12px] text-muted-foreground">
              Start typing to search by name, material, color, or occasion{" "}
              <span aria-hidden="true" style={{ color: "var(--poppy)" }}>✿</span>
            </p>
          )}

          {debounced && !index && (
            <p className="flex items-center justify-center gap-2 py-7 font-sans text-[12px] text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> searching the vault…
            </p>
          )}

          {debounced && index && results.length === 0 && (
            <p className="py-7 text-center font-sans text-[12px] text-muted-foreground">
              No pieces match “{debounced}” — try another word.
            </p>
          )}

          {results.length > 0 && (
            <ul className="space-y-1">
              {results.map((r) => (
                <li key={r.handle}>
                  <Link
                    to={`/product/${r.handle}`}
                    onClick={onClose}
                    className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-accent"
                  >
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md bg-[#eaddc7]">
                      {r.image && (
                        <img src={withWidth(r.image, 96)} alt="" aria-hidden="true" className="h-full w-full object-cover" loading="lazy" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-serif text-[14px]">{r.title}</p>
                      <p className="truncate font-sans text-[11px] text-muted-foreground">
                        {[r.productType, r.color].filter(Boolean).join(" · ")}
                      </p>
                    </div>
                    {r.price && (
                      <span className="shrink-0 font-sans text-[12px] text-muted-foreground">
                        ${parseFloat(r.price).toFixed(2)}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {debounced && results.length > 0 && (
            <button
              onClick={submit}
              className="mt-3 w-full border-t border-border pt-3 text-left font-sans text-[12px] tracking-[0.06em] text-[var(--poppy-deep)] transition-opacity hover:opacity-75"
            >
              See all results for “{debounced}” →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
