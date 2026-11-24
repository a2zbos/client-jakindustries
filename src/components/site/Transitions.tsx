import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouterState } from "@tanstack/react-router";
import Lenis from "lenis";
import { NAV } from "@/lib/site-data";

const EASE = [0.76, 0, 0.24, 1] as const;

/** One-time intro: counts to 100, then the shutters split open. */
export function Preloader() {
  const [done, setDone] = useState(false);
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min((t - start) / 1400, 1);
      setN(Math.round((1 - Math.pow(1 - p, 3)) * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setTimeout(() => setDone(true), 200);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <AnimatePresence>
      {!done && (
        <motion.div className="fixed inset-0 z-[100] flex" exit={{ pointerEvents: "none" }} aria-hidden>
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className="h-full flex-1 bg-card"
              exit={{ y: i % 2 ? "100%" : "-100%" }}
              transition={{ duration: 1, ease: EASE, delay: i * 0.06 }}
            />
          ))}
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center gap-6"
            exit={{ opacity: 0, scale: 0.9, filter: "blur(12px)" }}
            transition={{ duration: 0.5 }}
          >
            <motion.img
              src="/jak/logo-jak.png"
              alt=""
              className="h-14 w-auto box-content rounded-xl dark:bg-white dark:px-4 dark:py-3"
              initial={{ rotateY: 90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            />
            <div className="h-px w-56 overflow-hidden bg-border">
              <div className="h-full bg-wind" style={{ width: `${n}%` }} />
            </div>
            <div className="font-mono text-xs tracking-[0.3em] text-muted-foreground">{String(n).padStart(3, "0")} / 100</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Curtain that sweeps across on every page change, with the destination name. */
export function RouteCurtain() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const first = useRef(true);
  const [key, setKey] = useState<string | null>(null);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setKey(pathname);
  }, [pathname]);
  const label = NAV.find((n) => n.to === pathname)?.label ?? "JAK";
  return (
    <AnimatePresence>
      {key && (
        <motion.div
          key={key}
          className="pointer-events-none fixed inset-0 z-[90]"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          onAnimationComplete={() => setTimeout(() => setKey(null), 900)}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className={i === 1 ? "absolute inset-0 bg-primary" : i === 0 ? "absolute inset-0 bg-spark" : "absolute inset-0 bg-card"}
              initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
              animate={{ clipPath: "inset(0% 0% 100% 0%)" }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.25 + (2 - i) * 0.08 }}
            />
          ))}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 0, y: -60 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.2 }}
          >
            <span className="font-display text-5xl font-semibold tracking-tight text-foreground md:text-7xl">{label}</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Wraps page content so each new page rises into place. */
export function PageEnter({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
    >
      {children}
    </motion.div>
  );
}

/** Inertial smooth scrolling; jumps to top on page change. */
export function SmoothScroll() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const lenisRef = useRef<Lenis | null>(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    lenisRef.current = lenis;
    let raf = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);
  useEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true });
  }, [pathname]);
  return null;
}

/** Ring cursor that follows the pointer and swells over links (desktop only). */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
    let x = window.innerWidth / 2, y = window.innerHeight / 2, rx = x, ry = y, scale = 1, target = 1;
    let raf = 0;
    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      const el = e.target as HTMLElement | null;
      target = el?.closest("a, button, [data-cursor]") ? 2.4 : 1;
    };
    const loop = () => {
      rx += (x - rx) * 0.16;
      ry += (y - ry) * 0.16;
      scale += (target - scale) * 0.15;
      if (dot.current) dot.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%) scale(${scale})`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", move);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
    };
  }, []);
  if (!enabled) return null;
  return (
    <>
      <div ref={dot} className="pointer-events-none fixed left-0 top-0 z-[110] h-1.5 w-1.5 rounded-full bg-primary" />
      <div ref={ring} className="pointer-events-none fixed left-0 top-0 z-[110] h-9 w-9 rounded-full border border-primary/60 mix-blend-difference" />
    </>
  );
}

/** Thin progress bar showing how far down the page you are. */
export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const on = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return <div ref={bar} className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left scale-x-0 bg-wind" />;
}
