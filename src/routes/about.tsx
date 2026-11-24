import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Compass, Eye, Gem, Target } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Counter, Reveal, SectionLabel, SplitText, TiltCard, WipeImage } from "@/components/site/motion";
import { CTA, ScrollHighlight, TextMarquee } from "@/components/site/sections";
import { QUALITY_OBJECTIVES, TEAM, UNITS, VALUES } from "@/lib/site-data";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About JAK Industries | Heavy Fabrication Since 2004" },
      {
        name: "description",
        content: "The story, mission, values, four manufacturing units and leadership team behind JAK Industries, Chennai.",
      },
      { property: "og:title", content: "About JAK Industries" },
      { property: "og:description", content: "22 years of heavy fabrication for wind energy and pollution control." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://jakindustries.net/about" },
      { property: "og:image", content: "https://jakindustries.net/og-image.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:image", content: "https://jakindustries.net/og-image.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://jakindustries.net/about" }],
  }),
  component: About,
});

const EASE = [0.16, 1, 0.3, 1] as const;

function About() {
  return (
    <>
      <PageHero
        eyebrow="About us · Since 2004"
        title="Built from a single shop floor"
        intro="JAK Industries began in 2004 as a small fabrication unit and grew into a key supplier of critical components to major wind firms and pollution control consultants in India."
        image={"/jak/slides/s3.jpg"}
      />

      <section className="mx-auto grid max-w-[1440px] gap-16 px-5 py-28 md:grid-cols-12 md:px-10 md:py-36">
        <div className="md:col-span-7">
          <SectionLabel index="01">Our story</SectionLabel>
          <ScrollHighlight
            className="mt-10 font-display text-3xl font-medium leading-[1.2] tracking-tight md:text-4xl"
            text="We fabricate, machine and assemble heavy structures, sheet metal, pollution control equipment, piping and tanks, then erect, commission and test them on site."
          />
          <Reveal delay={0.1}>
            <p className="mt-10 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Led by professionals with 40 years of expertise in heavy structural fabrication, we work in carbon steel,
              stainless steel and aluminium. Our motto, “Strive for customer delight”, has earned us a reputation for
              delivering the right quality inside the agreed time frame.
            </p>
          </Reveal>
        </div>
        <div className="md:col-span-5">
          <WipeImage src="/jak/about/ab4.jpg" alt="JAK team with visiting partners on the shop floor" className="aspect-[4/3] rounded-3xl" />
          <WipeImage src="/jak/about/abou.jpg" alt="Wind turbines" className="mt-6 ml-auto aspect-[4/3] w-3/4 rounded-3xl" />
        </div>
      </section>

      {/* Mission / Vision / Policy */}
      <section className="mx-auto max-w-[1440px] px-5 pb-28 md:px-10">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: Target, title: "Mission", body: "To exceed customer expectations in quality, delivery and cost through continual improvement and close customer interaction, and to be the preferred choice across India." },
            { icon: Eye, title: "Vision", body: "To be the most successful, leading fabrication company in India." },
            { icon: Compass, title: "Quality policy", body: "We satisfy customers by supplying quality products at the right time, through continual improvement and the involvement of every employee." },
          ].map((c, i) => (
            <Reveal key={c.title} delay={i * 0.12}>
              <TiltCard className="h-full rounded-3xl border border-border bg-card bg-card-sheen p-8" max={8}>
                <div style={{ transform: "translateZ(40px)" }}>
                  <c.icon className="h-8 w-8 text-primary" />
                  <h3 className="mt-8 text-2xl font-semibold">{c.title}</h3>
                  <p className="mt-4 leading-relaxed text-muted-foreground">{c.body}</p>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
        <div className="mt-6 grid grid-cols-2 gap-6 md:grid-cols-4">
          {QUALITY_OBJECTIVES.map((q, i) => (
            <Reveal key={q} delay={i * 0.08}>
              <div className="rounded-2xl border border-border p-6">
                <div className="font-mono text-xs text-primary">0{i + 1}</div>
                <div className="mt-3 font-display text-lg font-medium">{q}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <TextMarquee items={VALUES} />

      {/* Values grid */}
      <section className="mx-auto max-w-[1440px] px-5 py-28 md:px-10">
        <SectionLabel index="02">Values</SectionLabel>
        <SplitText as="h2" text="What every weld stands for" className="mt-6 block text-4xl font-semibold md:text-6xl" />
        <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-border bg-border md:grid-cols-5">
          {VALUES.map((v, i) => (
            <motion.div
              key={v}
              className="group relative bg-background p-6 transition-colors duration-500 hover:bg-primary"
              initial={{ opacity: 0, rotateY: -90 }}
              whileInView={{ opacity: 1, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: EASE, delay: i * 0.05 }}
            >
              <Gem className="h-5 w-5 text-primary transition-colors group-hover:text-primary-foreground" />
              <div className="mt-10 font-display text-base font-medium transition-colors group-hover:text-primary-foreground">{v}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Units */}
      <section className="border-y border-border bg-card py-28">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <SectionLabel index="03">Infrastructure</SectionLabel>
          <SplitText as="h2" text="Four units, one standard" className="mt-6 block text-4xl font-semibold md:text-6xl" />
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {UNITS.map((u, i) => (
              <Reveal key={u.name} delay={i * 0.1}>
                <TiltCard className="h-full rounded-3xl border border-border bg-background p-7" max={10}>
                  <div style={{ transform: "translateZ(30px)" }}>
                    <div className="eyebrow">{u.name}</div>
                    <div className="mt-6 grid grid-cols-2 gap-4">
                      <div>
                        <div className="font-display text-2xl font-semibold"><Counter to={Number(u.open.replace(",", ""))} /></div>
                        <div className="text-xs text-muted-foreground">sq.ft open</div>
                      </div>
                      <div>
                        <div className="font-display text-2xl font-semibold"><Counter to={Number(u.covered.replace(",", ""))} /></div>
                        <div className="text-xs text-muted-foreground">sq.ft covered</div>
                      </div>
                    </div>
                    <div className="mt-6 space-y-1 border-t border-border pt-5 text-sm text-muted-foreground">
                      <div>{u.power}</div>
                      <div>{u.genset}</div>
                    </div>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="mx-auto max-w-[1440px] px-5 py-28 md:px-10">
        <SectionLabel index="04">Our team</SectionLabel>
        <SplitText as="h2" text="The people behind the steel" className="mt-6 block text-4xl font-semibold md:text-6xl" />
        <div className="mt-14 grid grid-cols-2 gap-6 lg:grid-cols-4">
          {TEAM.map((m, i) => (
            <Reveal key={m.name} delay={i * 0.1}>
              <TiltCard className="group overflow-hidden rounded-3xl border border-border bg-card" max={12}>
                <div className="aspect-[4/5] overflow-hidden">
                  <img src={m.photo} alt={m.name} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                </div>
                <div className="p-5" style={{ transform: "translateZ(30px)" }}>
                  <div className="font-display text-lg font-semibold">{m.name}</div>
                  <div className="text-sm text-primary">{m.role}</div>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      <CTA title="22 years in. Just getting started." kicker="Work with us" />
    </>
  );
}
