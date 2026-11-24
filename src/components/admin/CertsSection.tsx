import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Cert } from "@/lib/content";

import { Field, Panel, SectionHeading } from "./Field";
import { ImageInput } from "./ImageInput";
import { ListControls, moveItem, removeItem } from "./ListControls";
import type { Setter } from "./types";

type CertsSectionProps = {
  title: string;
  description: string;
  idPrefix: string;
  certs: Cert[];
  onChange: Setter<Cert[]>;
};

export function CertsSection({ title, description, idPrefix, certs, onChange }: CertsSectionProps) {
  const patch = (index: number, change: Partial<Cert>) =>
    onChange((prev) => prev.map((cert, j) => (j === index ? { ...cert, ...change } : cert)));

  return (
    <>
      <SectionHeading title={title} description={description} />

      <Panel>
        {certs.length === 0 ? <p className="mb-6 text-sm text-muted-foreground">No certificates yet.</p> : null}

        <ul className="grid gap-4 md:grid-cols-2">
          {certs.map((cert, i) => (
            <li
              key={i}
              className="flex flex-col gap-4 rounded-2xl border border-border bg-background p-4 sm:flex-row"
            >
              <div className="w-full sm:w-40 sm:shrink-0">
                <ImageInput
                  value={cert.image}
                  alt={cert.title || `Certificate ${i + 1}`}
                  aspect="portrait"
                  onChange={(url) => patch(i, { image: url })}
                />
              </div>

              <div className="flex min-w-0 flex-1 flex-col gap-4">
                <Field
                  id={`${idPrefix}-${i}-code`}
                  label="Certificate code"
                  hint="The short reference printed on the certificate, for example ISO 9001:2015."
                >
                  <Input
                    id={`${idPrefix}-${i}-code`}
                    type="text"
                    maxLength={100}
                    value={cert.code}
                    onChange={(event) => patch(i, { code: event.target.value })}
                  />
                </Field>

                <Field id={`${idPrefix}-${i}-title`} label="Certificate name">
                  <Input
                    id={`${idPrefix}-${i}-title`}
                    type="text"
                    maxLength={200}
                    value={cert.title}
                    onChange={(event) => patch(i, { title: event.target.value })}
                  />
                </Field>

                <div className="mt-auto flex justify-end">
                  <ListControls
                    index={i}
                    count={certs.length}
                    itemLabel="certificate"
                    onMoveUp={() => onChange((prev) => moveItem(prev, i, i - 1))}
                    onMoveDown={() => onChange((prev) => moveItem(prev, i, i + 1))}
                    onDelete={() => onChange((prev) => removeItem(prev, i))}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => onChange((prev) => [...prev, { code: "", title: "", image: "" }])}
          >
            <Plus />
            Add certificate
          </Button>
        </div>
      </Panel>
    </>
  );
}
