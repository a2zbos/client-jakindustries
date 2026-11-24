import { Input } from "@/components/ui/input";
import type { Photo } from "@/lib/content";

import { Field, Panel, PanelTitle, SectionHeading } from "./Field";
import { ImageInput } from "./ImageInput";
import { ListControls, moveItem, removeItem } from "./ListControls";
import { MultiImageDrop } from "./MultiImageDrop";
import type { Setter } from "./types";

type PhotoCardListProps = {
  photos: Photo[];
  onChange: Setter<Photo[]>;
  idPrefix: string;
};

/** Grid of photo cards with replace, caption, reorder and delete. Shared by the product and CSR galleries. */
export function PhotoCardList({ photos, onChange, idPrefix }: PhotoCardListProps) {
  const patch = (index: number, change: Partial<Photo>) =>
    onChange((prev) => prev.map((photo, j) => (j === index ? { ...photo, ...change } : photo)));

  return (
    <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {photos.map((photo, i) => (
        <li key={i} className="flex flex-col gap-4 rounded-2xl border border-border bg-background p-4">
          <ImageInput
            value={photo.src}
            alt={photo.caption || `Photo ${i + 1}`}
            aspect="photo"
            onChange={(url) => patch(i, { src: url })}
          />
          <Field id={`${idPrefix}-${i}-caption`} label="Caption" hint="Short description shown under the photo.">
            <Input
              id={`${idPrefix}-${i}-caption`}
              type="text"
              maxLength={200}
              value={photo.caption}
              onChange={(event) => patch(i, { caption: event.target.value })}
            />
          </Field>
          <div className="mt-auto flex justify-end">
            <ListControls
              index={i}
              count={photos.length}
              itemLabel="photo"
              onMoveUp={() => onChange((prev) => moveItem(prev, i, i - 1))}
              onMoveDown={() => onChange((prev) => moveItem(prev, i, i + 1))}
              onDelete={() => onChange((prev) => removeItem(prev, i))}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

type ProductPhotosSectionProps = {
  photos: Photo[];
  onChange: Setter<Photo[]>;
};

export function ProductPhotosSection({ photos, onChange }: ProductPhotosSectionProps) {
  return (
    <>
      <SectionHeading
        title="Product photos"
        description="Photos of your finished parts, shown in the From our shop floor gallery on the Products page."
      />

      <div className="flex flex-col gap-6">
        <Panel>
          <PanelTitle title="Add photos" />
          <MultiImageDrop
            title="Drop photos here"
            hint="You can add several at once. JPG, PNG or WebP. New photos are added to the end of the gallery."
            onAdded={(added) => onChange((prev) => [...prev, ...added])}
          />
        </Panel>

        <Panel>
          <PanelTitle
            title="Gallery"
            description="Arrange the photos in the order they should appear. Replace a picture or edit its caption at any time."
          />
          {photos.length === 0 ? <p className="mb-6 text-sm text-muted-foreground">No photos yet.</p> : null}
          <PhotoCardList photos={photos} onChange={onChange} idPrefix="product-photo" />
        </Panel>
      </div>
    </>
  );
}
