import { useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { HeartHandshake } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Reveal, SectionLabel, SplitText } from "@/components/site/motion";
import { CTA, ScrollHighlight } from "@/components/site/sections";
import { Lightbox } from "@/components/site/Lightbox";
import { CSR_ACTIVITIES, CSR_GALLERY } from "@/lib/site-data";

export const Route = createFileRoute("/csr")({
  head: () => ({
    meta: [
      { title: "Corporate Social Responsibility | JAK Industries" },
      {
        name: "description",
        content: "JAK Industries' CSR: educational support, hunger eradication, health support, COVID relief and community development across Tamil Nadu.",
      },
      { property: "og:title", content: "CSR at JAK Industries" },
      { property: "og:description", content: "Education, food and health support for the communities around us." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://jakindustries.net/csr" },
      { property: "og:image", content: "https://jakindustries.net/og-image.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:image", content: "https://jakindustries.net/og-image.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://jakindustries.net/csr" }],
  }),
  component: CSR,
});

function Column({ items, offset, y, onOpen }: { items: Array<{ src: string; caption: string; i: number }>; offset: number; y: MotionValue<string>; onOpen: (i: number) => void }) {
  return (
    <motion.div style={{ y }} className="flex flex-col gap-5" data-offset={offset}>
      {items.map((it) => (
        <motion.button
          key={it.src}
          type="button"
          layoutId={`csr-${it.i}`}
          onClick={() => onOpen(it.i)}
          className="group relative overflow-hidden rounded-2xl border border-border bg-paper text-left"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-5% 0px" }}
          transition={{ duration: 0.8 }}
        >
          <img src={it.src} alt={it.caption} loading="lazy" className="w-full transition-transform duration-700 group-hover:scale-105" />
          <span className="absolute inset-x-0 bottom-0 translate-y-full bg-card/95 px-4 py-3 text-xs font-medium text-foreground transition-transform duration-500 group-hover:translate-y-0">
            {it.caption}
          </span>
        </motion.button>
      ))}
    </motion.div>
  );
}

function CSR() {
  const [open, setOpen] = useState<number | null>(null);
  const gallery = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: gallery, offset: ["start end", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const y3 = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"]);
  const indexed = CSR_GALLERY.map((g, i) => ({ ...g, i }));
  const cols = [0, 1, 2].map((c) => indexed.filter((_, i) => i % 3 === c));
  const ys = [y1, y2, y3];

  return (
    <>
      <PageHero
        eyebrow="Corporate social responsibility"
        title="Growth that lifts everyone"
        intro="We see CSR as our commitment to inclusive, sustainable growth, and wind power itself as part of being a responsible corporate citizen."
        image={"/jak/slides/slide-1.jpg"}
      />

      <section className="mx-auto max-w-[1440px] px-5 py-28 md:px-10">
        <SectionLabel index="01">Our commitment</SectionLabel>
        <ScrollHighlight
          className="mt-10 max-w-5xl font-display text-3xl font-medium leading-[1.2] tracking-tight md:text-5xl"
          text="Books for students, meals for the hungry, care for the elderly and relief when crisis hits. This is how we give back to the communities that build with us."
        />
      </section>

      <section className="mx-auto max-w-[1440px] px-5 pb-28 md:px-10">
        <SectionLabel index="02">Our CSR activities</SectionLabel>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {CSR_ACTIVITIES.map((a, i) => (
            <Reveal key={a} delay={(i % 3) * 0.1}>
              <div className="group h-full rounded-2xl border border-border bg-card p-6 transition-colors duration-500 hover:border-primary/60">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-primary">{String(i + 1).padStart(2, "0")}</span>
                  <HeartHandshake className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
                </div>
                <p className="mt-6 leading-relaxed">{a}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section ref={gallery} className="mx-auto max-w-[1440px] overflow-hidden px-5 pb-28 md:px-10">
        <SectionLabel index="03">In action</SectionLabel>
        <SplitText as="h2" text={`${CSR_GALLERY.length} projects, one community`} className="mt-6 block text-4xl font-semibold md:text-6xl" />
        <div className="mt-14 hidden grid-cols-3 gap-5 md:grid">
          {cols.map((items, c) => (
            <Column key={c} items={items} offset={c} y={ys[c] ?? y1} onOpen={setOpen} />
          ))}
        </div>
        <div className="mt-10 grid grid-cols-2 gap-4 md:hidden">
          {indexed.map((it) => (
            <button key={it.src} type="button" onClick={() => setOpen(it.i)} className="overflow-hidden rounded-xl border border-border bg-paper">
              <img src={it.src} alt={it.caption} loading="lazy" className="w-full" />
            </button>
          ))}
        </div>
      </section>

      <Lightbox items={CSR_GALLERY} index={open} onChange={setOpen} group="csr" />
      <CTA title="Partner with a company that gives back." kicker="Together" />
    </>
  );
}
