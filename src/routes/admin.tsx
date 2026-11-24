import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";

import { Dashboard } from "@/components/admin/Dashboard";
import { Login } from "@/components/admin/Login";
import { resolveUpdater, type SectionId, type StorageMode, type UpdateFn } from "@/components/admin/types";
import type { SiteContent } from "@/lib/content";
import {
  adminLogout,
  getAdminSession,
  getSiteContent,
  listVersions,
  saveSiteContent,
} from "@/lib/content.functions";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin | JAK Industries" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

type Phase = "checking" | "login" | "editing";

async function loadEditorData(): Promise<{ content: SiteContent; lastSaved: string | null }> {
  const [content, versions] = await Promise.all([getSiteContent(), listVersions().catch(() => null)]);
  const newest = versions?.ok ? (versions.versions[0]?.savedAt ?? null) : null;
  return { content, lastSaved: newest };
}

function AdminPage() {
  const [phase, setPhase] = useState<Phase>("checking");
  const [storage, setStorage] = useState<StorageMode>("none");
  const [draft, setDraft] = useState<SiteContent | null>(null);
  const [saved, setSaved] = useState<SiteContent | null>(null);
  const [section, setSection] = useState<SectionId>("overview");
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  const dirty = draft !== null && saved !== null && JSON.stringify(draft) !== JSON.stringify(saved);

  // Check the session once on mount. If logged in, load the content into the editor.
  useEffect(() => {
    let active = true;
    getAdminSession()
      .then(async (session) => {
        if (!active) return;
        setStorage(session.storage);
        if (!session.loggedIn) {
          setPhase("login");
          return;
        }
        const data = await loadEditorData();
        if (!active) return;
        setDraft(data.content);
        setSaved(data.content);
        setLastSaved(data.lastSaved);
        setPhase("editing");
      })
      .catch(() => {
        if (!active) return;
        setPhase("login");
        toast.error("Could not reach the server. Please refresh the page.");
      });
    return () => {
      active = false;
    };
  }, []);

  // Warn before closing the tab while there are unsaved changes.
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  async function handleSave() {
    if (!draft || !dirty || saving) return;
    const snapshot = draft;
    setSaving(true);
    try {
      const result = await saveSiteContent({ data: { content: snapshot } });
      if (result.ok) {
        setSaved(snapshot);
        if (result.savedAt) setLastSaved(result.savedAt);
        toast.success(
          storage === "local"
            ? "Saved to local test files. The live site is not updated in this mode."
            : "Changes saved. They are live on the website now.",
        );
      } else {
        toast.error(result.error ?? "Your changes could not be saved. Please try again.");
      }
    } catch {
      toast.error("Your changes could not be saved. Check your connection and try again.");
    } finally {
      setSaving(false);
    }
  }

  // Ctrl+S (or Cmd+S) saves while the editor is open.
  useEffect(() => {
    if (phase !== "editing") return;
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        void handleSave();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [phase, draft, saved, saving]);

  async function handleLoggedIn() {
    try {
      const data = await loadEditorData();
      setDraft(data.content);
      setSaved(data.content);
      setLastSaved(data.lastSaved);
      setPhase("editing");
    } catch {
      toast.error("You are signed in, but the content could not be loaded. Please refresh the page.");
    }
  }

  async function handleLogout() {
    if (dirty && !window.confirm("You have unsaved changes. Log out and discard them?")) return;
    try {
      await adminLogout();
    } catch {
      // Clear the editor even if the request fails; the cookie expires on its own.
    }
    setDraft(null);
    setSaved(null);
    setPhase("login");
    toast.success("You have been logged out.");
  }

  function handleRestored(content: SiteContent) {
    setDraft(content);
    setSaved(content);
    setLastSaved(new Date().toISOString());
  }

  const update: UpdateFn = (key, value) => {
    setDraft((current) => (current ? { ...current, [key]: resolveUpdater(value, current[key]) } : current));
  };

  if (phase === "checking") {
    return (
      <div className="grid min-h-screen place-items-center bg-background text-foreground">
        <p role="status" className="flex items-center gap-3 text-sm text-muted-foreground">
          <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden="true" />
          Loading the admin panel...
        </p>
      </div>
    );
  }

  if (phase === "login" || draft === null) {
    return <Login storage={storage} onLoggedIn={handleLoggedIn} />;
  }

  return (
    <Dashboard
      draft={draft}
      dirty={dirty}
      saving={saving}
      storage={storage}
      lastSaved={lastSaved}
      section={section}
      onSectionChange={setSection}
      update={update}
      onSave={() => void handleSave()}
      onLogout={() => void handleLogout()}
      onRestoreBackup={(content) => setDraft(content)}
      onRestored={handleRestored}
    />
  );
}
