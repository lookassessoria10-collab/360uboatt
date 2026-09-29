"use client";

import { Compass, Route, Smartphone, X } from "lucide-react";
import { useId } from "react";
import { cn } from "@/lib/cn";

interface TourStartCardProps {
  stepsCount: number;
  onGuided: () => void;
  onFree: () => void;
  onDismiss: () => void;
  /** Só no modo Marzipano, em aparelhos com sensor de movimento. */
  motion?: { enabled: boolean; onToggle: () => void };
}

/** Preparação: logo que o tour abre, sugere como explorar. */
export function TourStartCard({ stepsCount, onGuided, onFree, onDismiss, motion }: TourStartCardProps) {
  const titleId = useId();

  return (
    <section
      aria-labelledby={titleId}
      className="absolute inset-x-2 bottom-2 z-20 mx-auto max-w-md animate-fade-up rounded-3xl bg-white p-4 text-navy-900 shadow-[0_24px_60px_-20px_rgb(4_28_56/0.65)] sm:bottom-4 sm:p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-[0.14em] text-ocean-700 uppercase">Você está a bordo</p>
          <h2 id={titleId} className="mt-0.5 text-lg font-bold tracking-tight">
            Como quer conhecer a lancha?
          </h2>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Fechar sugestão e explorar"
          className="-mt-1 -mr-1 grid size-11 shrink-0 place-items-center rounded-full hover:bg-mist"
        >
          <X className="size-5" aria-hidden="true" />
        </button>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={onGuided}
          className="flex min-h-[92px] flex-col items-start justify-between gap-3 rounded-2xl bg-navy-900 p-3.5 text-left text-white transition-colors hover:bg-navy-800"
        >
          <Route className="size-5 text-sea-300" aria-hidden="true" />
          <span>
            <span className="block text-[15px] leading-tight font-semibold">Fazer tour guiado</span>
            <span className="mt-0.5 block text-xs text-white/70">{stepsCount} paradas pela lancha</span>
          </span>
        </button>
        <button
          type="button"
          onClick={onFree}
          className="flex min-h-[92px] flex-col items-start justify-between gap-3 rounded-2xl bg-mist p-3.5 text-left ring-1 ring-line transition-colors hover:bg-sea-50"
        >
          <Compass className="size-5 text-ocean-500" aria-hidden="true" />
          <span>
            <span className="block text-[15px] leading-tight font-semibold">Explorar livremente</span>
            <span className="mt-0.5 block text-xs text-ink-500">Só você e o tour</span>
          </span>
        </button>
      </div>

      {motion && (
        <button
          type="button"
          onClick={motion.onToggle}
          aria-pressed={motion.enabled}
          className={cn(
            "mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-2xl text-sm font-semibold ring-1 transition-colors",
            motion.enabled ? "bg-sea-50 text-navy-900 ring-sea-200" : "ring-line hover:bg-mist",
          )}
        >
          <Smartphone className="size-4 text-ocean-500" aria-hidden="true" />
          {motion.enabled ? "Movimento do celular ativado" : "Mover com o celular"}
        </button>
      )}
    </section>
  );
}
