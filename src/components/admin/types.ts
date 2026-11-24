import type { SiteContent } from "@/lib/content";

/** A new value, or a function that receives the latest value and returns the next one. */
export type Updater<T> = T | ((prev: T) => T);

/** Setter passed to sections. Function form avoids stale data after async uploads. */
export type Setter<T> = (next: Updater<T>) => void;

/** Updates one top-level key of the draft. */
export type UpdateFn = <K extends keyof SiteContent>(key: K, value: Updater<SiteContent[K]>) => void;

export type StorageMode = "blob" | "local" | "none";

export type SectionId =
  | "overview"
  | "company"
  | "announcement"
  | "stats"
  | "jakCerts"
  | "ladcoCerts"
  | "wps"
  | "clients"
  | "team"
  | "units"
  | "productPhotos"
  | "csr"
  | "history";

export function resolveUpdater<T>(next: Updater<T>, prev: T): T {
  return typeof next === "function" ? (next as (value: T) => T)(prev) : next;
}
