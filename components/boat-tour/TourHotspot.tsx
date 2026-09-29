"use client";

import { ArrowUp, Plus } from "lucide-react";
import { useId, useState } from "react";
import { cn } from "@/lib/cn";
import type { TourHotspot as TourHotspotData } from "@/types/tour";

/**
 * Visual dos hotspots da versão Marzipano.
 * O ponto (yaw, pitch) fica no centro do círculo.
 */
export function TourHotspot({ hotspot, onNavigate }: { hotspot: TourHotspotData; onNavigate?: (sceneId: string) => void }) {
  return hotspot.type === "navigation" ? (
    <NavigationHotspot hotspot={hotspot} onNavigate={onNavigate} />
  ) : (
    <InfoHotspot hotspot={hotspot} />
  );
}

/** Navegação: seta + rótulo ("Ir para a proa", "Entrar na cabine"). */
export function NavigationHotspot({ hotspot, onNavigate }: { hotspot: TourHotspotData; onNavigate?: (sceneId: string) => void }) {
  return (
    <div className="relative -translate-x-1/2 -translate-y-1/2">
      <button
        type="button"
        onClick={() => hotspot.targetScene && onNavigate?.(hotspot.targetScene)}
        className="group relative flex size-12 items-center justify-center rounded-full bg-white text-navy-900 shadow-[0_8px_24px_-6px_rgb(4_28_56/0.6)] ring-4 ring-white/30 transition-transform hover:scale-105"
      >
        <span aria-hidden="true" className="absolute inset-0 animate-ripple rounded-full ring-2 ring-white/80" />
        <ArrowUp className="size-5" strokeWidth={2.4} aria-hidden="true" />
        <span className="absolute top-full left-1/2 mt-2 -translate-x-1/2 rounded-full bg-navy-950/80 px-3 py-1 text-xs font-semibold whitespace-nowrap text-white backdrop-blur">
          {hotspot.label}
        </span>
      </button>
    </div>
  );
}

/** Informação: "+" que abre um pequeno card. O texto vem do cadastro da embarcação. */
export function InfoHotspot({ hotspot }: { hotspot: TourHotspotData }) {
  const [open, setOpen] = useState(false);
  const cardId = useId();

  return (
    <div className="relative -translate-x-1/2 -translate-y-1/2">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={cardId}
        aria-label={hotspot.label}
        onClick={() => setOpen((value) => !value)}
        className="grid size-11 place-items-center rounded-full bg-sea-400 text-navy-950 shadow-[0_8px_24px_-6px_rgb(4_28_56/0.6)] ring-4 ring-sea-400/30 transition-transform hover:scale-105"
      >
        <Plus className={cn("size-5 transition-transform duration-300", open && "rotate-45")} strokeWidth={2.6} aria-hidden="true" />
      </button>
      <div
        id={cardId}
        hidden={!open}
        className="absolute top-full left-1/2 z-10 mt-3 w-60 -translate-x-1/2 animate-fade-up rounded-2xl bg-white p-4 text-left text-navy-900 shadow-2xl"
      >
        <p className="font-semibold">{hotspot.label}</p>
        <p className="mt-1 text-sm text-ink-600">
          {hotspot.description ?? "Informação preenchida a partir do cadastro desta embarcação."}
        </p>
      </div>
    </div>
  );
}
