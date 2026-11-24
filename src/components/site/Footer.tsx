import { Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { NAV } from "@/lib/site-data";
import { telHref, useContent } from "@/lib/content";

export function Footer() {
  const { company } = useContent();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["20%", "-8%"]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-6, 0]);

  return (
    <footer ref={ref} className="relative overflow-hidden border-t border-border bg-card">
      <div className="pointer-events-none absolute inset-0 grid-lines opacity-40" />
      <div className="relative mx-auto max-w-[1440px] px-5 pb-10 pt-20 md:px-10">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <img src="/jak/logo-footer.png" alt="JAK Industries and LADCO" className="h-20 w-auto invert dark:invert-0" />
            <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
              Heavy fabrication in carbon steel, stainless steel and aluminium since 2004, led by a team with
              40 years of experience in heavy structural work.
            </p>
            <Link
              to="/contact"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-shadow hover:shadow-glow"
            >
              Request a quote <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="md:col-span-3">
            <div className="eyebrow mb-5">Quick links</div>
            <ul className="grid grid-cols-2 gap-y-2 text-sm">
              {NAV.map((n) => (
                <li key={n.to}>
                  <Link to={n.to} className="text-muted-foreground transition-colors hover:text-primary">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4 text-sm md:col-span-4">
            <div className="eyebrow mb-5">Registered office</div>
            <p className="flex gap-3 text-muted-foreground">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>{company.office.map((l) => <span key={l} className="block">{l}</span>)}</span>
            </p>
            <a href={telHref(company.phoneMobile)} className="flex gap-3 text-muted-foreground hover:text-foreground">
              <Phone className="h-4 w-4 text-primary" /> {company.phoneMobile} · {company.phoneOffice}
            </a>
            <a href={`mailto:${company.email}`} className="flex gap-3 text-muted-foreground hover:text-foreground">
              <Mail className="h-4 w-4 text-primary" /> {company.email}
            </a>
          </div>
        </div>

        <motion.div style={{ x, rotate }} className="pointer-events-none mt-16 select-none whitespace-nowrap font-display text-[18vw] font-bold leading-none tracking-tighter text-outline">
          JAK INDUSTRIES
        </motion.div>

        <div className="mt-6 flex flex-col justify-between gap-2 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row">
          <span>© {new Date().getFullYear()} JAK Industries. All rights reserved.</span>
          <span className="font-mono">ISO 9001:2015 · ISO 14001:2015 · ISO 45001:2018 · ISO 3834-2:2021</span>
          <span>
            Website developed and managed by{" "}
            <a href="https://www.a2zbos.com" target="_blank" rel="noopener" className="font-medium text-foreground underline underline-offset-4 transition-colors hover:text-primary">
              A2ZBOS
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
