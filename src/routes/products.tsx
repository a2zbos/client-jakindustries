import { useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { GearCanvas } from "@/components/site/Scenes";
import { Reveal, SectionLabel, SplitText } from "@/components/site/motion";
import { CTA } from "@/components/site/sections";
import { POLLUTION_PRODUCTS, PRODUCT_PHOTOS, WIND_PRODUCTS } from "@/lib/site-data";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Products | Wind Turbine Components & Pollution Control | JAK" },
      {
        name: "description",
        content: "Gear stay assemblies, nacelle parts, tower saddles, transport frames, clarifiers up to 40 m, thickeners, aerators and filters by JAK Industries.",
      },
      { property: "og:title", content: "JAK Industries Products" },
      { property: "og:description", content: "Wind turbine components and pollution control equipment." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://jakindustries.net/products" },
      { property: "og:image", content: "https://jakindustries.net/og-image.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:image", content: "https://jakindustries.net/og-image.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://jakindustries.net/products" }],
  }),
  component: Products,
});

const EASE = [0.16, 1, 0.3, 1] as const;

function ProductList({ items, image, label }: { items: string[]; image: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 22 });
  const sy = useSpring(y, { stiffness: 200, damping: 22 });
  const rotate = useSpring(0, { stiffness: 120, damping: 14 });
  return (
    <div
      ref={ref}
      className="relative"
      onPointerMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        const nx = e.clientX - r.left;
        rotate.set((nx - x.get()) * 0.4);
        x.set(nx);
        y.set(e.clientY - r.top);
      }}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <AnimatePresence>
        {hover && (
          <motion.div
            className="pointer-events-none absolute left-0 top-0 z-20 hidden h-56 w-72 overflow-hidden rounded-2xl border border-border shadow-deep md:block"
            style={{ x: sx, y: sy, rotate, translateX: "-50%", translateY: "-110%" }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.35 }}
          >
            <img src={image} alt="" className="h-full w-full object-cover" />
            <div className="absolute bottom-3 left-3 rounded-full bg-background/80 px-3 py-1 font-mono text-[10px] text-primary">{label}</div>
          </motion.div>
        )}
      </AnimatePresence>
      <ul className="border-t border-border">
        {items.map((p, i) => (
          <motion.li
            key={p}
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-5% 0px" }}
            transition={{ duration: 0.9, ease: EASE, delay: i * 0.04 }}
            className="group relative overflow-hidden border-b border-border"
          >
            <span className="absolute inset-0 origin-bottom scale-y-0 bg-primary transition-transform duration-500 ease-out group-hover:scale-y-100" />
            <div className="relative flex items-center justify-between gap-6 px-2 py-6 md:py-7">
              <div className="flex items-baseline gap-6">
                <span className="font-mono text-xs text-muted-foreground transition-colors group-hover:text-primary-foreground">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-display text-xl font-medium tracking-tight transition-all duration-500 group-hover:translate-x-3 group-hover:text-primary-foreground md:text-3xl">{p}</span>
              </div>
              <ArrowUpRight className="h-6 w-6 shrink-0 text-muted-foreground transition-all duration-500 group-hover:rotate-45 group-hover:text-primary-foreground" />
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

function Products() {
  return (
    <>
      <section className="relative overflow-hidden pt-20">
        <div className="absolute inset-0 grid-lines opacity-30" />
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative mx-auto grid min-h-[86vh] max-w-[1440px] items-center gap-6 px-5 md:grid-cols-2 md:px-10">
          <div>
            <motion.div className="eyebrow mb-6" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6, duration: 1 }}>
              Products
            </motion.div>
            <SplitText as="h1" animateOnMount delay={0.5} text="Precision parts for power and planet" className="block text-5xl font-semibold leading-[0.95] md:text-7xl" />
            <motion.p className="mt-8 max-w-lg text-lg text-muted-foreground" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 1 }}>
              Two product families, one standard of fabrication. Move your cursor over the gears, then scroll to explore
              the line-up.
            </motion.p>
          </div>
          <GearCanvas className="h-[50vh] w-full md:h-[70vh]" />
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-24 md:px-10">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <SectionLabel index="01">Manufacturer of</SectionLabel>
            <SplitText as="h2" text="Wind mill components" className="mt-6 block text-4xl font-semibold md:text-6xl" />
          </div>
          <Reveal><p className="max-w-sm text-muted-foreground">Fabricated and machined parts for nacelles, rotors and towers, supplied to leading global turbine makers.</p></Reveal>
        </div>
        <ProductList items={WIND_PRODUCTS} image="/jak/products/pro1.png" label="WIND" />
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-24 md:px-10">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <SectionLabel index="02">Manufacturer of</SectionLabel>
            <SplitText as="h2" text="Pollution control equipment" className="mt-6 block text-4xl font-semibold md:text-6xl" />
          </div>
          <Reveal><p className="max-w-sm text-muted-foreground">Water and effluent treatment systems, including reactivated clarifiers up to 40 metres in diameter.</p></Reveal>
        </div>
        <ProductList items={POLLUTION_PRODUCTS} image="/jak/products/pro5.png" label="POLLUTION CONTROL" />
      </section>

      <section className="mx-auto max-w-[1440px] px-5 pb-24 md:px-10">
        <SectionLabel index="03">From our shop floor</SectionLabel>
        <SplitText as="h2" text="Real parts, built in Chennai" className="mt-6 block text-4xl font-semibold md:text-6xl" />
        <div className="mt-12 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
          {PRODUCT_PHOTOS.map((p, i) => (
            <Reveal key={p.src} delay={(i % 4) * 0.08}>
              <figure className="group overflow-hidden rounded-2xl border border-border bg-card">
                <div className="overflow-hidden bg-paper">
                  <img src={p.src} alt={p.caption} loading="lazy" width={294} height={202} className="aspect-[294/202] w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <figcaption className="px-4 py-3 text-sm text-muted-foreground">{p.caption}</figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="relative mx-5 overflow-hidden rounded-[2rem] md:mx-10">
        <img src="/jak/slides/slide-2.jpg" alt="" loading="lazy" className="h-[60vh] w-full object-cover" />
        <div className="absolute inset-0 bg-background/60" />
        <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
          <SplitText as="h2" text="Built to drawing. Delivered on time." className="block max-w-4xl text-4xl font-semibold md:text-6xl" />
        </div>
      </section>

      <CTA title="Have a drawing? We'll quote it." kicker="Custom fabrication" />
    </>
  );
}
