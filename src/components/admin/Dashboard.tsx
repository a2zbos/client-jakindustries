import {
  BadgeCheck,
  Award,
  Building2,
  ExternalLink,
  Flame,
  Handshake,
  Hash,
  History,
  HeartHandshake,
  Images,
  LayoutDashboard,
  LogOut,
  Megaphone,
  MapPin,
  LoaderCircle,
  Save,
  Users,
  type LucideIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { SiteContent } from "@/lib/content";
import { cn } from "@/lib/utils";

import { AnnouncementSection } from "./AnnouncementSection";
import { CertsSection } from "./CertsSection";
import { ClientsSection } from "./ClientsSection";
import { CompanySection } from "./CompanySection";
import { CsrSection } from "./CsrSection";
import { HistorySection } from "./HistorySection";
import { OverviewSection } from "./OverviewSection";
import { ProductPhotosSection } from "./ProductPhotosSection";
import { StatsSection } from "./StatsSection";
import { TeamSection } from "./TeamSection";
import { UnitsSection } from "./UnitsSection";
import { WpsSection } from "./WpsSection";
import type { SectionId, StorageMode, UpdateFn } from "./types";

type SectionItem = { id: SectionId; label: string; icon: LucideIcon };

const SECTIONS: SectionItem[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "company", label: "Company & contact", icon: Building2 },
  { id: "announcement", label: "Announcement", icon: Megaphone },
  { id: "stats", label: "Key numbers", icon: Hash },
  { id: "jakCerts", label: "JAK certificates", icon: BadgeCheck },
  { id: "ladcoCerts", label: "LADCO certificates", icon: Award },
  { id: "wps", label: "Welding procedures", icon: Flame },
  { id: "clients", label: "Customers", icon: Handshake },
  { id: "team", label: "Team", icon: Users },
  { id: "units", label: "Units", icon: MapPin },
  { id: "productPhotos", label: "Product photos", icon: Images },
  { id: "csr", label: "Society contribution", icon: HeartHandshake },
  { id: "history", label: "History", icon: History },
];

export type DashboardProps = {
  draft: SiteContent;
  dirty: boolean;
  saving: boolean;
  storage: StorageMode;
  lastSaved: string | null;
  section: SectionId;
  onSectionChange: (id: SectionId) => void;
  update: UpdateFn;
  onSave: () => void;
  onLogout: () => void;
  onRestoreBackup: (content: SiteContent) => void;
  onRestored: (content: SiteContent) => void;
};

export function Dashboard({
  draft,
  dirty,
  saving,
  storage,
  lastSaved,
  section,
  onSectionChange,
  update,
  onSave,
  onLogout,
  onRestoreBackup,
  onRestored,
}: DashboardProps) {
  function renderSection() {
    switch (section) {
      case "overview":
        return (
          <OverviewSection
            draft={draft}
            storage={storage}
            lastSaved={lastSaved}
            onRestoreBackup={onRestoreBackup}
          />
        );
      case "company":
        return <CompanySection company={draft.company} onChange={(value) => update("company", value)} />;
      case "announcement":
        return (
          <AnnouncementSection
            announcement={draft.announcement}
            onChange={(value) => update("announcement", value)}
          />
        );
      case "stats":
        return <StatsSection stats={draft.stats} onChange={(value) => update("stats", value)} />;
      case "jakCerts":
        return (
          <CertsSection
            title="JAK certificates"
            description="Certificates shown on the Certifications page. Upload a clear picture of each certificate."
            idPrefix="jak-cert"
            certs={draft.isoCerts}
            onChange={(value) => update("isoCerts", value)}
          />
        );
      case "ladcoCerts":
        return (
          <CertsSection
            title="LADCO certificates"
            description="Certificates shown on the LADCO Galvanizers page. Upload a clear picture of each certificate."
            idPrefix="ladco-cert"
            certs={draft.ladcoCerts}
            onChange={(value) => update("ladcoCerts", value)}
          />
        );
      case "wps":
        return <WpsSection items={draft.wps} onChange={(value) => update("wps", value)} />;
      case "clients":
        return <ClientsSection clients={draft.clients} onChange={(value) => update("clients", value)} />;
      case "team":
        return <TeamSection team={draft.team} onChange={(value) => update("team", value)} />;
      case "units":
        return <UnitsSection units={draft.units} onChange={(value) => update("units", value)} />;
      case "productPhotos":
        return (
          <ProductPhotosSection photos={draft.productPhotos} onChange={(value) => update("productPhotos", value)} />
        );
      case "csr":
        return (
          <CsrSection
            activities={draft.csrActivities}
            onActivitiesChange={(value) => update("csrActivities", value)}
            gallery={draft.csrGallery}
            onGalleryChange={(value) => update("csrGallery", value)}
          />
        );
      case "history":
        return <HistorySection hasUnsaved={dirty} onRestored={onRestored} />;
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 md:h-16 md:flex-nowrap md:px-8 md:py-0">
          <div className="flex min-w-0 items-center gap-3">
            <img
              src="/jak/logo-jak.png"
              alt="JAK Industries"
              width={351}
              height={69}
              className="h-7 w-auto box-content rounded-md dark:bg-white dark:px-2 dark:py-1"
            />
            <span className="hidden truncate font-display text-sm font-semibold text-foreground sm:block">
              Website admin
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {dirty ? (
              <Badge variant="outline" role="status" className="gap-2 rounded-full px-3 py-1 text-xs text-foreground">
                <span className="h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
                <span className="hidden sm:inline">Unsaved changes</span>
                <span className="sm:hidden">Unsaved</span>
              </Badge>
            ) : null}
            <Button
              type="button"
              onClick={onSave}
              disabled={!dirty || saving}
              className="rounded-full"
              title="Save changes (Ctrl+S)"
            >
              {saving ? <LoaderCircle className="animate-spin" /> : <Save />}
              {saving ? "Saving..." : "Save changes"}
            </Button>
            <Button asChild variant="outline" className="rounded-full">
              <a href="/" target="_blank" rel="noopener noreferrer" aria-label="View site (opens in a new tab)">
                <ExternalLink />
                <span className="hidden sm:inline">View site</span>
              </a>
            </Button>
            <Button type="button" variant="ghost" onClick={onLogout} aria-label="Log out" className="rounded-full">
              <LogOut />
              <span className="hidden sm:inline">Log out</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-col md:flex-row">
        <nav
          aria-label="Admin sections"
          className="flex gap-2 overflow-x-auto border-b border-border px-5 py-3 md:sticky md:top-16 md:h-[calc(100vh-4rem)] md:w-64 md:shrink-0 md:flex-col md:overflow-y-auto md:border-b-0 md:border-r md:px-4 md:py-6"
        >
          {SECTIONS.map((item) => {
            const Icon = item.icon;
            const active = item.id === section;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSectionChange(item.id)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex shrink-0 items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="whitespace-nowrap">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <main className="min-w-0 flex-1 px-5 py-8 md:px-10 md:py-12">
          <div className="mx-auto max-w-4xl">{renderSection()}</div>
        </main>
      </div>
    </div>
  );
}
