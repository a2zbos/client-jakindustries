import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useContent } from "@/lib/content";
import { Magnetic } from "./motion";
import { cn } from "@/lib/utils";

/** Paragraph whose words light up one by one as you scroll through it. */
export function ScrollHighlight({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] });
  const words = text.split(" ");
  return (
    <p ref={ref} className={cn("flex flex-wrap", className)}>
      {words.map((w, i) => (
        <Word key={`${w}-${i}`} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
          {w}
        </Word>
      ))}
    </p>
  );
}

function Word({ children, progress, range }: { children: ReactNode; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  const y = useTransform(progress, range, [8, 0]);
  return (
    <motion.span style={{ opacity, y }} className="mr-[0.28em] inline-block">
      {children}
    </motion.span>
  );
}

/** Infinite logo marquee of customers. */
export function ClientMarquee({ reverse = false }: { reverse?: boolean }) {
  const { clients } = useContent();
  const list = reverse ? [...clients].reverse() : clients;
  return (
    <div className="group relative flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
      <div className={cn("flex w-max shrink-0 gap-4 pr-4 group-hover:[animation-play-state:paused]", reverse ? "animate-marquee-reverse" : "animate-marquee")}>
        {[...list, ...list].map((c, i) => (
          <div key={`${c.name}-${i}`} className="flex h-24 w-48 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-paper p-2 grayscale transition duration-500 hover:grayscale-0">
            <img src={c.logo} alt={c.name} loading="lazy" className="h-full w-full object-cover object-top" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function TextMarquee({ items }: { items: string[] }) {
  return (
    <div className="flex overflow-hidden border-y border-border bg-card py-5">
      <div className="flex w-max animate-marquee gap-10 pr-10">
        {[...items, ...items, ...items, ...items].map((t, i) => (
          <span key={i} className="flex items-center gap-10 font-display text-2xl font-medium tracking-tight text-foreground md:text-4xl">
            {t}
            <span className="h-3 w-3 rotate-45 bg-primary" />
          </span>
        ))}
      </div>
    </div>
  );
}

/** Pinned section whose cards slide sideways as you scroll down. */
export function HorizontalScroll({ children, title }: { children: ReactNode; title: ReactNode }) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  useEffect(() => {
    const measure = () => {
      if (!track.current) return;
      setDistance(Math.max(0, track.current.scrollWidth - window.innerWidth + 80));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const bar = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return (
    <section ref={section} style={{ height: `calc(100vh + ${distance}px)` }} className="relative">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="mx-auto mb-10 w-full max-w-[1440px] px-5 md:px-10">{title}</div>
        <motion.div ref={track} style={{ x }} className="flex w-max gap-6 pl-5 md:pl-10">
          {children}
        </motion.div>
        <div className="mx-auto mt-10 w-full max-w-[1440px] px-5 md:px-10">
          <div className="h-px w-full bg-border">
            <motion.div style={{ scaleX: bar }} className="h-full origin-left bg-wind" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function CTA({ title = "Let's build what moves the wind.", kicker = "Save your energy" }: { title?: string; kicker?: string }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rotateX = useTransform(scrollYProgress, [0, 0.5], [35, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.85, 1]);
  return (
    <section ref={ref} className="perspective-1200 px-5 py-28 md:px-10">
      <motion.div
        style={{ rotateX, scale }}
        className="relative mx-auto max-w-[1440px] overflow-hidden rounded-[2rem] border border-border bg-card px-6 py-20 text-center md:py-28"
      >
        <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-primary/25 blur-3xl animate-pulse-glow" />
        <div className="absolute -bottom-24 -right-10 h-96 w-96 rounded-full bg-spark/20 blur-3xl animate-pulse-glow" />
        <div className="absolute inset-0 grid-lines opacity-40" />
        <div className="relative">
          <div className="eyebrow mb-6">{kicker}</div>
          <h2 className="mx-auto max-w-4xl text-4xl font-semibold leading-[1] md:text-7xl">{title}</h2>
          <div className="mt-12">
            <Magnetic>
              <Link
                to="/contact"
                className="inline-flex items-center gap-3 rounded-full bg-primary px-9 py-5 text-base font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-105"
              >
                Get a quote <ArrowUpRight className="h-5 w-5" />
              </Link>
            </Magnetic>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
