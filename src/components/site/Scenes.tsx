import { lazy, Suspense, useState } from "react";
import { ClientOnly } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

const TurbineScene = lazy(() => import("@/components/three/TurbineScene"));
const GearScene = lazy(() => import("@/components/three/GearScene"));

export function TurbineCanvas({ className }: { className?: string }) {
  const [ready, setReady] = useState(false);
  return (
    <div className={cn("transition-opacity duration-[1500ms]", ready ? "opacity-100" : "opacity-0", className)} data-scene-ready={ready ? "" : undefined}>
      <ClientOnly fallback={null}>
        <Suspense fallback={null}>
          <TurbineScene onReady={() => setReady(true)} />
        </Suspense>
      </ClientOnly>
    </div>
  );
}

export function GearCanvas({ className }: { className?: string }) {
  return (
    <div className={className}>
      <ClientOnly fallback={null}>
        <Suspense fallback={null}>
          <GearScene />
        </Suspense>
      </ClientOnly>
    </div>
  );
}
