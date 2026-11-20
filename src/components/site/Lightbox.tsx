import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export type LightboxItem = { src: string; caption: string };

/** Full-screen image viewer; the image grows out of the clicked thumbnail. */
export function Lightbox({
  items,
  index,
  onChange,
  group,
}: {
  items: LightboxItem[];
  index: number | null;
  onChange: (i: number | null) => void;
  group: string;
}) {
  useEffect(() => {
    if (index === null) return;
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") onChange(null);
      if (e.key === "ArrowRight") onChange((index + 1) % items.length);
      if (e.key === "ArrowLeft") onChange((index - 1 + items.length) % items.length);
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [index, items.length, onChange]);
  const item = index === null ? null : items[index];
  return (
    <AnimatePresence>
      {item && index !== null && (
        <motion.div
          className="fixed inset-0 z-[95] flex items-center justify-center bg-background/90 p-4 backdrop-blur-xl md:p-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => onChange(null)}
          role="dialog"
          aria-modal="true"
          aria-label={item.caption}
        >
          <motion.figure
            layoutId={`${group}-${index}`}
            className="relative max-h-full max-w-4xl overflow-hidden rounded-2xl bg-paper"
            onClick={(e) => e.stopPropagation()}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
          >
            <img src={item.src} alt={item.caption} className="max-h-[80vh] w-auto object-contain" />
            <figcaption className="bg-card px-5 py-3 text-sm text-foreground">{item.caption}</figcaption>
          </motion.figure>
          <button type="button" aria-label="Close" onClick={() => onChange(null)} className="absolute right-5 top-5 grid h-12 w-12 place-items-center rounded-full border border-border bg-card text-foreground">
            <X className="h-5 w-5" />
          </button>
          {items.length > 1 && (
            <>
              <button type="button" aria-label="Previous" onClick={(e) => { e.stopPropagation(); onChange((index - 1 + items.length) % items.length); }} className="absolute left-4 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-border bg-card text-foreground">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button type="button" aria-label="Next" onClick={(e) => { e.stopPropagation(); onChange((index + 1) % items.length); }} className="absolute right-4 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-border bg-card text-foreground">
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
