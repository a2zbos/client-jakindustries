import { useEffect, useState } from "react";
import { LoaderCircle, RotateCcw } from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { SiteContent } from "@/lib/content";
import { listVersions, restoreVersion } from "@/lib/content.functions";

import { Panel, PanelTitle, SectionHeading, formatDateTime } from "./Field";

type HistorySectionProps = {
  hasUnsaved: boolean;
  onRestored: (content: SiteContent) => void;
};

type Version = { id: string; savedAt: string };

export function HistorySection({ hasUnsaved, onRestored }: HistorySectionProps) {
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [restoring, setRestoring] = useState(false);

  async function refresh() {
    setLoading(true);
    try {
      const result = await listVersions();
      if (result.ok) {
        setVersions(result.versions);
        setLoadError(null);
      } else {
        setLoadError("The history could not be loaded.");
      }
    } catch {
      setLoadError("The history could not be loaded. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  // Load the list once each time the section opens.
  useEffect(() => {
    void refresh();
  }, []);

  async function handleRestore(id: string) {
    setRestoring(true);
    try {
      const result = await restoreVersion({ data: { id } });
      if (result.ok && result.content) {
        onRestored(result.content);
        toast.success("That version is restored and live on the site.");
        await refresh();
      } else {
        toast.error(result.error ?? "This version could not be restored.");
      }
    } catch {
      toast.error("This version could not be restored. Please try again.");
    } finally {
      setRestoring(false);
      setPendingId(null);
    }
  }

  return (
    <>
      <SectionHeading
        title="History"
        description="Every save is kept as a copy. If a change went wrong, you can go back to an earlier version."
      />

      <Panel>
        <PanelTitle title="Saved versions" description="The newest version is the one live on the site." />

        {loading ? (
          <p role="status" className="flex items-center gap-2 text-sm text-muted-foreground">
            <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
            Loading history...
          </p>
        ) : null}

        {loadError ? (
          <div className="flex flex-col items-start gap-3">
            <p role="alert" className="text-sm font-medium text-destructive">
              {loadError}
            </p>
            <Button type="button" variant="outline" size="sm" onClick={() => void refresh()}>
              Try again
            </Button>
          </div>
        ) : null}

        {!loading && !loadError && versions.length === 0 ? (
          <p className="text-sm text-muted-foreground">No saved versions yet. Your first save will appear here.</p>
        ) : null}

        {!loading && versions.length > 0 ? (
          <ul className="divide-y divide-border">
            {versions.map((version, index) => (
              <li key={version.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-medium text-foreground">{formatDateTime(version.savedAt)}</p>
                  {index === 0 ? (
                    <Badge variant="secondary" className="w-fit rounded-full">
                      Live now
                    </Badge>
                  ) : null}
                </div>
                {index === 0 ? null : (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    onClick={() => setPendingId(version.id)}
                    aria-label={`Restore version saved ${formatDateTime(version.savedAt)}`}
                  >
                    <RotateCcw />
                    Restore
                  </Button>
                )}
              </li>
            ))}
          </ul>
        ) : null}
      </Panel>

      <AlertDialog
        open={pendingId !== null}
        onOpenChange={(open) => {
          if (!open && !restoring) setPendingId(null);
        }}
      >
        <AlertDialogContent className="rounded-2xl bg-background">
          <AlertDialogHeader>
            <AlertDialogTitle>Restore this version?</AlertDialogTitle>
            <AlertDialogDescription>
              {hasUnsaved
                ? "The version will go live on the site straight away. Your unsaved changes will be lost."
                : "The version will go live on the site straight away. The current version is kept in the history."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={restoring}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={restoring}
              onClick={(event) => {
                event.preventDefault();
                if (pendingId) void handleRestore(pendingId);
              }}
            >
              {restoring ? <LoaderCircle className="animate-spin" /> : null}
              Restore
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
