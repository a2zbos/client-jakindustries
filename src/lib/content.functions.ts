// Server functions for reading and editing site content. Storage, cookies and crypto are imported
// only inside handlers so nothing server-only reaches the browser bundle.

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { DEFAULT_CONTENT, mergeContent, type SiteContent } from "@/lib/content";

const COOKIE_NAME = "jak_admin";
const SESSION_DAYS = 7;
const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
const DATA_URL_RE = /^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/=]+)$/;

const text = z.string().max(2000);
const certSchema = z.object({ code: text, title: text, image: text });
const photoSchema = z.object({ src: text, caption: text });
const clientSchema = z.object({ name: text, logo: text });
const teamSchema = z.object({ name: text, role: text, photo: text });
const unitSchema = z.object({
  name: text,
  address: text,
  open: text,
  covered: text,
  power: text,
  genset: text,
  map: text,
});

const siteContentSchema = z.object({
  company: z.object({
    phoneMobile: text,
    phoneOffice: text,
    email: text,
    office: z.array(text).max(500),
    formEndpoint: text,
  }),
  announcement: z.object({
    enabled: z.boolean(),
    text,
    linkLabel: text,
    linkUrl: text,
  }),
  stats: z
    .array(
      z.object({
        value: z.number(),
        label: text,
        suffix: text,
        plain: z.boolean().optional(),
      }),
    )
    .max(500),
  isoCerts: z.array(certSchema).max(500),
  ladcoCerts: z.array(certSchema).max(500),
  wps: z.array(text).max(500),
  clients: z.array(clientSchema).max(500),
  team: z.array(teamSchema).max(500),
  units: z.array(unitSchema).max(500),
  productPhotos: z.array(photoSchema).max(500),
  csrActivities: z.array(text).max(500),
  csrGallery: z.array(photoSchema).max(500),
});

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : "Something went wrong";
}

/** True when the admin cookie is signed with the server secret and has not expired. */
async function hasValidSession(): Promise<boolean> {
  const { getCookie } = await import("@tanstack/react-start/server");
  const { createHash, createHmac, timingSafeEqual } = await import("node:crypto");

  const secret = process.env["ADMIN_SECRET"] || process.env["ADMIN_PASSWORD"];
  const token = getCookie(COOKIE_NAME);
  if (!secret || !token) return false;

  const dot = token.indexOf(".");
  if (dot <= 0) return false;
  const expiresMs = Number(token.slice(0, dot));
  if (!Number.isFinite(expiresMs) || expiresMs <= Date.now()) return false;

  const expected = createHmac("sha256", secret).update(String(expiresMs)).digest("hex");
  const given = token.slice(dot + 1);
  // Hash both sides first so timingSafeEqual always gets equal-length buffers.
  const a = createHash("sha256").update(given).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

export const getSiteContent = createServerFn({ method: "GET" }).handler(async (): Promise<SiteContent> => {
  try {
    const { readLatest } = await import("./storage.server");
    const saved = await readLatest();
    return mergeContent(saved as Partial<SiteContent> | null);
  } catch {
    return DEFAULT_CONTENT;
  }
});

export const getAdminSession = createServerFn({ method: "GET" }).handler(async () => {
  const { storageMode } = await import("./storage.server");
  return { loggedIn: await hasValidSession(), storage: storageMode() };
});

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator(z.object({ password: z.string().max(200) }))
  .handler(async ({ data }) => {
    const { setCookie } = await import("@tanstack/react-start/server");
    const { createHash, createHmac, timingSafeEqual } = await import("node:crypto");

    const adminPassword = process.env["ADMIN_PASSWORD"];
    if (!adminPassword) return { ok: false, error: "ADMIN_PASSWORD is not set on the server" };

    const given = createHash("sha256").update(data.password).digest();
    const wanted = createHash("sha256").update(adminPassword).digest();
    if (!timingSafeEqual(given, wanted)) return { ok: false, error: "Wrong password" };

    const secret = process.env["ADMIN_SECRET"] || adminPassword;
    const maxAge = SESSION_DAYS * 24 * 60 * 60;
    const expiresMs = Date.now() + maxAge * 1000;
    const signature = createHmac("sha256", secret).update(String(expiresMs)).digest("hex");

    setCookie(COOKIE_NAME, `${expiresMs}.${signature}`, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env["NODE_ENV"] === "production",
      path: "/",
      maxAge,
    });
    return { ok: true };
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  const { deleteCookie } = await import("@tanstack/react-start/server");
  deleteCookie(COOKIE_NAME, { path: "/" });
  return { ok: true as const };
});

export const saveSiteContent = createServerFn({ method: "POST" })
  .inputValidator(z.object({ content: siteContentSchema }))
  .handler(async ({ data }) => {
    if (!(await hasValidSession())) return { ok: false, error: "Not logged in" };
    const { writeContent } = await import("./storage.server");
    try {
      const savedAt = await writeContent(data.content);
      return { ok: true, savedAt };
    } catch (err) {
      return { ok: false, error: errorMessage(err) };
    }
  });

export const uploadImage = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      filename: z.string().max(200),
      dataUrl: z.string().max(6_000_000),
    }),
  )
  .handler(async ({ data }) => {
    if (!(await hasValidSession())) return { ok: false, error: "Not logged in" };

    const match = DATA_URL_RE.exec(data.dataUrl);
    const type = match?.[1];
    const base64 = match?.[2];
    if (!type || !base64) return { ok: false, error: "Unsupported image. Use JPEG, PNG or WebP." };

    const buffer = Buffer.from(base64, "base64");
    if (buffer.length > MAX_IMAGE_BYTES) return { ok: false, error: "Image is larger than 4 MB" };

    const { saveImage } = await import("./storage.server");
    try {
      const url = await saveImage(data.filename, buffer, `image/${type}`);
      return { ok: true, url };
    } catch (err) {
      return { ok: false, error: errorMessage(err) };
    }
  });

export const listVersions = createServerFn({ method: "GET" }).handler(async () => {
  if (!(await hasValidSession())) return { ok: false, versions: [], error: "Not logged in" };
  const { listContentVersions } = await import("./storage.server");
  try {
    const versions = (await listContentVersions()).slice(0, 20);
    return { ok: true, versions };
  } catch (err) {
    return { ok: false, versions: [], error: errorMessage(err) };
  }
});

export const restoreVersion = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.string().regex(/^site-\d{1,16}$/) }))
  .handler(async ({ data }) => {
    if (!(await hasValidSession())) return { ok: false, error: "Not logged in" };
    const { readVersion, writeContent } = await import("./storage.server");
    try {
      const saved = await readVersion(data.id);
      if (!saved) return { ok: false, error: "That version could not be found." };
      const content = mergeContent(saved as Partial<SiteContent>);
      await writeContent(content);
      return { ok: true, content };
    } catch (err) {
      return { ok: false, error: errorMessage(err) };
    }
  });
