import { Calendar, RefreshCw, Gem, ArrowUpRight } from "lucide-react";

const props = [
  {
    icon: Calendar,
    title: "Curated for Every Season.",
    desc: "Fresh styles for your wardrobe.",
  },
  {
    icon: RefreshCw,
    title: "Freedom to Evolve.",
    desc: "Swap your jewelry monthly.",
  },
  {
    icon: Gem,
    title: "Craftsmanship, Reimagined.",
    desc: "Artisanal pieces delivered to you.",
  },
];

export const ValueProps = () => {
  return (
    <section className="max-w-[1400px] mx-auto px-6 py-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {props.map((p) => (
          <div
            key={p.title}
            className="bg-card border border-border p-6 flex flex-col justify-between min-h-[170px]"
          >
            <p.icon className="h-8 w-8 text-foreground mb-4 stroke-[1.2]" />
            <div className="flex items-end justify-between">
              <div>
                <h3 className="font-serif text-base font-semibold leading-tight mb-1">{p.title}</h3>
                <p className="text-xs text-muted-foreground font-sans">{p.desc}</p>
              </div>
              <ArrowUpRight className="h-4 w-4 text-foreground flex-shrink-0 ml-3" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
