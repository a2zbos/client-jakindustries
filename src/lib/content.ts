// Editable site content: types, defaults, merge rules and the React context that feeds it to the UI.
// This file runs in the browser too, so it must not import any Node modules.

import { createContext, createElement, useContext, type ReactNode } from "react";
import {
  CLIENTS,
  CONTACT,
  CSR_ACTIVITIES,
  CSR_GALLERY,
  ISO_CERTS,
  LADCO_CERTS,
  PRODUCT_PHOTOS,
  STATS,
  TEAM,
  UNITS,
  WPS,
} from "@/lib/site-data";

export type Cert = { code: string; title: string; image: string };
export type Photo = { src: string; caption: string };
export type Client = { name: string; logo: string };
export type Stat = { value: number; label: string; suffix: string; plain?: boolean };
export type TeamMember = { name: string; role: string; photo: string };
export type Unit = { name: string; address: string; open: string; covered: string; power: string; genset: string; map: string };
export type Announcement = { enabled: boolean; text: string; linkLabel: string; linkUrl: string };
export type Company = {
  phoneMobile: string;
  phoneOffice: string;
  email: string;
  office: string[]; // address lines
  formEndpoint: string; // contact form endpoint (kept editable)
};
export type SiteContent = {
  company: Company;
  announcement: Announcement;
  stats: Stat[];
  isoCerts: Cert[];
  ladcoCerts: Cert[];
  wps: string[];
  clients: Client[];
  team: TeamMember[];
  units: Unit[];
  productPhotos: Photo[];
  csrActivities: string[];
  csrGallery: Photo[];
};

export const DEFAULT_CONTENT: SiteContent = {
  company: {
    phoneMobile: CONTACT.phoneMobile,
    phoneOffice: CONTACT.phoneOffice,
    email: CONTACT.email,
    office: [...CONTACT.office],
    formEndpoint: CONTACT.formEndpoint,
  },
  announcement: { enabled: false, text: "", linkLabel: "", linkUrl: "" },
  stats: STATS.map((s): Stat =>
    "plain" in s && s.plain
      ? { value: s.value, label: s.label, suffix: s.suffix, plain: true }
      : { value: s.value, label: s.label, suffix: s.suffix },
  ),
  isoCerts: ISO_CERTS.map((c) => ({ code: c.code, title: c.title, image: c.image })),
  ladcoCerts: LADCO_CERTS.map((c) => ({ code: c.code, title: c.title, image: c.image })),
  wps: [...WPS],
  clients: CLIENTS.map((c) => ({ name: c.name, logo: c.logo })),
  team: TEAM.map((m) => ({ name: m.name, role: m.role, photo: m.photo })),
  units: UNITS.map((u) => ({
    name: u.name,
    address: u.address,
    open: u.open,
    covered: u.covered,
    power: u.power,
    genset: u.genset,
    map: u.map,
  })),
  productPhotos: PRODUCT_PHOTOS.map((p) => ({ src: p.src, caption: p.caption })),
  csrActivities: [...CSR_ACTIVITIES],
  csrGallery: CSR_GALLERY.map((p) => ({ src: p.src, caption: p.caption })),
};

// Loose view of untrusted saved data: every key is optional and its value is unknown until checked.
type Loose<T> = Partial<Record<keyof T, unknown>>;

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function str(v: unknown, fallback: string): string {
  return typeof v === "string" ? v : fallback;
}

function bool(v: unknown, fallback: boolean): boolean {
  return typeof v === "boolean" ? v : fallback;
}

function list<T>(v: unknown, fallback: T[]): T[] {
  return Array.isArray(v) ? (v as T[]) : fallback;
}

function strList(v: unknown, fallback: string[]): string[] {
  return Array.isArray(v) && v.every((x) => typeof x === "string") ? (v as string[]) : fallback;
}

/** Merges saved content over the defaults. Wrong-typed keys fall back to the default. */
export function mergeContent(saved: Partial<SiteContent> | null | undefined): SiteContent {
  const s: Loose<SiteContent> = isRecord(saved) ? saved : {};
  const c: Loose<Company> = isRecord(s.company) ? s.company : {};
  const a: Loose<Announcement> = isRecord(s.announcement) ? s.announcement : {};
  const base = DEFAULT_CONTENT;

  return {
    company: {
      phoneMobile: str(c.phoneMobile, base.company.phoneMobile),
      phoneOffice: str(c.phoneOffice, base.company.phoneOffice),
      email: str(c.email, base.company.email),
      office: strList(c.office, base.company.office),
      formEndpoint: str(c.formEndpoint, base.company.formEndpoint),
    },
    announcement: {
      enabled: bool(a.enabled, base.announcement.enabled),
      text: str(a.text, base.announcement.text),
      linkLabel: str(a.linkLabel, base.announcement.linkLabel),
      linkUrl: str(a.linkUrl, base.announcement.linkUrl),
    },
    stats: list<Stat>(s.stats, base.stats),
    isoCerts: list<Cert>(s.isoCerts, base.isoCerts),
    ladcoCerts: list<Cert>(s.ladcoCerts, base.ladcoCerts),
    wps: strList(s.wps, base.wps),
    clients: list<Client>(s.clients, base.clients),
    team: list<TeamMember>(s.team, base.team),
    units: list<Unit>(s.units, base.units),
    productPhotos: list<Photo>(s.productPhotos, base.productPhotos),
    csrActivities: strList(s.csrActivities, base.csrActivities),
    csrGallery: list<Photo>(s.csrGallery, base.csrGallery),
  };
}

/** Builds a tel: link: keeps digits and a leading plus sign only. */
export function telHref(phone: string): string {
  const trimmed = phone.trim();
  const plus = trimmed.startsWith("+") ? "+" : "";
  return `tel:${plus}${trimmed.replace(/\D/g, "")}`;
}

export const ContentContext = createContext<SiteContent>(DEFAULT_CONTENT);

export function ContentProvider({ value, children }: { value: SiteContent; children?: ReactNode }) {
  return createElement(ContentContext.Provider, { value, children });
}

export function useContent(): SiteContent {
  return useContext(ContentContext);
}
