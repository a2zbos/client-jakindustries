import { Panel, PanelTitle, SectionHeading } from "./Field";
import { StringListEditor } from "./StringListEditor";
import type { Setter } from "./types";

type WpsSectionProps = {
  items: string[];
  onChange: Setter<string[]>;
};

export function WpsSection({ items, onChange }: WpsSectionProps) {
  return (
    <>
      <SectionHeading
        title="Welding procedures"
        description="The welding procedure specifications (WPS) you are qualified for. Each line is one item in the list on the Certifications page."
      />

      <Panel>
        <PanelTitle title="Procedures" description="Add, reorder or remove lines. Keep each line short and clear." />
        <StringListEditor
          id="wps"
          items={items}
          onChange={onChange}
          itemLabel="Procedure"
          addLabel="Add procedure"
          placeholder="For example: WPS for carbon steel plate"
          emptyText="No welding procedures listed yet."
          maxLength={300}
        />
      </Panel>
    </>
  );
}
