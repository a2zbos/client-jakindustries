import { useRef, useState, type ChangeEvent } from "react";
import { LoaderCircle, Upload } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { uploadImage } from "@/lib/content.functions";
import { cn } from "@/lib/utils";

export type ImageAspect = "portrait" | "logo" | "photo";

const ASPECT_CLASS: Record<ImageAspect, string> = {
  portrait: "aspect-[3/4]",
  logo: "aspect-[23/15]",
  photo: "aspect-[4/3]",
};

export const IMAGE_ACCEPT = "image/png,image/jpeg,image/webp";

const MAX_SIDE = 1600;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("This image could not be read. Try a different file."));
    img.src = src;
  });
}

/** Shrinks the image to at most 1600 px on its longest side. PNG stays PNG; everything else becomes JPEG. */
export async function prepareImage(file: File): Promise<{ filename: string; dataUrl: string }> {
  if (!file.type.startsWith("image/")) {
    throw new Error("That file is not an image. Choose a PNG, JPG or WebP file.");
  }
  const objectUrl = URL.createObjectURL(file);
  try {
    const img = await loadImage(objectUrl);
    const longest = Math.max(img.naturalWidth, img.naturalHeight);
    const scale = Math.min(1, MAX_SIDE / longest);
    const width = Math.max(1, Math.round(img.naturalWidth * scale));
    const height = Math.max(1, Math.round(img.naturalHeight * scale));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Your browser could not process this image.");

    const keepPng = file.type === "image/png";
    if (!keepPng) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
    }
    ctx.drawImage(img, 0, 0, width, height);

    const dataUrl = keepPng ? canvas.toDataURL("image/png") : canvas.toDataURL("image/jpeg", 0.85);
    const baseName = file.name.replace(/\.[^.]+$/, "") || "image";
    return { filename: `${baseName}.${keepPng ? "png" : "jpg"}`, dataUrl };
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

/** Resizes the file in the browser, uploads it and returns the public URL. Throws on failure. */
export async function uploadPreparedImage(file: File): Promise<string> {
  const { filename, dataUrl } = await prepareImage(file);
  const result = await uploadImage({ data: { filename, dataUrl } });
  if (!result.ok || !result.url) {
    throw new Error(result.error ?? "The image could not be uploaded. Please try again.");
  }
  return result.url;
}

type ImageInputProps = {
  value: string;
  alt: string;
  aspect: ImageAspect;
  onChange: (url: string) => void;
  buttonLabel?: string;
};

export function ImageInput({ value, alt, aspect, onChange, buttonLabel = "Replace image" }: ImageInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setBusy(true);
    try {
      const url = await uploadPreparedImage(file);
      onChange(url);
      toast.success("Image uploaded. Press Save changes to publish it.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "The image could not be uploaded.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex w-full flex-col gap-3">
      <div className={cn("relative w-full overflow-hidden rounded-xl bg-muted", ASPECT_CLASS[aspect])}>
        {value ? (
          <img src={value} alt={alt} loading="lazy" className="absolute inset-0 h-full w-full object-contain" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center px-3 text-center text-xs text-muted-foreground">
            No image yet
          </div>
        )}
        {busy ? (
          <div
            role="status"
            className="absolute inset-0 flex items-center justify-center gap-2 bg-background/70 text-sm text-foreground"
          >
            <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
            Uploading...
          </div>
        ) : null}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={IMAGE_ACCEPT}
        className="hidden"
        onChange={handleChange}
        tabIndex={-1}
        aria-hidden="true"
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-full"
        disabled={busy}
        onClick={() => inputRef.current?.click()}
        aria-label={`${buttonLabel} for ${alt || "this item"}`}
      >
        {busy ? <LoaderCircle className="animate-spin" /> : <Upload />}
        {busy ? "Uploading..." : buttonLabel}
      </Button>
    </div>
  );
}
