"use client";

import { Info } from "lucide-react";
import { Sheet, useSheet } from "@/components/ui/Sheet";
import { buttonClass } from "@/components/ui/button";
import type { Boat, BoatSpace } from "@/types/boat";
import { spaceIcons } from "./icons";

interface BoatDetailsDrawerProps {
  boat: Boat;
  open: boolean;
  inTour: boolean;
  onClose: () => void;
  onEnterTour: () => void;
  onPlan: () => void;
}

/** Drawer lateral no desktop / bottom sheet no mobile. Também é a alternativa em texto ao tour. */
export function BoatDetailsDrawer({ boat, open, inTour, onClose, onEnterTour, onPlan }: BoatDetailsDrawerProps) {
  const spaces = boat.detailSpaceIds
    .map((id) => boat.spaces.find((space) => space.id === id))
    .filter((space): space is BoatSpace => Boolean(space));

  return (
    <Sheet
      open={open}
      onClose={onClose}
      eyebrow={boat.isDemo ? "Tour demonstrativo" : "Embarcação"}
      title={boat.name}
      footer={<DetailsFooter inTour={inTour} onEnterTour={onEnterTour} onPlan={onPlan} />}
    >
      {boat.isDemo && (
        <div className="flex gap-3 rounded-2xl bg-sea-50 p-4 text-[15px] ring-1 ring-sea-100">
          <Info className="mt-0.5 size-5 shrink-0 text-ocean-500" aria-hidden="true" />
          <p>
            Esta embarcação está sendo utilizada apenas para demonstrar a experiência 360. Na versão final, este espaço será
            substituído pelas embarcações disponíveis na Uboatt.
          </p>
        </div>
      )}

      <dl className="mt-5 grid grid-cols-3 gap-2">
        <div className="rounded-2xl bg-mist p-3">
          <dt className="text-xs text-ink-500">Comprimento</dt>
          <dd className="mt-0.5 font-semibold">{boat.length}</dd>
        </div>
        <div className="rounded-2xl bg-mist p-3">
          <dt className="text-xs text-ink-500">Capacidade</dt>
          <dd className="mt-0.5 font-semibold">{boat.capacity ? `${boat.capacity} pessoas` : "A confirmar"}</dd>
        </div>
        <div className="rounded-2xl bg-mist p-3">
          <dt className="text-xs text-ink-500">Tour</dt>
          <dd className="mt-0.5 font-semibold">360°</dd>
        </div>
      </dl>

      <h3 className="mt-7 text-xs font-semibold tracking-[0.14em] text-ink-500 uppercase">Conheça os espaços</h3>
      <ul className="mt-3 space-y-2">
        {spaces.map((space) => {
          const Icon = spaceIcons[space.icon];
          return (
            <li key={space.id} className="flex gap-3.5 rounded-2xl border border-line p-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-sea-50 text-ocean-500">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="font-semibold">{space.name}</h4>
                  {boat.isDemo && (
                    <span className="rounded-full bg-mist px-2 py-0.5 text-[11px] font-semibold text-ink-500">Exemplo</span>
                  )}
                </div>
                <p className="mt-0.5 text-[15px] text-ink-600">{space.description}</p>
                {space.tip && (
                  <p className="mt-1.5 text-sm text-ocean-700">
                    <span className="font-semibold">O que observar:</span> {space.tip}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      <p className="mt-4 text-xs text-ink-500">
        Dados demonstrativos. As informações de cada embarcação virão do cadastro da Uboatt.
      </p>
    </Sheet>
  );
}

function DetailsFooter({ inTour, onEnterTour, onPlan }: { inTour: boolean; onEnterTour: () => void; onPlan: () => void }) {
  const { close } = useSheet();
  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => {
          close();
          if (!inTour) onEnterTour();
        }}
        className={buttonClass({ variant: "outline", className: "flex-1 px-3" })}
      >
        {inTour ? "Voltar ao tour" : "Entrar a bordo"}
      </button>
      <button type="button" onClick={onPlan} className={buttonClass({ variant: "primary", className: "flex-1 px-3" })}>
        Planejar passeio
      </button>
    </div>
  );
}
