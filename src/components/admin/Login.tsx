import { useState, type FormEvent } from "react";
import { LoaderCircle, TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { adminLogin } from "@/lib/content.functions";

import { Field } from "./Field";
import type { StorageMode } from "./types";

type LoginProps = {
  storage: StorageMode;
  onLoggedIn: () => Promise<void>;
};

export function Login({ storage, onLoggedIn }: LoginProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setError(null);
    setPending(true);
    try {
      const result = await adminLogin({ data: { password } });
      if (!result.ok) {
        setError(result.error ?? "That password is not correct. Please try again.");
        return;
      }
      await onLoggedIn();
    } catch {
      setError("Could not reach the server. Please check your connection and try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-background px-5 py-12 text-foreground">
      <Card className="w-full max-w-md rounded-3xl border-border bg-card p-8 shadow-sm md:p-10">
        <img
          src="/jak/logo-jak.png"
          alt="JAK Industries"
          width={351}
          height={69}
          className="h-9 w-auto box-content rounded-lg dark:bg-white dark:px-2.5 dark:py-1.5"
        />
        <h1 className="mt-8 font-display text-2xl font-semibold tracking-tight text-foreground">
          Sign in to edit the site
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Enter the admin password you were given. Only people with this password can change the website.
        </p>

        {storage === "none" ? (
          <div
            role="status"
            className="mt-6 flex gap-3 rounded-xl border border-border bg-muted p-4 text-sm leading-relaxed text-foreground"
          >
            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            <span>
              Saving will not work until the site storage is connected in the hosting dashboard. You can still sign in
              and look around.
            </span>
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
          <Field id="admin-password" label="Password">
            <Input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? "admin-login-error" : undefined}
            />
          </Field>

          {error ? (
            <p id="admin-login-error" role="alert" className="text-sm font-medium text-destructive">
              {error}
            </p>
          ) : null}

          <Button type="submit" size="lg" className="w-full rounded-full" disabled={pending}>
            {pending ? <LoaderCircle className="animate-spin" /> : null}
            {pending ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
