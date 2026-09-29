"use client";

import { Hand } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { readSessionFlag, sessionFlags, writeSessionFlag } from "@/lib/storage";

type Phase = "hidden" | "in" | "out";

/**
 * "Arraste para olhar ao redor" por ~3 s, uma vez por sessão (sessionStorage).
 * Não bloqueia o toque no tour (pointer-events: none).
 */
export function GestureHint({ active }: { active: boolean }) {
  const [phase, setPhase] = useState<Phase>("hidden");

  useEffect(() => {
    if (!active || readSessionFlag(sessionFlags.gestureHintSeen)) return;
    const timers = [
      window.setTimeout(() => {
        writeSessionFlag(sessionFlags.gestureHintSeen);
        setPhase("in");
      }, 450),
      window.setTimeout(() => setPhase("out"), 3450),
      window.setTimeout(() => setPhase("hidden"), 4000),
    ];
    return () => timers.forEach(window.clearTimeout);
  }, [active]);

  if (phase === "hidden") return null;
  const visible = phase === "in" && active;

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 grid place-items-center">
      <div
        className={cn(
          "flex flex-col items-center gap-3 rounded-3xl bg-navy-950/60 px-7 py-5 text-white backdrop-blur-md transition-opacity duration-500",
          visible ? "animate-scale-in opacity-100" : "opacity-0",
        )}
      >
        <Hand className="size-10 animate-swipe" strokeWidth={1.6} />
        <p className="text-[15px] font-semibold">Arraste para olhar ao redor</p>
      </div>
    </div>
  );
}
