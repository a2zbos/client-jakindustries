import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

type ListControlsProps = {
  index: number;
  count: number;
  itemLabel: string;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
};

/** Returns a new array with the item moved. Returns the same array when the move is not possible. */
export function moveItem<T>(list: T[], from: number, to: number): T[] {
  if (from === to || from < 0 || from >= list.length || to < 0 || to >= list.length) return list;
  const item = list[from];
  if (item === undefined) return list;
  const next = list.filter((_, i) => i !== from);
  next.splice(to, 0, item);
  return next;
}

export function removeItem<T>(list: T[], index: number): T[] {
  return list.filter((_, i) => i !== index);
}

export function ListControls({ index, count, itemLabel, onMoveUp, onMoveDown, onDelete }: ListControlsProps) {
  return (
    <div className="flex shrink-0 items-center gap-1">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onMoveUp}
        disabled={index <= 0}
        aria-label={`Move ${itemLabel} up`}
        title="Move up"
      >
        <ArrowUp />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onMoveDown}
        disabled={index >= count - 1}
        aria-label={`Move ${itemLabel} down`}
        title="Move down"
      >
        <ArrowDown />
      </Button>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={`Delete ${itemLabel}`}
            title="Delete"
            className="text-destructive hover:text-destructive"
          >
            <Trash2 />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="rounded-2xl bg-background">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this {itemLabel}?</AlertDialogTitle>
            <AlertDialogDescription>
              It will be removed from the list. Nothing changes on the live site until you press Save changes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep it</AlertDialogCancel>
            <AlertDialogAction
              onClick={onDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
