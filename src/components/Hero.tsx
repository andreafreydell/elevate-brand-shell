export const Hero = () => {
  return (
    <section className="border-b border-border">
      <div className="max-w-[1400px] mx-auto grid md:grid-cols-2 min-h-[70vh]">
        {/* Left: Image */}
        <div className="bg-card border-r border-border overflow-hidden">
          <div className="w-full h-full min-h-[400px] bg-secondary flex items-center justify-center">
            <span className="text-xs tracking-wider uppercase text-muted-foreground">Editorial Image</span>
          </div>
        </div>

        {/* Right: Copy */}
        <div className="flex flex-col justify-center px-8 md:px-16 py-16 md:py-24">
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-6 font-sans">
            Introducing
          </p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium leading-[1.1] tracking-[-0.01em] mb-6">
            Unlimited Designer{" "}
            <em className="italic">Jewelry</em>
          </h1>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-md mb-10 font-sans">
            One membership. Infinite possibility. Access the full GEA collection — 
            crafted moissanite, designed without compromise.
          </p>
          <a
            href="#collection"
            className="inline-block border border-foreground bg-foreground text-background px-8 py-3.5 text-xs tracking-[0.2em] uppercase font-sans hover:bg-transparent hover:text-foreground transition-colors self-start"
          >
            Explore Collection
          </a>
        </div>
      </div>
    </section>
  );
};
