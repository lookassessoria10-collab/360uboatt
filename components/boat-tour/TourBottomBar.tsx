"use client";

import { CalendarDays, EyeOff, Info, Route } from "lucide-react";
import { buttonClass, tabButtonClass } from "@/components/ui/button";
import type { Boat } from "@/types/boat";
import { ShareButton } from "./ShareButton";

interface TourBottomBarProps {
  boat: Boat;
  guidedActive: boolean;
  onGuided: () => void;
  onFree: () => void;
  onDetails: () => void;
  onPlan: () => void;
}

function DemoChip() {
  return (
    <span className="inline-flex h-6 items-center rounded-full bg-white/10 px-2.5 text-[11px] font-semibold tracking-wide text-sea-200 uppercase">
      Tour demonstrativo
    </span>
  );
}

/** Barra inferior: estilo app no mobile (perto do polegar), barra flutuante no desktop. */
export function TourBottomBar({ boat, guidedActive, onGuided, onFree, onDetails, onPlan }: TourBottomBarProps) {
  return (
    <div className="shrink-0 bg-navy-950 text-white">
      {/* Mobile / tablet */}
      <div className="px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] xl:hidden">
        <p className="flex items-center justify-center gap-2 px-2 pb-2 text-xs text-white/70">
          <span className="font-semibold text-white">{boat.name}</span>
          <span aria-hidden="true">·</span>
          <span>{boat.length}</span>
          {boat.isDemo && <DemoChip />}
        </p>
        <nav aria-label="Ações do tour" className="mx-auto grid max-w-xl grid-cols-5 gap-1">
          <button type="button" onClick={onGuided} aria-pressed={guidedActive} aria-label="Fazer tour guiado" className={tabButtonClass({ active: guidedActive })}>
            <Route className="size-[22px]" aria-hidden="true" />
            Guiado
          </button>
          <button type="button" onClick={onDetails} aria-label="Detalhes da embarcação" className={tabButtonClass()}>
            <Info className="size-[22px]" aria-hidden="true" />
            Detalhes
          </button>
          <button type="button" onClick={onFree} aria-label="Explorar livremente, sem interface" className={tabButtonClass()}>
            <EyeOff className="size-[22px]" aria-hidden="true" />
            Livre
          </button>
          <ShareButton variant="tab" label="Mandar" />
          <button type="button" onClick={onPlan} aria-label="Planejar passeio" className={tabButtonClass({ primary: true })}>
            <CalendarDays className="size-[22px]" aria-hidden="true" />
            Planejar
          </button>
        </nav>
      </div>

      {/* Desktop */}
      <div className="hidden px-4 pt-1 pb-4 xl:block">
        <div className="flex items-center justify-between gap-6 rounded-2xl bg-navy-900 px-5 py-3 ring-1 ring-white/10">
          <div className="min-w-0">
            <p className="flex items-center gap-2.5 whitespace-nowrap">
              <span className="font-semibold">{boat.name}</span>
              <span className="text-white/50" aria-hidden="true">
                ·
              </span>
              <span className="text-white/80">{boat.length}</span>
              {boat.isDemo && <DemoChip />}
            </p>
            {boat.isDemo && (
              <p className="mt-0.5 truncate text-xs text-white/55">
                Tour demonstrativo. A versão final utilizará imagens reais das embarcações Uboatt.
              </p>
            )}
          </div>
          <nav aria-label="Ações do tour" className="flex shrink-0 items-center gap-2">
            <button type="button" onClick={onGuided} aria-pressed={guidedActive} className={buttonClass({ variant: "ghostDark", size: "sm", className: guidedActive ? "bg-white/20" : undefined })}>
              <Route className="size-4" aria-hidden="true" />
              Fazer tour guiado
            </button>
            <button type="button" onClick={onFree} className={buttonClass({ variant: "ghostDark", size: "sm" })}>
              <EyeOff className="size-4" aria-hidden="true" />
              Explorar livremente
            </button>
            <button type="button" onClick={onDetails} className={buttonClass({ variant: "ghostDark", size: "sm" })}>
              <Info className="size-4" aria-hidden="true" />
              Detalhes
            </button>
            <ShareButton variant="outlineDark" size="sm" />
            <button type="button" onClick={onPlan} className={buttonClass({ variant: "primary", size: "sm" })}>
              <CalendarDays className="size-4" aria-hidden="true" />
              Planejar passeio
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
