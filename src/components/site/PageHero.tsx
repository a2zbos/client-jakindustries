import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { SplitText } from "./motion";

/** Inner-page header: full-bleed photo that zooms away as you scroll, with 3D-flipping title. */
export function PageHero({
  eyebrow,
  title,
  intro,
  image,
  children,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  image: string;
  children?: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1.05, 1.35]);
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "60%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  return (
    <section ref={ref} className="relative flex min-h-[88vh] items-end overflow-hidden pt-32">
      <motion.img src={image} alt="" style={{ scale, y }} className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-background/55" />
      <div className="absolute inset-0 bg-fade-b" />
      <div className="absolute inset-0 grid-lines opacity-30" />
      <motion.div style={{ y: textY, opacity }} className="relative mx-auto w-full max-w-[1440px] px-5 pb-20 md:px-10">
        <motion.div
          className="eyebrow mb-6"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          {eyebrow}
        </motion.div>
        <SplitText
          as="h1"
          animateOnMount
          delay={0.55}
          text={title}
          className="block max-w-5xl text-5xl font-semibold leading-[0.95] md:text-8xl"
        />
        {intro && (
          <motion.p
            className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
          >
            {intro}
          </motion.p>
        )}
        {children}
      </motion.div>
    </section>
  );
}
