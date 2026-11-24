import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useContent } from "@/lib/content";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Small dismissible notice pinned to the bottom-left of public pages. Edited in the admin panel. */
export function AnnouncementBar() {
  const { announcement } = useContent();
  const { enabled, text, linkLabel, linkUrl } = announcement;
  const storageKey = `jak-announcement:${text}`;
  const [dismissed, setDismissed] = useState(false);

  // Read the dismissal after mount so server and client markup match.
  useEffect(() => {
    try {
      setDismissed(sessionStorage.getItem(storageKey) === "1");
    } catch {
      setDismissed(false);
    }
  }, [storageKey]);

  const visible = enabled && text.trim() !== "" && !dismissed;
  const showLink = linkLabel.trim() !== "" && linkUrl.trim() !== "";
  const isExternal = /^https?:\/\//i.test(linkUrl);

  const dismiss = () => {
    try {
      sessionStorage.setItem(storageKey, "1");
    } catch {
      // Storage can be blocked; the pill still hides for this page view.
    }
    setDismissed(true);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="announcement"
          role="region"
          aria-label="Announcement"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="fixed bottom-5 left-5 z-40 flex max-w-[calc(100vw-2.5rem)] items-center gap-3 rounded-full border border-border bg-card/90 py-2 pl-4 pr-2 text-sm text-foreground shadow-deep backdrop-blur"
        >
          <span className="min-w-0 leading-snug">{text}</span>
          {showLink && (
            <a
              href={linkUrl}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener noreferrer" : undefined}
              className="shrink-0 font-semibold text-primary underline underline-offset-4 transition-colors hover:text-foreground"
            >
              {linkLabel}
            </a>
          )}
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss announcement"
            className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
