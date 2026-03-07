import { useState } from "react";
import { AnimateIn } from "@/components/shared/AnimateIn";

const tiers = [
  { name: "Tier 2", price: 85, pieces: 10 },
  { name: "Tier 1", price: 65, pieces: 5 },
];

export const SavingsCalculator = () => {
  const [selectedTier, setSelectedTier] = useState(0);
  const [wearsPerPiece, setWearsPerPiece] = useState(5);

  const tier = tiers[selectedTier];
  const avgRetailPrice = 150;

  const traditionalCostPerWear = avgRetailPrice / wearsPerPiece;
  const geaCostPerWear = tier.price / (tier.pieces * wearsPerPiece);
  const monthlySavings = (traditionalCostPerWear * tier.pieces * wearsPerPiece) - tier.price;
  const yearlySavings = monthlySavings * 12;

  return (
    <AnimateIn>
      <div className="border border-border bg-card">
        <div className="p-8 md:p-12 lg:p-14">
          <p className="text-[10px] tracking-[0.3em] uppercase font-sans text-muted-foreground mb-4">
            Interactive
          </p>
          <h3 className="font-serif text-2xl md:text-3xl font-semibold tracking-[0.02em] mb-2">
            Your Access, Calculated
          </h3>
          <p className="text-[12px] text-muted-foreground font-sans leading-relaxed mb-10 max-w-[480px]">
            See how GEA membership transforms your cost-per-wear. Adjust the inputs to match your style.
          </p>

          {/* Tier selector */}
          <div className="mb-8">
            <p className="text-[10px] tracking-[0.25em] uppercase font-sans text-muted-foreground mb-3">
              Select Your Tier
            </p>
            <div className="flex gap-2">
              {tiers.map((t, i) => (
                <button
                  key={t.name}
                  onClick={() => setSelectedTier(i)}
                  className={`flex-1 border px-4 py-3 text-[11px] tracking-[0.15em] uppercase font-sans transition-colors ${
                    i === selectedTier
                      ? "border-foreground bg-foreground text-background"
                      : "border-border hover:border-foreground"
                  }`}
                >
                  {t.name} · {t.pieces} pieces
                </button>
              ))}
            </div>
          </div>

          {/* Wears slider */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] tracking-[0.25em] uppercase font-sans text-muted-foreground">
                Wears Per Piece
              </p>
              <span className="font-serif text-lg font-medium">{wearsPerPiece}</span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={wearsPerPiece}
              onChange={(e) => setWearsPerPiece(Number(e.target.value))}
              className="w-full h-[2px] bg-border appearance-none cursor-pointer accent-foreground [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-foreground [&::-webkit-slider-thumb]:border-0 [&::-webkit-slider-thumb]:cursor-pointer"
            />
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-muted-foreground font-sans">1</span>
              <span className="text-[10px] text-muted-foreground font-sans">10</span>
            </div>
          </div>

          {/* Results */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[2px]">
            <div className="bg-background p-6">
              <p className="text-[10px] tracking-[0.25em] uppercase font-sans text-muted-foreground mb-1">
                Traditional Cost/Wear
              </p>
              <p className="font-serif text-2xl font-medium">
                ${traditionalCostPerWear.toFixed(0)}
              </p>
              <p className="text-[10px] text-muted-foreground font-sans mt-1">
                ${avgRetailPrice} piece ÷ {wearsPerPiece} wears
              </p>
            </div>
            <div className="bg-foreground text-background p-6">
              <p className="text-[10px] tracking-[0.25em] uppercase font-sans text-background/60 mb-1">
                GEA Cost/Wear
              </p>
              <p className="font-serif text-2xl font-medium">
                ${geaCostPerWear.toFixed(0)}
              </p>
              <p className="text-[10px] text-background/60 font-sans mt-1">
                ${tier.price}/mo ÷ {tier.pieces * wearsPerPiece} total wears
              </p>
            </div>
            <div className="bg-background p-6">
              <p className="text-[10px] tracking-[0.25em] uppercase font-sans text-muted-foreground mb-1">
                Annual Value
              </p>
              <p className="font-serif text-2xl font-medium text-[hsl(142,50%,36%)]">
                ${yearlySavings.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
              <p className="text-[10px] text-muted-foreground font-sans mt-1">
                vs. purchasing equivalent pieces
              </p>
            </div>
          </div>
        </div>
      </div>
    </AnimateIn>
  );
};
