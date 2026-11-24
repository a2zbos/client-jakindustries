import { Panel, PanelTitle, SectionHeading } from "./Field";
import { MultiImageDrop } from "./MultiImageDrop";
import { PhotoCardList } from "./ProductPhotosSection";
import { StringListEditor } from "./StringListEditor";
import type { Photo } from "@/lib/content";
import type { Setter } from "./types";

type CsrSectionProps = {
  activities: string[];
  onActivitiesChange: Setter<string[]>;
  gallery: Photo[];
  onGalleryChange: Setter<Photo[]>;
};

export function CsrSection({ activities, onActivitiesChange, gallery, onGalleryChange }: CsrSectionProps) {
  return (
    <>
      <SectionHeading
        title="Society contribution"
        description="Community and social activities, with photos from them. This content appears on the Society contribution page."
      />

      <div className="flex flex-col gap-6">
        <Panel>
          <PanelTitle title="Activities" description="One line per activity. Keep each line short." />
          <StringListEditor
            id="csr-activity"
            items={activities}
            onChange={onActivitiesChange}
            itemLabel="Activity"
            addLabel="Add activity"
            placeholder="For example: Tree planting drive"
            emptyText="No activities listed yet."
            maxLength={300}
          />
        </Panel>

        <Panel>
          <PanelTitle title="Add photos" />
          <MultiImageDrop
            title="Drop photos here"
            hint="You can add several at once. JPG, PNG or WebP. New photos are added to the top of the gallery."
            onAdded={(added) => onGalleryChange((prev) => [...added, ...prev])}
          />
        </Panel>

        <Panel>
          <PanelTitle title="Photo gallery" description="Arrange the photos in the order they should appear." />
          {gallery.length === 0 ? <p className="mb-6 text-sm text-muted-foreground">No photos yet.</p> : null}
          <PhotoCardList photos={gallery} onChange={onGalleryChange} idPrefix="csr-photo" />
        </Panel>
      </div>
    </>
  );
}
