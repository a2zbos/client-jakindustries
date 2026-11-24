import { motion, useReducedMotion, type Transition } from "framer-motion";

/** Small looping line drawings for the six "What we do" cards. Static when reduced motion is on. */
export function CapabilityArt({ n }: { n: string }) {
  const still = useReducedMotion();
  const loop = (duration: number, extra: Transition = {}): Transition =>
    still ? { duration: 0 } : { duration, repeat: Infinity, ease: "easeInOut", ...extra };
  const a = <T,>(values: T) => (still ? undefined : values);
  const common = {
    viewBox: "0 0 160 100",
    className: "h-24 w-auto text-primary",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (n) {
    // Heavy fabrication: a weld bead runs along the seam, throwing sparks.
    case "01":
      return (
        <svg {...common}>
          <rect x="20" y="40" width="120" height="16" rx="2" opacity="0.5" />
          <rect x="20" y="60" width="120" height="16" rx="2" opacity="0.5" />
          <motion.line x1="20" y1="58" x2="140" y2="58" className="text-spark" stroke="currentColor" strokeWidth="3"
            initial={{ pathLength: still ? 1 : 0 }} animate={a({ pathLength: [0, 1, 1] })} transition={loop(2.6, { ease: "linear", times: [0, 0.8, 1] })} />
          <motion.g className="text-spark" stroke="currentColor" animate={a({ x: [0, 120, 120] })} transition={loop(2.6, { ease: "linear", times: [0, 0.8, 1] })}>
            {[[-6, -12], [0, -16], [6, -12], [9, -6], [-9, -6]].map(([dx, dy], i) => (
              <motion.line key={i} x1="20" y1="58" x2={20 + dx} y2={58 + dy} strokeWidth="1.5"
                animate={a({ opacity: [0, 1, 0] })} transition={loop(0.35, { delay: i * 0.07 })} />
            ))}
          </motion.g>
        </svg>
      );
    // Precision machining: a gear turns under a cutter that dips in.
    case "02":
      return (
        <svg {...common}>
          <motion.g style={{ transformBox: "view-box", transformOrigin: "70px 60px" }} animate={a({ rotate: 360 })} transition={loop(6, { ease: "linear" })}>
            <circle cx="70" cy="60" r="22" />
            <circle cx="70" cy="60" r="7" />
            {Array.from({ length: 10 }, (_, i) => (
              <rect key={i} x="67" y="32" width="6" height="8" rx="1" transform={`rotate(${i * 36} 70 60)`} />
            ))}
          </motion.g>
          <motion.g className="text-spark" stroke="currentColor" animate={a({ y: [0, 8, 0] })} transition={loop(1.6)}>
            <line x1="112" y1="6" x2="112" y2="30" />
            <path d="M104 30 h16 l-8 10 z" />
          </motion.g>
          <line x1="96" y1="6" x2="140" y2="6" opacity="0.5" />
        </svg>
      );
    // Assembly: two plates slide together and bolts drop in.
    case "03":
      return (
        <svg {...common}>
          <motion.rect x="24" y="38" width="56" height="30" rx="3" animate={a({ x: [-12, 0, 0, -12] })} transition={loop(3, { times: [0, 0.3, 0.8, 1] })} />
          <motion.rect x="80" y="38" width="56" height="30" rx="3" animate={a({ x: [12, 0, 0, 12] })} transition={loop(3, { times: [0, 0.3, 0.8, 1] })} />
          {[64, 96].map((x, i) => (
            <motion.g key={x} className="text-spark" stroke="currentColor" animate={a({ y: [-24, -24, 0, 0, -24], opacity: [0, 0, 1, 1, 0] })}
              transition={loop(3, { times: [0, 0.3 + i * 0.05, 0.45 + i * 0.05, 0.8, 1] })}>
              <line x1={x} y1="30" x2={x} y2="62" />
              <line x1={x - 5} y1="30" x2={x + 5} y2="30" strokeWidth="3" />
            </motion.g>
          ))}
        </svg>
      );
    // Pollution control: clarifier seen from above, scraper arm sweeping, ripples spreading.
    case "04":
      return (
        <svg {...common}>
          <circle cx="80" cy="50" r="40" />
          <circle cx="80" cy="50" r="6" />
          {[0, 1].map((i) => (
            <motion.circle key={i} cx="80" cy="50" r="10" opacity="0.6"
              animate={a({ r: [10, 36], opacity: [0.7, 0] })} transition={loop(2.4, { ease: "easeOut", delay: i * 1.2 })} />
          ))}
          <motion.line x1="80" y1="50" x2="120" y2="50" strokeWidth="3" className="text-spark" stroke="currentColor"
            style={{ transformBox: "view-box", transformOrigin: "80px 50px" }} animate={a({ rotate: 360 })} transition={loop(8, { ease: "linear" })} />
        </svg>
      );
    // Piping & tanks: liquid flows through the pipe and the tank level rises and falls.
    case "05":
      return (
        <svg {...common}>
          <defs>
            <clipPath id="cap-tank">
              <rect x="98" y="20" width="44" height="66" rx="8" />
            </clipPath>
          </defs>
          {/* Clip on a wrapper so the moving liquid is cut by the fixed tank outline. */}
          <g clipPath="url(#cap-tank)">
            <motion.rect x="98" y="20" width="44" height="66" className="text-primary" fill="currentColor" stroke="none" opacity="0.35"
              initial={{ y: 30 }} animate={a({ y: [42, 16, 42] })} transition={loop(4)} />
          </g>
          <rect x="98" y="20" width="44" height="66" rx="8" />
          <path d="M14 70 H60 V40 H98" />
          <motion.path d="M14 70 H60 V40 H98" className="text-spark" stroke="currentColor" strokeWidth="2.5" strokeDasharray="4 10"
            animate={a({ strokeDashoffset: [0, -28] })} transition={loop(0.8, { ease: "linear" })} />
        </svg>
      );
    // Erection & commissioning: a crane lowers a section into place.
    case "06":
      return (
        <svg {...common}>
          <path d="M36 92 V12 H128" />
          <path d="M36 12 L52 28 M36 28 L52 12" opacity="0.5" />
          <line x1="20" y1="92" x2="150" y2="92" opacity="0.5" />
          <motion.line x1="110" y1="12" x2="110" y2="40" strokeDasharray="2 3" animate={a({ y2: [40, 74, 40] })} transition={loop(3.6)} />
          <motion.g animate={a({ y: [0, 34, 0] })} transition={loop(3.6)}>
            <path d="M106 40 h8 v4 a4 4 0 1 1 -4 4" />
            <rect x="96" y="52" width="28" height="12" rx="1" className="text-spark" stroke="currentColor" />
          </motion.g>
        </svg>
      );
    default:
      return null;
  }
}
