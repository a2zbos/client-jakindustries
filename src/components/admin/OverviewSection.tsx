import { useRef, type ChangeEvent } from "react";
import { Download, Upload } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import type { SiteContent } from "@/lib/content";

import { Panel, PanelTitle, SectionHeading, formatDateTime } from "./Field";
import type { StorageMode } from "./types";

type OverviewSectionProps = {
  draft: SiteContent;
  storage: StorageMode;
  lastSaved: string | null;
  onRestoreBackup: (content: SiteContent) => void;
};

const STORAGE_LABEL: Record<StorageMode, string> = {
  blob: "Live storage connected",
  local: "Local test mode",
  none: "Not connected",
};

const STORAGE_HELP: Record<StorageMode, string> = {
  blob: "Changes you save go live on the public site straight away.",
  local: "Saving writes files to this computer only. The live site is not updated.",
  none: "Saving is off until the site storage is connected in the hosting dashboard.",
};

const LIST_KEYS = [
  "stats",
  "isoCerts",
  "ladcoCerts",
  "wps",
  "clients",
  "team",
  "units",
  "productPhotos",
  "csrActivities",
  "csrGallery",
] as const;

const OBJECT_KEYS = ["company", "announcement"] as const;

function isSiteContent(value: unknown): value is SiteContent {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  const listsOk = LIST_KEYS.every((key) => Array.isArray(record[key]));
  const objectsOk = OBJECT_KEYS.every((key) => typeof record[key] === "object" && record[key] !== null);
  return listsOk && objectsOk;
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function downloadBackup(content: SiteContent) {
  const now = new Date();
  const stamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  const blob = new Blob([JSON.stringify(content, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `jak-content-${stamp}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function OverviewSection({ draft, storage, lastSaved, onRestoreBackup }: OverviewSectionProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  const counts = [
    { label: "Certificates", value: draft.isoCerts.length + draft.ladcoCerts.length },
    { label: "Customers", value: draft.clients.length },
    { label: "CSR photos", value: draft.csrGallery.length },
    { label: "Product photos", value: draft.productPhotos.length },
  ];

  async function handleBackupFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      const parsed: unknown = JSON.parse(await file.text());
      if (!isSiteContent(parsed)) {
        toast.error("This file is not a valid site backup. Choose a jak-content .json file.");
        return;
      }
      onRestoreBackup(parsed);
      toast.success("Backup loaded into the draft. Press Save changes to publish it.");
    } catch {
      toast.error("This file could not be read. Choose a backup .json file.");
    }
  }

  return (
    <>
      <SectionHeading
        title="Welcome"
        description="Edit the text, numbers, pictures and lists on the website from here. Nothing goes live until you press Save changes at the top of the page."
      />

      <div className="flex flex-col gap-6">
        <Panel>
          <PanelTitle title="At a glance" description="How much content is on the site right now." />
          <dl className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {counts.map((item) => (
              <div key={item.label} className="rounded-2xl border border-border bg-background p-5">
                <dt className="text-xs font-medium text-muted-foreground">{item.label}</dt>
                <dd className="mt-2 font-display text-3xl font-semibold text-foreground">{item.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-background p-5">
              <p className="text-xs font-medium text-muted-foreground">Storage</p>
              <p className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                <span className="h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
                {STORAGE_LABEL[storage]}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{STORAGE_HELP[storage]}</p>
            </div>
            <div className="rounded-2xl border border-border bg-background p-5">
              <p className="text-xs font-medium text-muted-foreground">Last saved</p>
              <p className="mt-2 text-sm font-semibold text-foreground">
                {lastSaved ? formatDateTime(lastSaved) : "No saves recorded yet"}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                The time of the most recent save to the website.
              </p>
            </div>
          </div>
        </Panel>

        <Panel>
          <PanelTitle
            title="Backup"
            description="A backup is a single file with everything on the site. Download one before big changes, so you can load it back if needed."
          />
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button type="button" variant="outline" className="rounded-full" onClick={() => downloadBackup(draft)}>
              <Download />
              Download backup
            </Button>
            <Button type="button" variant="outline" className="rounded-full" onClick={() => fileRef.current?.click()}>
              <Upload />
              Restore from backup file
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              tabIndex={-1}
              aria-hidden="true"
              onChange={handleBackupFile}
            />
          </div>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            Restoring a backup only loads it into the draft. Press Save changes afterwards to publish it.
          </p>
        </Panel>
      </div>
    </>
  );
}
