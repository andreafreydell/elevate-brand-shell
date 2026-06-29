/** A dark wavy ribbon that sits over the seam between the banner and the video.
 *  Both edges undulate (tight, frequent waves); it overlaps both sections so the
 *  banner shows above the top wave and the video shows below the bottom wave. */
const W = 1440;
const PERIOD = 120; // smaller = tighter / more frequent
const AMP = 7;
const TOP = 66;
const BOT = 84;

const buildPath = () => {
  let top = `M0,${TOP}`;
  for (let x = 0; x < W; x += PERIOD) {
    top += ` Q ${x + PERIOD / 4},${TOP - AMP} ${x + PERIOD / 2},${TOP} Q ${x + (3 * PERIOD) / 4},${TOP + AMP} ${x + PERIOD},${TOP}`;
  }
  let bot = ` L${W},${BOT}`;
  for (let x = W; x > 0; x -= PERIOD) {
    bot += ` Q ${x - PERIOD / 4},${BOT + AMP} ${x - PERIOD / 2},${BOT} Q ${x - (3 * PERIOD) / 4},${BOT - AMP} ${x - PERIOD},${BOT}`;
  }
  return `${top}${bot} Z`;
};

export const WaveTransition = () => (
  <div
    aria-hidden="true"
    className="pointer-events-none relative z-[3] -mt-[42px] md:-mt-[68px] -mb-[42px] md:-mb-[68px]"
  >
    <svg className="block w-full h-[88px] md:h-[150px]" viewBox="0 0 1440 150" preserveAspectRatio="none">
      <path d={buildPath()} fill="hsl(30 12% 10%)" />
    </svg>
  </div>
);
