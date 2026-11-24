import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Unit } from "@/lib/content";

import { Field, Panel, PanelTitle, SectionHeading } from "./Field";
import type { Setter } from "./types";

type UnitsSectionProps = {
  units: Unit[];
  onChange: Setter<Unit[]>;
};

type UnitKey = keyof Unit;

const UNIT_FIELDS: { key: UnitKey; label: string; hint?: string; multiline?: boolean }[] = [
  { key: "name", label: "Unit name" },
  { key: "address", label: "Address", hint: "Full postal address, as visitors should see it.", multiline: true },
  { key: "open", label: "Open area", hint: "Describe the open yard space." },
  { key: "covered", label: "Covered area", hint: "Describe the covered shop space." },
  { key: "power", label: "Power", hint: "Power supply available at this unit." },
  { key: "genset", label: "Generator (genset)", hint: "Standby generator details, if any." },
  {
    key: "map",
    label: "Map search text",
    hint: "Used to find this unit on Google Maps. Usually the company name and city.",
  },
];

export function UnitsSection({ units, onChange }: UnitsSectionProps) {
  const patch = (index: number, key: UnitKey, value: string) =>
    onChange((prev) => prev.map((unit, j) => (j === index ? { ...unit, [key]: value } : unit)));

  return (
    <>
      <SectionHeading
        title="Units"
        description="The factory and office units shown on the Contact and About pages. Each unit has its own details below."
      />

      <div className="flex flex-col gap-6">
        {units.map((unit, i) => (
          <Panel key={i}>
            <PanelTitle title={unit.name || `Unit ${i + 1}`} />
            <div className="grid gap-6 md:grid-cols-2">
              {UNIT_FIELDS.map((field) => {
                const id = `unit-${i}-${field.key}`;
                const value = unit[field.key];
                const className = field.multiline ? "md:col-span-2" : undefined;
                return (
                  <Field key={field.key} id={id} label={field.label} hint={field.hint} className={className}>
                    {field.multiline ? (
                      <Textarea
                        id={id}
                        rows={3}
                        maxLength={500}
                        value={value}
                        onChange={(event) => patch(i, field.key, event.target.value)}
                      />
                    ) : (
                      <Input
                        id={id}
                        type="text"
                        maxLength={300}
                        value={value}
                        onChange={(event) => patch(i, field.key, event.target.value)}
                      />
                    )}
                  </Field>
                );
              })}
            </div>
          </Panel>
        ))}
        {units.length === 0 ? <p className="text-sm text-muted-foreground">No units listed.</p> : null}
      </div>
    </>
  );
}
