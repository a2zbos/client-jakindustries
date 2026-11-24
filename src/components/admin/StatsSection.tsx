import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { Stat } from "@/lib/content";

import { Field, SectionHeading } from "./Field";
import type { Setter } from "./types";

type StatsSectionProps = {
  stats: Stat[];
  onChange: Setter<Stat[]>;
};

export function StatsSection({ stats, onChange }: StatsSectionProps) {
  const patchStat = (index: number, change: Partial<Stat>) =>
    onChange((prev) => prev.map((stat, j) => (j === index ? { ...stat, ...change } : stat)));

  return (
    <>
      <SectionHeading
        title="Key numbers"
        description="The four large figures shown on the home page. Each one has a number, an optional suffix and a short label."
      />

      <ul className="grid gap-6 md:grid-cols-2">
        {stats.map((stat, i) => {
          const heading = stat.label || `Number ${i + 1}`;
          return (
            <li key={i} className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h2 className="font-display text-lg font-semibold text-foreground">{heading}</h2>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field id={`stat-${i}-value`} label="Number" hint="Use digits only, for example 2004.">
                  <Input
                    id={`stat-${i}-value`}
                    type="number"
                    inputMode="numeric"
                    value={stat.value}
                    onChange={(event) => {
                      const parsed = parseFloat(event.target.value);
                      patchStat(i, { value: Number.isNaN(parsed) ? 0 : parsed });
                    }}
                  />
                </Field>
                <Field id={`stat-${i}-suffix`} label="Suffix" hint="Text shown after the number, such as + or %. Leave empty for none.">
                  <Input
                    id={`stat-${i}-suffix`}
                    type="text"
                    maxLength={10}
                    value={stat.suffix}
                    onChange={(event) => patchStat(i, { suffix: event.target.value })}
                  />
                </Field>
              </div>

              <Field id={`stat-${i}-label`} label="Label" hint="The short description under the number.">
                <Input
                  id={`stat-${i}-label`}
                  type="text"
                  maxLength={100}
                  value={stat.label}
                  onChange={(event) => patchStat(i, { label: event.target.value })}
                />
              </Field>

              <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-background p-4">
                <div className="flex flex-col gap-1">
                  <Label htmlFor={`stat-${i}-plain`} className="text-sm font-medium text-foreground">
                    Show as a plain year
                  </Label>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Turn on for a year such as 1986, so the number is shown as it is and not counted up.
                  </p>
                </div>
                <Switch
                  id={`stat-${i}-plain`}
                  checked={stat.plain === true}
                  onCheckedChange={(value) => patchStat(i, { plain: value })}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
