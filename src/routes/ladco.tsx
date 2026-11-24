import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import galvanizing from "@/assets/galvanizing.jpg";
import { PageHero } from "@/components/site/PageHero";
import { Reveal, SectionLabel, SplitText, TiltCard, WipeImage } from "@/components/site/motion";
import { CTA } from "@/components/site/sections";
import { Lightbox } from "@/components/site/Lightbox";
import { useContent } from "@/lib/content";

export const Route = createFileRoute("/ladco")({
  head: () => ({
    meta: [
      { title: "LADCO Galvanizers | Hot-Dip Galvanizing | JAK Industries" },
      {
        name: "description",
        content: "LADCO Galvanizers Pvt. Ltd.: one-stop hot-dip galvanizing with an 8.6 m × 1.0 m × 1.6 m zinc bath and in-house effluent treatment.",
      },
      { property: "og:title", content: "LADCO Galvanizers | Hot-Dip Galvanizing" },
      { property: "og:description", content: "One-stop hot-dip galvanizing with an 8.6 m zinc bath." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://jakindustries.net/ladco" },
      { property: "og:image", content: "https://jakindustries.net/og-image.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:image", content: "https://jakindustries.net/og-image.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://jakindustries.net/ladco" }],
  }),
  component: Ladco,
});

const DIMS = [
  { k: "L", v: "8.6", label: "Length (m)" },
  { k: "W", v: "1.0", label: "Width (m)" },
  { k: "D", v: "1.6", label: "Depth (m)" },
];

function ZincBath() {
  // CSS 3D box that assembles itself as it enters view
  const faces = [
    { cls: "w-[340px] h-[64px]", t: "translateZ(40px)" },
    { cls: "w-[340px] h-[64px]", t: "rotateY(180deg) translateZ(40px)" },
    { cls: "w-[80px] h-[64px] left-[130px]", t: "rotateY(90deg) translateZ(170px)" },
    { cls: "w-[80px] h-[64px] left-[130px]", t: "rotateY(-90deg) translateZ(170px)" },
    { cls: "w-[340px] h-[80px] top-[-8px]", t: "rotateX(90deg) translateZ(40px)", top: true },
  ];
  return (
    <div className="perspective-1200 flex h-72 items-center justify-center">
      <motion.div
        className="relative h-[64px] w-[340px] preserve-3d"
        initial={{ rotateX: -10, rotateY: -200, scale: 0.4 }}
        whileInView={{ rotateX: -28, rotateY: -32, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
      >
        {faces.map((f, i) => (
          <div
            key={i}
            className={`absolute ${f.cls} border border-primary/50 ${f.top ? "bg-spark/50 shadow-heat" : "bg-steel/30"}`}
            style={{ transform: f.t }}
          />
        ))}
      </motion.div>
    </div>
  );
}

function Ladco() {
  const { ladcoCerts } = useContent();
  const [open, setOpen] = useState<number | null>(null);
  const items = ladcoCerts.map((c) => ({ src: c.image, caption: `${c.code}: ${c.title}` }));
  return (
    <>
      <PageHero
        eyebrow="LADCO Galvanizers Pvt. Ltd."
        title="One-stop solution for hot-dip galvanizing"
        intro="Our sister company protects steel for a lifetime, dipping fabricated structures in molten zinc, with a treatment plant that keeps the process clean."
        image={galvanizing}
      >
        <motion.img
          src="/jak/logo-ladco-white.png"
          alt="LADCO logo"
          className="mt-10 h-16 w-auto invert dark:invert-0"
          initial={{ opacity: 0, rotateY: 90 }}
          animate={{ opacity: 1, rotateY: 0 }}
          transition={{ duration: 1.2, delay: 1.2 }}
        />
      </PageHero>

      <section className="mx-auto grid max-w-[1440px] items-center gap-16 px-5 py-28 md:grid-cols-2 md:px-10">
        <div>
          <SectionLabel index="01">Zinc bath</SectionLabel>
          <SplitText as="h2" text="Big enough for tower-scale steel" className="mt-6 block text-4xl font-semibold leading-[1.02] md:text-6xl" />
          <div className="mt-12 grid grid-cols-3 gap-4">
            {DIMS.map((d, i) => (
              <Reveal key={d.k} delay={i * 0.12}>
                <div className="rounded-2xl border border-border bg-card p-5">
                  <div className="font-mono text-xs text-primary">{d.k}</div>
                  <div className="mt-2 font-display text-4xl font-semibold">{d.v}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{d.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
        <ZincBath />
      </section>

      <section className="mx-auto max-w-[1440px] px-5 pb-28 md:px-10">
        <div className="grid gap-6 md:grid-cols-5">
          <WipeImage src="/jak/ladco/lol.jpg" alt="LADCO galvanizing factory interior" className="aspect-[4/3] rounded-3xl md:col-span-2" />
          <div className="md:col-span-3">
            <SectionLabel index="02">Factory & effluent treatment plant</SectionLabel>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-xl text-muted-foreground">
                A purpose-built facility with its own effluent treatment plant, so galvanizing never comes at the
                environment's expense.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <img src="/jak/ladco/etp-animation.svg" alt="LADCO effluent treatment plant: process flow from raw effluent inlet to RO permeate tank and solar evaporation pond" loading="lazy" width={1400} height={640} className="mt-8 w-full rounded-3xl border border-border" />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-card py-28">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <SectionLabel index="03">LADCO certificates</SectionLabel>
          <SplitText as="h2" text="Certified, end to end" className="mt-6 block text-4xl font-semibold md:text-6xl" />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {ladcoCerts.map((c, i) => (
              <Reveal key={c.code} delay={i * 0.1}>
                <motion.button layoutId={`ladco-${i}`} type="button" onClick={() => setOpen(i)} className="block w-full text-left">
                  <TiltCard className="overflow-hidden rounded-2xl border border-border bg-paper" max={12}>
                    <img src={c.image} alt={c.title} loading="lazy" className="aspect-[3/4] w-full object-cover object-top" />
                  </TiltCard>
                  <div className="mt-4 font-display text-lg font-semibold">{c.code}</div>
                  <div className="text-sm text-muted-foreground">{c.title}</div>
                </motion.button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <Lightbox items={items} index={open} onChange={setOpen} group="ladco" />
      <CTA title="Fabricate and galvanize, one order." kicker="One-stop HDG" />
    </>
  );
}
