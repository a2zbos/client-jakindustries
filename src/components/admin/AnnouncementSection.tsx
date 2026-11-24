import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { Announcement } from "@/lib/content";

import { Field, Panel, PanelTitle, SectionHeading } from "./Field";
import type { Setter } from "./types";

const MAX_TEXT = 140;

type AnnouncementSectionProps = {
  announcement: Announcement;
  onChange: Setter<Announcement>;
};

export function AnnouncementSection({ announcement, onChange }: AnnouncementSectionProps) {
  const patch = (change: Partial<Announcement>) => onChange((prev) => ({ ...prev, ...change }));
  const { enabled, text, linkLabel, linkUrl } = announcement;

  return (
    <>
      <SectionHeading
        title="Announcement"
        description="A short message that appears as a small pill in the bottom-left corner of every public page. Use it for news, offers or closures."
      />

      <div className="flex flex-col gap-6">
        <Panel>
          <PanelTitle title="Show the announcement" />
          <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-background p-4">
            <div className="flex flex-col gap-1">
              <Label htmlFor="announcement-enabled" className="text-sm font-medium text-foreground">
                Show announcement on the site
              </Label>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Turn this off to hide the message without deleting it.
              </p>
            </div>
            <Switch
              id="announcement-enabled"
              checked={enabled}
              onCheckedChange={(value) => patch({ enabled: value })}
            />
          </div>

          <div className="mt-6 grid gap-6">
            <Field
              id="announcement-text"
              label="Message"
              hint={`${text.length} of ${MAX_TEXT} characters used. Keep it short so it fits on a phone.`}
            >
              <Input
                id="announcement-text"
                type="text"
                maxLength={MAX_TEXT}
                value={text}
                onChange={(event) => patch({ text: event.target.value })}
              />
            </Field>

            <div className="grid gap-6 md:grid-cols-2">
              <Field id="announcement-link-label" label="Link text (optional)" hint="For example: Contact us.">
                <Input
                  id="announcement-link-label"
                  type="text"
                  maxLength={60}
                  value={linkLabel}
                  onChange={(event) => patch({ linkLabel: event.target.value })}
                />
              </Field>
              <Field
                id="announcement-link-url"
                label="Link address (optional)"
                hint="Start with / for a page on this site, such as /contact. For other websites, paste the full address that starts with https://."
              >
                <Input
                  id="announcement-link-url"
                  type="text"
                  maxLength={300}
                  value={linkUrl}
                  onChange={(event) => patch({ linkUrl: event.target.value })}
                />
              </Field>
            </div>
          </div>
        </Panel>

        <Panel>
          <PanelTitle title="Preview" description="This is roughly how the message will look to visitors." />
          <div className="rounded-2xl border border-border bg-muted/40 p-6">
            <div className="inline-flex max-w-full items-center gap-3 rounded-full border border-border bg-card/90 px-4 py-2 text-sm text-foreground shadow-sm backdrop-blur">
              <span className="min-w-0 truncate">{text || "Your message appears here"}</span>
              {linkLabel ? <span className="shrink-0 font-semibold text-primary">{linkLabel}</span> : null}
            </div>
            {!enabled ? (
              <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                The message is hidden on the site until you turn the switch on.
              </p>
            ) : null}
          </div>
        </Panel>
      </div>
    </>
  );
}
