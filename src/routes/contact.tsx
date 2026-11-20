import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import windfarm from "@/assets/windfarm.jpg";
import { PageHero } from "@/components/site/PageHero";
import { Magnetic, Reveal, SectionLabel, SplitText } from "@/components/site/motion";
import { CONTACT, UNITS } from "@/lib/site-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact JAK Industries — Chennai Units & Quote Request" },
      {
        name: "description",
        content: "Call +91 72999 87393 or email jakindustries2007@yahoo.com. Visit our four units in Thirumullaivoyal, Kakkalur, Gummidipoondi and Kattur.",
      },
      { property: "og:title", content: "Contact JAK Industries" },
      { property: "og:description", content: "Request a quote or visit one of our four units around Chennai." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Contact,
});

function Field({ label, name, type = "text", textarea = false, required = false }: { label: string; name: string; type?: string; textarea?: boolean; required?: boolean }) {
  const cls = "peer w-full border-b border-border bg-transparent pb-3 pt-6 text-foreground outline-none transition-colors placeholder-transparent focus:border-primary";
  return (
    <label className="relative block">
      {textarea ? (
        <textarea name={name} rows={4} placeholder={label} required={required} className={cn(cls, "resize-none")} />
      ) : (
        <input name={name} type={type} placeholder={label} required={required} className={cls} />
      )}
      <span className="pointer-events-none absolute left-0 top-0 text-xs text-muted-foreground transition-all peer-placeholder-shown:top-6 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-xs peer-focus:text-primary">
        {label}
      </span>
    </label>
  );
}

function Contact() {
  const [unit, setUnit] = useState(0);
  const active = UNITS[unit] ?? UNITS[0]!;
  return (
    <>
      <PageHero eyebrow="Contact" title="Let's talk steel" intro="Tell us what you need fabricated — we'll come back with a quote." image={windfarm} />

      <section className="mx-auto grid max-w-[1440px] gap-16 px-5 py-28 md:grid-cols-2 md:px-10">
        <div>
          <SectionLabel index="01">Get a quote</SectionLabel>
          <SplitText as="h2" text="Send us your requirement" className="mt-6 block text-4xl font-semibold md:text-5xl" />
          <form
            className="mt-12 space-y-8"
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              const subject = encodeURIComponent(`Quote request from ${String(f.get("name") ?? "")}`);
              const body = encodeURIComponent(
                `Name: ${String(f.get("name") ?? "")}\nCompany: ${String(f.get("company") ?? "")}\nPhone: ${String(f.get("phone") ?? "")}\nEmail: ${String(f.get("email") ?? "")}\n\n${String(f.get("message") ?? "")}`,
              );
              window.location.href = `mailto:${CONTACT.email}?subject=${subject}&body=${body}`;
            }}
          >
            <div className="grid gap-8 sm:grid-cols-2">
              <Field label="Your name" name="name" required />
              <Field label="Company" name="company" />
              <Field label="Phone" name="phone" type="tel" />
              <Field label="Email" name="email" type="email" required />
            </div>
            <Field label="What do you need fabricated?" name="message" textarea required />
            <Magnetic>
              <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 font-semibold text-primary-foreground shadow-glow">
                Send request <ArrowUpRight className="h-4 w-4" />
              </button>
            </Magnetic>
            <p className="text-xs text-muted-foreground">Opens your email app with the details filled in.</p>
          </form>
        </div>

        <div className="space-y-5">
          <Reveal>
            <div className="rounded-3xl border border-border bg-card p-8">
              <div className="eyebrow">Registered office</div>
              <p className="mt-5 flex gap-3 text-lg">
                <MapPin className="mt-1 h-5 w-5 shrink-0 text-primary" />
                <span>{CONTACT.office.map((l) => <span key={l} className="block">{l}</span>)}</span>
              </p>
            </div>
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2">
            <Reveal delay={0.1}>
              <a href={CONTACT.phoneMobileHref} className="group block rounded-3xl border border-border bg-card p-8 transition-colors hover:border-primary">
                <Phone className="h-6 w-6 text-primary" />
                <div className="mt-6 font-display text-xl font-semibold">{CONTACT.phoneMobile}</div>
                <div className="mt-1 text-sm text-muted-foreground">Office {CONTACT.phoneOffice}</div>
              </a>
            </Reveal>
            <Reveal delay={0.2}>
              <a href={`mailto:${CONTACT.email}`} className="group block rounded-3xl border border-border bg-card p-8 transition-colors hover:border-primary">
                <Mail className="h-6 w-6 text-primary" />
                <div className="mt-6 break-all font-display text-base font-semibold">{CONTACT.email}</div>
                <div className="mt-1 text-sm text-muted-foreground">We reply within a working day</div>
              </a>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-card py-28">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <SectionLabel index="02">Our units</SectionLabel>
          <SplitText as="h2" text="Find us on the map" className="mt-6 block text-4xl font-semibold md:text-6xl" />
          <div className="mt-12 grid gap-8 lg:grid-cols-12">
            <div className="space-y-3 lg:col-span-5">
              {UNITS.map((u, i) => (
                <button
                  key={u.name}
                  type="button"
                  onClick={() => setUnit(i)}
                  className={cn(
                    "relative block w-full overflow-hidden rounded-2xl border p-6 text-left transition-colors",
                    i === unit ? "border-primary" : "border-border hover:border-primary/40",
                  )}
                >
                  {i === unit && <motion.span layoutId="unit-bg" className="absolute inset-0 bg-primary/10" transition={{ type: "spring", stiffness: 300, damping: 30 }} />}
                  <span className="relative block">
                    <span className="eyebrow">{u.name}</span>
                    <span className="mt-2 block text-sm text-foreground">{u.address}</span>
                  </span>
                </button>
              ))}
            </div>
            <div className="relative min-h-[420px] overflow-hidden rounded-3xl border border-border lg:col-span-7">
              <AnimatePresence mode="wait">
                <motion.iframe
                  key={active.name}
                  title={`Map of JAK Industries ${active.name}`}
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(active.map)}&z=15&output=embed`}
                  className="absolute inset-0 h-full w-full grayscale invert-[0.9] hue-rotate-180"
                  loading="lazy"
                  initial={{ opacity: 0, scale: 1.08 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.6 }}
                />
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
