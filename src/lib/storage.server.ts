// Server-only storage for site content and uploaded images.
// Blob mode when BLOB_READ_WRITE_TOKEN is set, refuse-writes mode on Vercel without a Blob store,
// and local files (.content/ and public/uploads/) otherwise. Only load this from server code.

import { del, list, put } from "@vercel/blob";
import { mkdir, readdir, readFile, unlink, writeFile } from "node:fs/promises";
import { join } from "node:path";

export type StorageMode = "blob" | "local" | "none";
export type ContentVersion = { id: string; savedAt: string };

const KEEP = 20;
const VERSION_ID_RE = /^site-\d+$/;
const BLOB_VERSION_PATH_RE = /^content\/site-\d+\.json$/;
const NOT_CONNECTED =
  "Vercel Blob is not connected. Add a Blob store to this project in the Vercel dashboard.";

export function storageMode(): StorageMode {
  if (process.env["BLOB_READ_WRITE_TOKEN"]) return "blob";
  if (process.env["VERCEL"]) return "none";
  return "local";
}

function safeName(name: string): string {
  const cleaned = name.toLowerCase().replace(/[^a-z0-9.-]/g, "-").slice(0, 60);
  return cleaned || "image";
}

function tsOf(id: string): number {
  return Number(id.slice("site-".length));
}

function isNotFound(err: unknown): boolean {
  return (err as NodeJS.ErrnoException | undefined)?.code === "ENOENT";
}

function contentDir(): string {
  return join(process.cwd(), ".content");
}

function uploadsDir(): string {
  return join(process.cwd(), "public", "uploads");
}

// ---- blob helpers ----

async function listBlobVersions() {
  const { blobs } = await list({ prefix: "content/" });
  return blobs
    .filter((b) => BLOB_VERSION_PATH_RE.test(b.pathname))
    .sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime());
}

function blobIdOf(pathname: string): string {
  return pathname.slice("content/".length).replace(/\.json$/, "");
}

// Public pages read a fixed pointer copy instead of listing blobs, because list() counts
// against the Blob plan's advanced-operation quota on every render.
const CURRENT_PATH = "content/current.json";
const BLOB_CACHE_MS = 30_000;
let blobCache: { value: unknown; at: number } | null = null;

/** Public base URL of the Blob store, derived from the token (vercel_blob_rw_<storeId>_<secret>). */
function blobBaseUrl(): string | null {
  const token = process.env["BLOB_READ_WRITE_TOKEN"] ?? "";
  const storeId = /^vercel_blob_rw_([A-Za-z0-9]+)_/.exec(token)?.[1];
  return storeId ? `https://${storeId.toLowerCase()}.public.blob.vercel-storage.com` : null;
}

async function readBlobCurrent(): Promise<unknown | null> {
  const base = blobBaseUrl();
  if (base) {
    const res = await fetch(`${base}/${CURRENT_PATH}`, { cache: "no-store" });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Could not read saved content (${res.status})`);
    return res.json();
  }

  // Token not in the expected format: fall back to listing (uses an advanced operation).
  const blobs = await listBlobVersions();
  const newest = blobs[0];
  if (!newest) return null;
  const res = await fetch(newest.url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Could not read saved content (${res.status})`);
  return res.json();
}

// ---- local helpers ----

async function localIds(): Promise<string[]> {
  let names: string[];
  try {
    names = await readdir(contentDir());
  } catch (err) {
    if (isNotFound(err)) return [];
    throw err;
  }
  return names
    .map((n) => n.replace(/\.json$/, ""))
    .filter((id) => VERSION_ID_RE.test(id))
    .sort((a, b) => tsOf(b) - tsOf(a));
}

// ---- public API ----

/** Newest saved content, or null when nothing has been saved yet. */
export async function readLatest(): Promise<unknown | null> {
  const mode = storageMode();
  if (mode === "none") return null;

  if (mode === "blob") {
    if (blobCache && Date.now() - blobCache.at < BLOB_CACHE_MS) return blobCache.value;
    const value = await readBlobCurrent();
    blobCache = { value, at: Date.now() };
    return value;
  }

  const ids = await localIds();
  const newestId = ids[0];
  if (!newestId) return null;
  return JSON.parse(await readFile(join(contentDir(), `${newestId}.json`), "utf8")) as unknown;
}

/** Writes a new version and keeps only the newest KEEP versions. Returns the save time as ISO text. */
export async function writeContent(obj: unknown): Promise<string> {
  const mode = storageMode();
  if (mode === "none") throw new Error(NOT_CONNECTED);

  const ts = Date.now();
  const id = `site-${ts}`;
  const json = JSON.stringify(obj, null, 2);

  if (mode === "blob") {
    await put(`content/${id}.json`, json, {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
    });
    await put(CURRENT_PATH, json, {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true,
      cacheControlMaxAge: 60,
    });
    // This instance serves the new content at once; others pick it up after the cache window.
    blobCache = { value: obj, at: Date.now() };
    try {
      const stale = (await listBlobVersions()).slice(KEEP);
      if (stale.length > 0) await del(stale.map((b) => b.url));
    } catch {
      // Pruning is housekeeping: the save has already succeeded, so do not report it as failed.
    }
  } else {
    await mkdir(contentDir(), { recursive: true });
    await writeFile(join(contentDir(), `${id}.json`), json, "utf8");
    const stale = (await localIds()).slice(KEEP);
    await Promise.all(stale.map((old) => unlink(join(contentDir(), `${old}.json`))));
  }

  return new Date(ts).toISOString();
}

/** Saved versions, newest first. */
export async function listContentVersions(): Promise<ContentVersion[]> {
  const mode = storageMode();
  if (mode === "none") return [];

  if (mode === "blob") {
    const blobs = await listBlobVersions();
    return blobs.slice(0, KEEP).map((b) => ({
      id: blobIdOf(b.pathname),
      savedAt: new Date(tsOf(blobIdOf(b.pathname))).toISOString(),
    }));
  }

  return (await localIds()).slice(0, KEEP).map((id) => ({
    id,
    savedAt: new Date(tsOf(id)).toISOString(),
  }));
}

/** One saved version by id (e.g. "site-1700000000000"), or null when it does not exist. */
export async function readVersion(id: string): Promise<unknown | null> {
  if (!VERSION_ID_RE.test(id)) return null;
  const mode = storageMode();
  if (mode === "none") return null;

  if (mode === "blob") {
    const { blobs } = await list({ prefix: `content/${id}.json` });
    const match = blobs.find((b) => b.pathname === `content/${id}.json`);
    if (!match) return null;
    const res = await fetch(match.url, { cache: "no-store" });
    if (!res.ok) throw new Error(`Could not read saved content (${res.status})`);
    return res.json();
  }

  try {
    return JSON.parse(await readFile(join(contentDir(), `${id}.json`), "utf8")) as unknown;
  } catch (err) {
    if (isNotFound(err)) return null;
    throw err;
  }
}

/** Stores an image and returns its public URL. */
export async function saveImage(name: string, buffer: Buffer, contentType: string): Promise<string> {
  const mode = storageMode();
  if (mode === "none") throw new Error(NOT_CONNECTED);

  if (mode === "blob") {
    const blob = await put(`uploads/${safeName(name)}`, buffer, {
      access: "public",
      contentType,
      addRandomSuffix: true,
    });
    return blob.url;
  }

  const file = `${Date.now()}-${safeName(name)}`;
  await mkdir(uploadsDir(), { recursive: true });
  await writeFile(join(uploadsDir(), file), buffer);
  return `/uploads/${file}`;
}
