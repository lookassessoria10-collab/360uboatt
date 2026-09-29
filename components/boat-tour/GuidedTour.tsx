"use client";

import { ChevronDown, ChevronLeft, ChevronRight, Route, X } from "lucide-react";
import { useId, useState } from "react";
import { buttonClass } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import type { BoatMapZone, BoatSpace, GuidedStep } from "@/types/boat";
import { BoatMap } from "./BoatMap";

interface GuidedTourProps {
  steps: GuidedStep[];
  zones: BoatMapZone[];
  spaces: BoatSpace[];
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
  onComplete: () => void;
  /** true no Marzipano: cada etapa troca a cena. No Matterport público, só muda o texto. */
  controlsViewer: boolean;
}

const pad = (value: number) => String(value).padStart(2, "0");

/** Tour guiado: 01 Área externa · 02 Cockpit · 03 Cabine · 04 Proa. */
export function GuidedTour({ steps, zones, spaces, index, onIndexChange, onClose, onComplete, controlsViewer }: GuidedTourProps) {
  const [collapsed, setCollapsed] = useState(false);
  const titleId = useId();
  const bodyId = useId();
  const step = steps[index];
  if (!step) return null;
  const total = steps.length;
  const isLast = index === total - 1;

  return (
    <section
      aria-labelledby={titleId}
      className="absolute inset-x-2 bottom-2 z-20 animate-fade-up rounded-3xl bg-white text-navy-900 shadow-[0_24px_60px_-20px_rgb(4_28_56/0.65)] sm:inset-x-auto sm:bottom-4 sm:left-4 sm:w-[390px]"
    >
      <div className="flex items-center justify-between gap-2 pt-2 pr-2 pl-4 sm:pl-5">
        <h2 id={titleId} className="flex items-center gap-2 text-sm font-semibold">
          <Route className="size-4 text-ocean-500" aria-hidden="true" />
          Tour guiado
          <span className="font-medium text-ink-500 tabular-nums">
            · {index + 1} de {total}
          </span>
        </h2>
        <div className="flex items-center">
          <button
            type="button"
            aria-expanded={!collapsed}
            aria-controls={bodyId}
            aria-label={collapsed ? "Expandir tour guiado" : "Recolher tour guiado"}
            onClick={() => setCollapsed((value) => !value)}
            className="grid size-11 place-items-center rounded-full text-navy-900 hover:bg-mist"
          >
            <ChevronDown className={cn("size-5 transition-transform duration-300", collapsed && "rotate-180")} aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Fechar tour guiado"
            onClick={onClose}
            className="grid size-11 place-items-center rounded-full text-navy-900 hover:bg-mist"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Etapas + barra de progresso */}
      <ol className="grid gap-1.5 px-4 sm:px-5" style={{ gridTemplateColumns: `repeat(${total}, minmax(0, 1fr))` }}>
        {steps.map((item, itemIndex) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => onIndexChange(itemIndex)}
              aria-current={itemIndex === index ? "step" : undefined}
              aria-label={`Etapa ${itemIndex + 1}: ${item.title}`}
              className="block w-full rounded-full py-2"
            >
              <span
                className={cn(
                  "block h-1.5 rounded-full transition-colors duration-300",
                  itemIndex <= index ? "bg-sea-400" : "bg-navy-900/10",
                )}
              />
            </button>
          </li>
        ))}
      </ol>

      <div id={bodyId} aria-live="polite" className="px-4 sm:px-5">
        {collapsed ? (
          <p className="pt-1 text-[15px] font-semibold">
            <span className="text-ocean-500 tabular-nums">{pad(index + 1)}</span> {step.title}
          </p>
        ) : (
          <div key={step.id} className="animate-fade-in pt-1">
            <div className="flex gap-3">
              <span className="text-[28px] leading-none font-extrabold text-sea-400 tabular-nums">{pad(index + 1)}</span>
              <div className="min-w-0">
                <h3 className="text-lg leading-tight font-bold tracking-tight">{step.title}</h3>
                <p className="mt-1 text-[15px] text-ink-600">{step.text}</p>
              </div>
            </div>
            {step.tip && (
              <p className="mt-3 rounded-2xl bg-sea-50 px-3.5 py-2.5 text-sm">
                <span className="font-semibold">O que observar:</span> {step.tip}
              </p>
            )}
            <BoatMap variant="mini" zones={zones} spaces={spaces} highlight={step.zoneId} className="mx-auto mt-3 max-w-[300px] max-sm:hidden" />
            {!controlsViewer && (
              <p className="mt-2 text-xs text-ink-500">Demonstração: caminhe até esta área tocando nos círculos do chão.</p>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-2 px-4 pt-3 pb-4 sm:px-5">
        <button
          type="button"
          onClick={() => onIndexChange(index - 1)}
          disabled={index === 0}
          className={buttonClass({ variant: "outline", size: "sm", className: "flex-1" })}
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
          Anterior
        </button>
        <button
          type="button"
          onClick={() => (isLast ? onComplete() : onIndexChange(index + 1))}
          className={buttonClass({ variant: "navy", size: "sm", className: "flex-1" })}
        >
          {isLast ? "Concluir" : "Próximo"}
          <ChevronRight className="size-4" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
