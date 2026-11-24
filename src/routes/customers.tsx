import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { PageHero } from "@/components/site/PageHero";
import { SectionLabel, SplitText, TiltCard } from "@/components/site/motion";
import { ClientMarquee, CTA } from "@/components/site/sections";
import { useContent } from "@/lib/content";

export const Route = createFileRoute("/customers")({
  head: () => ({
    meta: [
      { title: "Customers | Vestas, Vayona, Nordex & more | JAK Industries" },
      {
        name: "description",
        content: "JAK Industries supplies Vestas, Vayona Energy, Nordex, Enercon, TPI Composites, Wheels India, CUMI and other industry leaders.",
      },
      { property: "og:title", content: "JAK Industries Customers" },
      { property: "og:description", content: "The wind and industrial leaders who rely on JAK Industries." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://jakindustries.net/customers" },
      { property: "og:image", content: "https://jakindustries.net/og-image.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:image", content: "https://jakindustries.net/og-image.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://jakindustries.net/customers" }],
  }),
  component: Customers,
});

function Customers() {
  const { clients } = useContent();
  return (
    <>
      <PageHero
        eyebrow="Customers"
        title="The leaders who build with us"
        intro="From global turbine makers to India's industrial champions: seventeen partners who trust JAK with critical parts."
        image={"/jak/slides/s3.jpg"}
      />
      <section className="mx-auto max-w-[1440px] px-5 py-28 md:px-10">
        <SectionLabel index="01">Our customers</SectionLabel>
        <SplitText as="h2" text="Seventeen partners and counting" className="mt-6 block text-4xl font-semibold md:text-6xl" />
        <div className="mt-14 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
          {clients.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, rotateX: -70, y: 60 }}
              whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
              viewport={{ once: true, margin: "-5% 0px" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: (i % 5) * 0.08 }}
              style={{ transformPerspective: 1000 }}
            >
              <TiltCard className="group overflow-hidden rounded-2xl border border-border bg-paper" max={16}>
                <img src={c.logo} alt={c.name} loading="lazy" className="aspect-[23/15] w-full object-cover transition duration-500 group-hover:scale-105" />
              </TiltCard>
              <div className="mt-3 text-sm text-muted-foreground">{c.name}</div>
            </motion.div>
          ))}
        </div>
      </section>
      <section className="space-y-4 pb-16">
        <ClientMarquee />
        <ClientMarquee reverse />
      </section>
      <CTA title="Join the companies that build with JAK." kicker="Become a customer" />
    </>
  );
}
