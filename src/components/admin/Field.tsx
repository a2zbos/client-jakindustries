import type { ReactNode } from "react";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type FieldProps = {
  id: string;
  label: string;
  hint?: string | undefined;
  className?: string | undefined;
  children: ReactNode;
};

/** A label, the control passed as children (give it the same id), and optional helper text. */
export function Field({ id, label, hint, className, children }: FieldProps) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-2", className)}>
      <Label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </Label>
      {children}
      {hint ? <p className="text-xs leading-relaxed text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

type PanelProps = { children: ReactNode; className?: string };

export function Panel({ children, className }: PanelProps) {
  return (
    <Card className={cn("rounded-2xl border-border bg-card p-6 shadow-sm md:p-8", className)}>{children}</Card>
  );
}

type PanelTitleProps = { title: string; description?: string };

export function PanelTitle({ title, description }: PanelTitleProps) {
  return (
    <div className="mb-6 flex flex-col gap-1">
      <h2 className="font-display text-lg font-semibold text-foreground">{title}</h2>
      {description ? <p className="text-sm leading-relaxed text-muted-foreground">{description}</p> : null}
    </div>
  );
}

type SectionHeadingProps = { title: string; description: string };

export function SectionHeading({ title, description }: SectionHeadingProps) {
  return (
    <div className="mb-8 flex flex-col gap-3">
      <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground md:text-4xl">{title}</h1>
      <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">{description}</p>
    </div>
  );
}

export function formatDateTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}
