import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowUpRight, Award, Factory, Wind, Droplets } from "lucide-react";
import windfarm from "@/assets/windfarm.jpg";
import workshop from "@/assets/workshop.jpg";
import clarifier from "@/assets/clarifier.jpg";
import galvanizing from "@/assets/galvanizing.jpg";
import { TurbineCanvas } from "@/components/site/Scenes";
import { Counter, Magnetic, ParallaxImage, Reveal, SectionLabel, SplitText, TiltCard } from "@/components/site/motion";
import { ClientMarquee, CTA, HorizontalScroll, ScrollHighlight, TextMarquee } from "@/components/site/sections";
import { CAPABILITIES, HERO_SLIDES, PROMISES, STATS } from "@/lib/site-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "JAK Industries — Forging the Wind Economy | Chennai" },
      {
        name: "description",
        content:
          "Heavy fabrication of wind turbine components and pollution control equipment from four units in Chennai. ISO 9001, 14001 and 45001 certified since 2004.",
      },
      { property: "og:title", content: "JAK Industries — Forging the Wind Economy" },
      {
        property: "og:description",
        content: "Wind turbine components and pollution control equipment, fabricated in Chennai since 2004.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const EASE = [0.16, 1, 0.3, 1] as const;

function Hero() {
  const [i, setI] = useState(0);
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.1, 1.4]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % HERO_SLIDES.length), 5200);
    return () => clearInterval(t);
  }, []);
  const slide = HERO_SLIDES[i] ?? HERO_SLIDES[0]!;

  return (
    <section ref={ref} className="relative h-[100svh] min-h-[680px] overflow-hidden">
      <motion.img src={windfarm} alt="" style={{ scale: bgScale }} className="absolute inset-0 h-full w-full object-cover opacity-40" />
      <div className="absolute inset-0 bg-vignette" />
      <TurbineCanvas className="absolute inset-0" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-fade-b" />

      <motion.div style={{ y: textY, opacity: fade }} className="relative z-10 mx-auto flex h-full max-w-[1440px] flex-col justify-center px-5 md:px-10">
        <div className="max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div key={i} exit={{ opacity: 0, y: -30, filter: "blur(8px)" }} transition={{ duration: 0.5 }}>
              <motion.div
                className="eyebrow mb-6 flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse-glow" />
                {slide.kicker}
              </motion.div>
              <h1 className="text-[13vw] font-semibold leading-[0.9] sm:text-7xl md:text-8xl lg:text-[7.5rem]">
                <SplitText text={slide.title[0] ?? ""} animateOnMount delay={0.25} className="block" />
                <SplitText text={slide.title[1] ?? ""} animateOnMount delay={0.45} className="block" wordClassName="text-gradient-wind" />
              </h1>
            </motion.div>
          </AnimatePresence>
          <motion.p
            className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.6, ease: EASE }}
          >
            Critical components for the world's biggest wind turbine makers and pollution control systems — fabricated,
            machined and assembled in Chennai since 2004.
          </motion.p>
          <motion.div
            className="mt-10 flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.8, ease: EASE }}
          >
            <Magnetic>
              <Link to="/products" className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-4 text-sm font-semibold text-primary-foreground shadow-glow">
                Explore products <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Magnetic>
            <Link to="/about" className="inline-flex items-center gap-2 rounded-full border border-border px-7 py-4 text-sm font-semibold text-foreground backdrop-blur transition-colors hover:border-primary hover:text-primary">
              Our story
            </Link>
          </motion.div>
        </div>
      </motion.div>

      <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3 text-xs text-muted-foreground">
        <span className="font-mono tracking-[0.3em]">SCROLL</span>
        <motion.span animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.8 }}>
          <ArrowDown className="h-4 w-4" />
        </motion.span>
      </div>
      <div className="absolute bottom-8 right-5 z-10 hidden gap-2 md:right-10 md:flex">
        {HERO_SLIDES.map((_, idx) => (
          <button key={idx} type="button" aria-label={`Slide ${idx + 1}`} onClick={() => setI(idx)} className="h-1 w-10 overflow-hidden rounded-full bg-border">
            {idx === i && (
              <motion.span className="block h-full bg-primary" initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 5.2, ease: "linear" }} />
            )}
          </button>
        ))}
      </div>
    </section>
  );
}

