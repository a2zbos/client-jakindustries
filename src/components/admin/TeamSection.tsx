import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { TeamMember } from "@/lib/content";

import { Field, Panel, PanelTitle, SectionHeading } from "./Field";
import { ImageInput } from "./ImageInput";
import { ListControls, moveItem, removeItem } from "./ListControls";
import type { Setter } from "./types";

type TeamSectionProps = {
  team: TeamMember[];
  onChange: Setter<TeamMember[]>;
};

export function TeamSection({ team, onChange }: TeamSectionProps) {
  const patch = (index: number, change: Partial<TeamMember>) =>
    onChange((prev) => prev.map((member, j) => (j === index ? { ...member, ...change } : member)));

  return (
    <>
      <SectionHeading
        title="Team"
        description="The people shown on the About page. Use a clear, friendly photo of each person."
      />

      <Panel>
        <PanelTitle title="Team members" description="Arrange them in the order they should appear." />
        {team.length === 0 ? <p className="mb-6 text-sm text-muted-foreground">No team members yet.</p> : null}

        <ul className="grid gap-4 md:grid-cols-2">
          {team.map((member, i) => (
            <li key={i} className="flex flex-col gap-4 rounded-2xl border border-border bg-background p-4 sm:flex-row">
              <div className="w-full sm:w-40 sm:shrink-0">
                <ImageInput
                  value={member.photo}
                  alt={member.name || `Team member ${i + 1}`}
                  aspect="photo"
                  onChange={(url) => patch(i, { photo: url })}
                />
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-4">
                <Field id={`team-${i}-name`} label="Name">
                  <Input
                    id={`team-${i}-name`}
                    type="text"
                    maxLength={120}
                    value={member.name}
                    onChange={(event) => patch(i, { name: event.target.value })}
                  />
                </Field>
                <Field id={`team-${i}-role`} label="Role">
                  <Input
                    id={`team-${i}-role`}
                    type="text"
                    maxLength={120}
                    value={member.role}
                    onChange={(event) => patch(i, { role: event.target.value })}
                  />
                </Field>
                <div className="mt-auto flex justify-end">
                  <ListControls
                    index={i}
                    count={team.length}
                    itemLabel="team member"
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
            onClick={() => onChange((prev) => [...prev, { name: "", role: "", photo: "" }])}
          >
            <Plus />
            Add team member
          </Button>
        </div>
      </Panel>
    </>
  );
}
