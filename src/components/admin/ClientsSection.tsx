import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Client } from "@/lib/content";

import { Field, Panel, SectionHeading } from "./Field";
import { ImageInput } from "./ImageInput";
import { ListControls, moveItem, removeItem } from "./ListControls";
import type { Setter } from "./types";

type ClientsSectionProps = {
  clients: Client[];
  onChange: Setter<Client[]>;
};

export function ClientsSection({ clients, onChange }: ClientsSectionProps) {
  const patch = (index: number, change: Partial<Client>) =>
    onChange((prev) => prev.map((client, j) => (j === index ? { ...client, ...change } : client)));

  return (
    <>
      <SectionHeading
        title="Customers"
        description="The customer logos shown on the site. Use a logo on a plain background for the best result."
      />

      <Panel>
        {clients.length === 0 ? <p className="mb-6 text-sm text-muted-foreground">No customers yet.</p> : null}

        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {clients.map((client, i) => (
            <li key={i} className="flex flex-col gap-4 rounded-2xl border border-border bg-background p-4">
              <ImageInput
                value={client.logo}
                alt={`${client.name || "Customer"} logo`}
                aspect="logo"
                onChange={(url) => patch(i, { logo: url })}
                buttonLabel="Replace logo"
              />
              <Field id={`client-${i}-name`} label="Customer name">
                <Input
                  id={`client-${i}-name`}
                  type="text"
                  maxLength={150}
                  value={client.name}
                  onChange={(event) => patch(i, { name: event.target.value })}
                />
              </Field>
              <div className="flex justify-end">
                <ListControls
                  index={i}
                  count={clients.length}
                  itemLabel="customer"
                  onMoveUp={() => onChange((prev) => moveItem(prev, i, i - 1))}
                  onMoveDown={() => onChange((prev) => moveItem(prev, i, i + 1))}
                  onDelete={() => onChange((prev) => removeItem(prev, i))}
                />
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => onChange((prev) => [...prev, { name: "", logo: "" }])}
          >
            <Plus />
            Add customer
          </Button>
        </div>
      </Panel>
    </>
  );
}
