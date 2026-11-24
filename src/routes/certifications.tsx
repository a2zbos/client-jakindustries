import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { FileCheck2 } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Reveal, SectionLabel, SplitText } from "@/components/site/motion";
import { CTA } from "@/components/site/sections";
import { Lightbox } from "@/components/site/Lightbox";
import { ISO_CERTS, LADCO_CERTS, WPS } from "@/lib/site-data";

export const Route = createFileRoute("/certifications")({
  head: () => ({
    meta: [
      { title: "Certifications | ISO 9001, 14001, 45001, 3834-2 | JAK Industries" },
      {
        name: "description",
        content: "JAK Industries holds ISO 9001:2015, ISO 14001:2015, ISO 45001:2018 and ISO 3834-2:2021 welding certification plus 10 qualified welding procedure specifications.",
      },
      { property: "og:title", content: "JAK Industries Certifications" },
      { property: "og:description", content: "ISO 9001, 14001, 45001 and 3834-2 certified with 10 qualified WPS." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://jakindustries.net/certifications" },
      { property: "og:image", content: "https://jakindustries.net/og-image.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:image", content: "https://jakindustries.net/og-image.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://jakindustries.net/certifications" }],
  }),
  component: Certifications,
});

/** Certificate card that flips in 3D on hover to reveal its details. */
function FlipCert({ code, title, image, onOpen, layoutId }: { code: string; title: string; image: string; onOpen: () => void; layoutId: string }) {
  return (
    <button type="button" onClick={onOpen} className="group block w-full perspective-1200 text-left" aria-label={`View ${code} certificate`}>
      <motion.div layoutId={layoutId} className="relative aspect-[3/4] w-full preserve-3d transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:[transform:rotateY(180deg)]">
        <div className="absolute inset-0 overflow-hidden rounded-2xl border border-border bg-paper [backface-visibility:hidden]">
          <img src={image} alt={`${code} certificate`} loading="lazy" className="h-full w-full object-cover object-top" />
        </div>
        <div className="absolute inset-0 flex flex-col justify-between rounded-2xl border border-primary/40 bg-card p-7 shadow-glow [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <FileCheck2 className="h-9 w-9 text-primary" />
          <div>
            <div className="font-display text-3xl font-semibold">{code}</div>
            <div className="mt-2 text-muted-foreground">{title}</div>
            <div className="mt-6 font-mono text-xs text-primary">CLICK TO VIEW →</div>
          </div>
        </div>
      </motion.div>
    </button>
  );
}

function Certifications() {
  const [isoOpen, setIsoOpen] = useState<number | null>(null);
  const [ladcoOpen, setLadcoOpen] = useState<number | null>(null);
  return (
    <>
      <PageHero
        eyebrow="Certifications"
        title="Quality you can audit"
        intro="Independently certified for quality, environment, occupational health & safety and welding quality, with qualified welding procedures for every critical joint."
        image={"/jak/slides/slide-1.jpg"}
      />

      <section className="mx-auto max-w-[1440px] px-5 py-28 md:px-10">
        <SectionLabel index="01">ISO certificates</SectionLabel>
        <SplitText as="h2" text="Certified by KVQA and Intertek" className="mt-6 block text-4xl font-semibold md:text-6xl" />
        <p className="mt-4 text-sm text-muted-foreground">Hover to flip · click to open</p>
        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {ISO_CERTS.map((c, i) => (
            <Reveal key={c.code} delay={i * 0.12}>
              <FlipCert {...c} layoutId={`iso-${i}`} onOpen={() => setIsoOpen(i)} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-card py-28">
        <div className="mx-auto grid max-w-[1440px] gap-14 px-5 md:grid-cols-12 md:px-10">
          <div className="md:col-span-4">
            <SectionLabel index="02">Welding procedures</SectionLabel>
            <SplitText as="h2" text="10 qualified WPS" className="mt-6 block text-4xl font-semibold md:text-6xl" />
            <Reveal delay={0.1}>
              <p className="mt-6 text-muted-foreground">GMAW and SMAW procedures for plate, pipe, butt, tee and fillet joints.</p>
            </Reveal>
          </div>
          <ol className="grid gap-3 md:col-span-8 md:grid-cols-2">
            {WPS.map((w, i) => (
              <motion.li
                key={w}
                initial={{ opacity: 0, rotateX: -80, y: 30 }}
                whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: i * 0.05 }}
                style={{ transformPerspective: 800 }}
                className="flex items-center gap-5 rounded-2xl border border-border bg-background p-5"
              >
                <span className="font-mono text-sm text-primary">WPS-{String(i + 1).padStart(2, "0")}</span>
                <span className="text-sm">{w}</span>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-28 md:px-10">
        <SectionLabel index="03">LADCO certificates</SectionLabel>
        <SplitText as="h2" text="Our galvanizing arm, certified too" className="mt-6 block text-4xl font-semibold md:text-6xl" />
        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {LADCO_CERTS.map((c, i) => (
            <Reveal key={c.code} delay={i * 0.12}>
              <FlipCert {...c} layoutId={`ladcocert-${i}`} onOpen={() => setLadcoOpen(i)} />
            </Reveal>
          ))}
        </div>
      </section>

      <Lightbox items={ISO_CERTS.map((c) => ({ src: c.image, caption: `${c.code}: ${c.title}` }))} index={isoOpen} onChange={setIsoOpen} group="iso" />
      <Lightbox items={LADCO_CERTS.map((c) => ({ src: c.image, caption: `${c.code}: ${c.title}` }))} index={ladcoOpen} onChange={setLadcoOpen} group="ladcocert" />
      <CTA title="Certified quality, on every order." kicker="Audit-ready" />
    </>
  );
}