const DIVISIONS = [
  { icon: Wind, title: "Wind turbine components", body: "Nacelle covers, nose cone rings, tower saddles, transport frames and more.", image: windfarm, to: "/products" as const },
  { icon: Droplets, title: "Pollution control equipment", body: "Clarifiers up to 40 m diameter, thickeners, aerators and filtration.", image: clarifier, to: "/products" as const },
  { icon: Factory, title: "LADCO hot-dip galvanizing", body: "One-stop galvanizing with an 8.6 m zinc bath and its own effluent plant.", image: galvanizing, to: "/ladco" as const },
];

function Home() {
  return (
    <>
      <Hero />

      <TextMarquee items={["Heavy fabrication", "Wind components", "Pollution control", "Hot-dip galvanizing", "Precision machining"]} />

      {/* Welcome */}
      <section className="mx-auto max-w-[1440px] px-5 py-28 md:px-10 md:py-40">
        <SectionLabel index="01">Welcome to JAK Industries</SectionLabel>
        <ScrollHighlight
          className="mt-10 max-w-6xl font-display text-3xl font-medium leading-[1.2] tracking-tight md:text-5xl"
          text="What began in 2004 as a small fabrication shop is now a key supplier of critical components to major wind turbine makers and pollution control consultants across India."
        />
        <Reveal delay={0.1} className="mt-14 flex flex-wrap gap-3">
          {["ISO 9001:2015", "ISO 14001:2015", "ISO 45001:2018 (OH&S)"].map((c) => (
            <span key={c} className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 font-mono text-xs text-foreground">
              <Award className="h-3.5 w-3.5 text-primary" /> {c}
            </span>
          ))}
        </Reveal>
      </section>

      {/* Stats */}
      <section className="border-y border-border">
        <div className="mx-auto grid max-w-[1440px] grid-cols-2 md:grid-cols-4">
          {STATS.map((s, idx) => (
            <Reveal key={s.label} delay={idx * 0.1} className="border-border p-8 md:p-12 [&:not(:last-child)]:border-r">
              <div className="font-display text-5xl font-semibold text-foreground md:text-7xl">
                <Counter to={s.value} suffix={s.suffix} plain={"plain" in s && s.plain} />
              </div>
              <div className="mt-3 text-sm text-muted-foreground">{s.label}</div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Capabilities — horizontal */}
      <HorizontalScroll
        title={
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <SectionLabel index="02">What we do</SectionLabel>
              <SplitText as="h2" text="One partner, from plate to plant" className="mt-6 block max-w-3xl text-4xl font-semibold leading-[1] md:text-6xl" />
            </div>
            <p className="max-w-sm text-muted-foreground">Fabrication, machining, assembly, erection, commissioning and testing — all under one roof, across four units.</p>
          </div>
        }
      >
        {CAPABILITIES.map((c) => (
          <TiltCard key={c.n} className="group h-[52vh] min-h-[360px] w-[78vw] rounded-3xl border border-border bg-card bg-card-sheen p-8 sm:w-[420px]" max={8}>
            <div className="flex h-full flex-col justify-between" style={{ transform: "translateZ(40px)" }}>
              <div className="flex items-start justify-between">
                <span className="font-mono text-sm text-primary">{c.n}</span>
                <ArrowUpRight className="h-6 w-6 text-muted-foreground transition-transform duration-500 group-hover:rotate-45 group-hover:text-primary" />
              </div>
              <div>
                <h3 className="text-3xl font-semibold leading-tight">{c.title}</h3>
                <p className="mt-4 text-muted-foreground">{c.body}</p>
              </div>
            </div>
          </TiltCard>
        ))}
      </HorizontalScroll>

      {/* About + promises */}
      <section className="mx-auto grid max-w-[1440px] items-center gap-16 px-5 py-28 md:grid-cols-2 md:px-10 md:py-40">
        <div className="relative">
          <ParallaxImage src={workshop} alt="Welder fabricating a wind turbine component" className="aspect-[4/5] rounded-3xl" />
          <motion.div
            initial={{ opacity: 0, scale: 0.6, rotate: -12 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: EASE, delay: 0.3 }}
            className="absolute -bottom-8 -right-4 grid h-36 w-36 place-items-center rounded-full bg-spark text-center text-paper-foreground shadow-heat md:-right-8"
          >
            <div>
              <div className="font-display text-3xl font-bold">44+</div>
              <div className="text-[10px] font-semibold uppercase tracking-widest">years of expertise</div>
            </div>
          </motion.div>
        </div>
        <div>
          <SectionLabel index="03">About us</SectionLabel>
          <SplitText as="h2" text="Steel, shaped by decades of know-how" className="mt-6 block text-4xl font-semibold leading-[1.02] md:text-6xl" />
          <Reveal delay={0.2}>
            <p className="mt-8 text-lg leading-relaxed text-muted-foreground">
              Our team of professionals brings more than four decades of heavy structural fabrication to every job — in
              carbon steel, stainless steel and aluminium. "Strive for customer delight" is how we work: the right
              quality, inside the agreed time.
            </p>
          </Reveal>
          <div className="mt-12 space-y-7">
            {PROMISES.map((p, idx) => (
              <div key={p.label}>
                <div className="mb-3 flex justify-between text-sm">
                  <span className="font-semibold">{p.label}</span>
                  <span className="font-mono text-primary">{p.value}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
                  <motion.div
                    className="h-full rounded-full bg-wind"
                    initial={{ width: "0%" }}
                    whileInView={{ width: `${p.value}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.8, ease: EASE, delay: idx * 0.15 }}
                  />
                </div>
              </div>
            ))}
          </div>
          <Reveal delay={0.3}>
            <Link to="/about" className="mt-12 inline-flex items-center gap-2 text-sm font-semibold text-primary">
              More about JAK <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Divisions */}
      <section className="mx-auto max-w-[1440px] px-5 pb-28 md:px-10">
        <SectionLabel index="04">Our divisions</SectionLabel>
        <SplitText as="h2" text="Three ways we power cleaner industry" className="mt-6 block max-w-4xl text-4xl font-semibold leading-[1] md:text-6xl" />
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {DIVISIONS.map((d, idx) => (
            <Reveal key={d.title} delay={idx * 0.12}>
              <Link to={d.to} className="block">
                <TiltCard className="group relative aspect-[3/4] overflow-hidden rounded-3xl border border-border" max={10}>
                  <img src={d.image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.6s] group-hover:scale-110" />
                  <div className="absolute inset-0 bg-fade-b" />
                  <div className="absolute inset-x-0 bottom-0 p-7" style={{ transform: "translateZ(50px)" }}>
                    <d.icon className="mb-5 h-8 w-8 text-primary" />
                    <h3 className="text-2xl font-semibold">{d.title}</h3>
                    <p className="mt-3 text-sm text-muted-foreground">{d.body}</p>
                  </div>
                </TiltCard>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Recognition */}
      <section className="border-y border-border bg-card py-28">
        <div className="mx-auto grid max-w-[1440px] items-center gap-14 px-5 md:grid-cols-2 md:px-10">
          <div>
            <SectionLabel index="05">Recognition</SectionLabel>
            <SplitText as="h2" text="Trusted by the names that build the world's turbines" className="mt-6 block text-4xl font-semibold leading-[1.02] md:text-5xl" />
            <Reveal delay={0.2}>
              <p className="mt-6 text-muted-foreground">
                From a Vestas certificate of appreciation for keeping supply flowing through the pandemic, to a Gamesa
                Best Service Award — our partners notice the difference.
              </p>
            </Reveal>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <TiltCard className="overflow-hidden rounded-2xl border border-border shadow-deep" max={14}>
              <img src="/jak/about/a1.jpg" alt="Vestas certificate of appreciation for JAK Industries" loading="lazy" className="w-full" />
            </TiltCard>
            <TiltCard className="mt-12 overflow-hidden rounded-2xl border border-border shadow-deep" max={14}>
              <img src="/jak/about/ab8.jpg" alt="Gamesa Best Service Award trophy" loading="lazy" className="w-full" />
            </TiltCard>
          </div>
        </div>
      </section>

      {/* Clients */}
      <section className="py-28">
        <div className="mx-auto mb-14 flex max-w-[1440px] flex-col justify-between gap-6 px-5 md:flex-row md:items-end md:px-10">
          <div>
            <SectionLabel index="06">Our customers</SectionLabel>
            <SplitText as="h2" text="In good company" className="mt-6 block text-4xl font-semibold md:text-6xl" />
          </div>
          <Link to="/customers" className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
            See all customers <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="space-y-4">
          <ClientMarquee />
          <ClientMarquee reverse />
        </div>
      </section>

      <CTA />
    </>
  );
}
