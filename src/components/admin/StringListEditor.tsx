import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Setter } from "./types";
import { ListControls, moveItem, removeItem } from "./ListControls";

type StringListEditorProps = {
  id: string;
  items: string[];
  onChange: Setter<string[]>;
  itemLabel: string;
  addLabel: string;
  placeholder?: string;
  emptyText?: string;
  maxLength?: number;
};

export function StringListEditor({
  id,
  items,
  onChange,
  itemLabel,
  addLabel,
  placeholder,
  emptyText = "Nothing here yet.",
  maxLength = 300,
}: StringListEditorProps) {
  return (
    <div className="flex flex-col gap-4">
      {items.length === 0 ? <p className="text-sm text-muted-foreground">{emptyText}</p> : null}
      <ul className="flex flex-col gap-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            <Label htmlFor={`${id}-${i}`} className="sr-only">
              {itemLabel} {i + 1}
            </Label>
            <Input
              id={`${id}-${i}`}
              value={item}
              placeholder={placeholder}
              maxLength={maxLength}
              className="min-w-0 flex-1"
              onChange={(event) => {
                const value = event.target.value;
                onChange((prev) => prev.map((entry, j) => (j === i ? value : entry)));
              }}
            />
            <ListControls
              index={i}
              count={items.length}
              itemLabel={itemLabel}
              onMoveUp={() => onChange((prev) => moveItem(prev, i, i - 1))}
              onMoveDown={() => onChange((prev) => moveItem(prev, i, i + 1))}
              onDelete={() => onChange((prev) => removeItem(prev, i))}
            />
          </li>
        ))}
      </ul>
      <div>
        <Button type="button" variant="outline" onClick={() => onChange((prev) => [...prev, ""])}>
          <Plus />
          {addLabel}
        </Button>
      </div>
    </div>
  );
}
