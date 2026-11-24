import { Input } from "@/components/ui/input";
import type { Company } from "@/lib/content";

import { Field, Panel, PanelTitle, SectionHeading } from "./Field";
import { StringListEditor } from "./StringListEditor";
import type { Setter } from "./types";
import { resolveUpdater } from "./types";

type CompanySectionProps = {
  company: Company;
  onChange: Setter<Company>;
};

export function CompanySection({ company, onChange }: CompanySectionProps) {
  const patch = (change: Partial<Company>) => onChange((prev) => ({ ...prev, ...change }));

  return (
    <>
      <SectionHeading
        title="Company & contact"
        description="The phone numbers, email and address visitors use to reach you."
      />

      <div className="flex flex-col gap-6">
        <Panel>
          <PanelTitle title="Phone and email" description="These appear on the Contact page and in the footer." />
          <div className="grid gap-6 md:grid-cols-2">
            <Field id="company-phone-mobile" label="Mobile phone" hint="Shown with a tap-to-call link on phones.">
              <Input
                id="company-phone-mobile"
                type="tel"
                value={company.phoneMobile}
                onChange={(event) => patch({ phoneMobile: event.target.value })}
              />
            </Field>
            <Field id="company-phone-office" label="Office phone" hint="The main office landline.">
              <Input
                id="company-phone-office"
                type="tel"
                value={company.phoneOffice}
                onChange={(event) => patch({ phoneOffice: event.target.value })}
              />
            </Field>
            <Field id="company-email" label="Email address" className="md:col-span-2" hint="Enquiries sent here will reach your inbox.">
              <Input
                id="company-email"
                type="email"
                value={company.email}
                onChange={(event) => patch({ email: event.target.value })}
              />
            </Field>
          </div>
        </Panel>

        <Panel>
          <PanelTitle
            title="Office address"
            description="One line per row, for example the building, the street, the area and the city. Shown on the Contact page."
          />
          <StringListEditor
            id="company-office"
            items={company.office}
            onChange={(next) => onChange((prev) => ({ ...prev, office: resolveUpdater(next, prev.office) }))}
            itemLabel="Address line"
            addLabel="Add address line"
            placeholder="For example: 28/A, New Street"
            emptyText="No address lines yet."
            maxLength={200}
          />
        </Panel>

        <Panel>
          <PanelTitle
            title="Advanced"
            description="Technical setting for the contact form. Only change this if your web developer asks you to."
          />
          <Field id="company-form-endpoint" label="Contact form endpoint (advanced)">
            <Input
              id="company-form-endpoint"
              type="url"
              value={company.formEndpoint}
              onChange={(event) => patch({ formEndpoint: event.target.value })}
            />
          </Field>
        </Panel>
      </div>
    </>
  );
}
