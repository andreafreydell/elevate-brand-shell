/** A slim dark wavy ribbon over the seam between the banner and the video.
 *  Drawn as ONE wavy path with a thick round stroke, so both edges are perfectly
 *  parallel (no mismatched/independent top & bottom waves). It overlaps both
 *  sections via negative margins so banner shows above and video below. */
const W = 1440;
const PERIOD = 120; // smaller = tighter / more frequent
const AMP = 9; // wave height
const MID = 75; // vertical centre within the 150 viewBox
const THICK = 18; // ribbon thickness

const buildPath = () => {
  let d = `M0,${MID}`;
  for (let x = 0; x < W; x += PERIOD) {
    d += ` Q ${x + PERIOD / 4},${MID - AMP} ${x + PERIOD / 2},${MID} Q ${x + (3 * PERIOD) / 4},${MID + AMP} ${x + PERIOD},${MID}`;
  }
  return d;
};

export const WaveTransition = () => (
  <div
    aria-hidden="true"
    className="pointer-events-none relative z-[3] -mt-[44px] md:-mt-[75px] -mb-[44px] md:-mb-[75px]"
  >
    <svg className="block w-full h-[88px] md:h-[150px]" viewBox="0 0 1440 150" preserveAspectRatio="none">
      <path
        d={buildPath()}
        fill="none"
        stroke="hsl(30 12% 10%)"
        strokeWidth={THICK}
        strokeLinecap="round"
      />
    </svg>
  </div>
);
