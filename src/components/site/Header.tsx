import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Menu, X, ArrowUpRight, Sun, Moon } from "lucide-react";
import { NAV } from "@/lib/site-data";
import { telHref, useContent } from "@/lib/content";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Header() {
  const { company } = useContent();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 40);
    setHidden(y > prev && y > 400 && !open);
  });

  useEffect(() => setOpen(false), [pathname]);

  return (
    <>
      <motion.header
        animate={{ y: hidden ? "-110%" : "0%" }}
        transition={{ duration: 0.6, ease: EASE }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background,border-color] duration-500",
          scrolled ? "glass border-b border-border" : "border-b border-transparent",
        )}
      >
        <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-5 md:px-10">
          <Link to="/" className="group flex items-center gap-3" aria-label="JAK Industries home">
            <img src="/jak/logo-jak.png" alt="JAK Industries" width={351} height={69} className="h-8 w-auto box-content rounded-lg dark:bg-white dark:px-2.5 dark:py-1.5 md:h-9" />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
            {NAV.map((item) => {
              const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                    active ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-primary"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              to="/contact"
              className="hidden items-center gap-2 rounded-full border border-primary/50 px-4 py-2 text-sm font-semibold text-primary transition-all hover:bg-primary hover:text-primary-foreground hover:shadow-glow md:inline-flex"
            >
              Get a quote <ArrowUpRight className="h-4 w-4" />
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="grid h-11 w-11 place-items-center rounded-full border border-border text-foreground lg:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col bg-background px-6 pb-10 pt-28 lg:hidden"
            initial={{ clipPath: "circle(0% at 92% 5%)" }}
            animate={{ clipPath: "circle(150% at 92% 5%)" }}
            exit={{ clipPath: "circle(0% at 92% 5%)" }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <nav className="flex flex-col gap-1" aria-label="Mobile">
              {NAV.map((item, i) => (
                <motion.div
                  key={item.to}
                  initial={{ opacity: 0, y: 40, rotateX: -60 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ delay: 0.15 + i * 0.05, duration: 0.8, ease: EASE }}
                >
                  <Link to={item.to} className="flex items-baseline gap-4 py-2 font-display text-4xl font-semibold tracking-tight text-foreground">
                    <span className="font-mono text-xs text-primary">0{i + 1}</span>
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="mt-auto space-y-1 text-sm text-muted-foreground">
              <a href={telHref(company.phoneMobile)} className="block">{company.phoneMobile}</a>
              <a href={`mailto:${company.email}`} className="block">{company.email}</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function ThemeToggle() {
  const [light, setLight] = useState(false);
  useEffect(() => setLight(document.documentElement.classList.contains("light")), []);
  const toggle = () => {
    const next = !light;
    const c = document.documentElement.classList;
    c.toggle("light", next);
    c.toggle("dark", !next);
    try {
      localStorage.setItem("theme", next ? "light" : "dark");
    } catch {}
    setLight(next);
  };
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={light ? "Switch to dark theme" : "Switch to light theme"}
      aria-pressed={light}
      data-testid="theme-toggle"
      className="grid h-11 w-11 place-items-center rounded-full border border-border text-foreground transition-colors hover:border-primary hover:text-primary"
    >
      {light ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
    </button>
  );
}
