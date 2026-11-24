import { useRef, useState } from "react";
import { CloudUpload, LoaderCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import type { Photo } from "@/lib/content";
import { cn } from "@/lib/utils";

import { IMAGE_ACCEPT, uploadPreparedImage } from "./ImageInput";

type MultiImageDropProps = {
  title: string;
  hint: string;
  onAdded: (photos: Photo[]) => void;
};

function captionFromName(name: string): string {
  return name
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function MultiImageDrop({ title, hint, onAdded }: MultiImageDropProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);

  async function addFiles(picked: File[]) {
    const files = picked.filter((file) => file.type.startsWith("image/"));
    if (files.length === 0) {
      toast.error("Please choose image files (PNG, JPG or WebP).");
      return;
    }
    const added: Photo[] = [];
    setProgress({ done: 0, total: files.length });
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file) continue;
      try {
        const src = await uploadPreparedImage(file);
        added.push({ src, caption: captionFromName(file.name) });
      } catch (error) {
        toast.error(`${file.name}: ${error instanceof Error ? error.message : "upload failed."}`);
      }
      setProgress({ done: i + 1, total: files.length });
    }
    setProgress(null);
    if (added.length > 0) {
      onAdded(added);
      toast.success(
        added.length === 1 ? "1 photo added. Press Save changes to publish it." : `${added.length} photos added. Press Save changes to publish them.`,
      );
    }
  }

  const busy = progress !== null;

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setDragging(false);
        if (busy) return;
        void addFiles(Array.from(event.dataTransfer.files));
      }}
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-8 text-center transition-colors",
        dragging ? "border-primary bg-primary/5" : "border-border bg-muted/40",
      )}
    >
      <CloudUpload className="h-8 w-8 text-primary" aria-hidden="true" />
      <p className="font-medium text-foreground">{title}</p>
      <p className="max-w-md text-sm leading-relaxed text-muted-foreground">{hint}</p>
      <Button type="button" variant="outline" disabled={busy} onClick={() => inputRef.current?.click()}>
        Choose photos
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept={IMAGE_ACCEPT}
        multiple
        className="hidden"
        tabIndex={-1}
        aria-hidden="true"
        onChange={(event) => {
          const picked = Array.from(event.target.files ?? []);
          event.target.value = "";
          if (picked.length > 0) void addFiles(picked);
        }}
      />
      {progress ? (
        <p role="status" className="flex items-center gap-2 text-sm text-foreground">
          <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
          Uploading {Math.min(progress.done + 1, progress.total)} of {progress.total}...
        </p>
      ) : null}
    </div>
  );
}
