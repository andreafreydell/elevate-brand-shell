export const Hero = () => {
  return (
    <section className="border-b border-border">
      <div className="max-w-[1400px] mx-auto grid md:grid-cols-2 min-h-[65vh]">
        {/* Left: Lifestyle image placeholder */}
        <div className="overflow-hidden bg-[hsl(30,20%,35%)] relative">
          <div className="w-full h-full min-h-[400px] flex items-center justify-center">
            <span className="text-xs tracking-wider uppercase text-[hsl(36,33%,85%)]">Lifestyle Image</span>
          </div>
        </div>

        {/* Right: Warm gradient copy panel */}
        <div className="flex flex-col justify-center items-center text-center px-10 md:px-16 py-16 md:py-24 bg-gradient-to-br from-[hsl(30,25%,42%)] to-[hsl(25,22%,30%)]">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-[3.5rem] font-medium leading-[1.1] tracking-[-0.01em] mb-8 text-[hsl(36,33%,92%)]">
            GEA /<br />
            <em className="italic">Explore the Edit</em>
          </h1>
          <a
            href="#collection"
            className="inline-block border-b-2 border-[hsl(36,33%,85%)] pb-1 text-[11px] tracking-[0.3em] uppercase font-sans text-[hsl(36,33%,85%)] hover:opacity-70 transition-opacity"
          >
            Discover More
          </a>
        </div>
      </div>
    </section>
  );
};
