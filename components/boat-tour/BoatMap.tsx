"use client";

import { ArrowRight } from "lucide-react";
import { useId, useState } from "react";
import { cn } from "@/lib/cn";
import type { BoatMapZone, BoatSpace } from "@/types/boat";
import { useBoatTour } from "./BoatTourProvider";
import { EnterTourButton } from "./TourActions";

/** Faixas horizontais de cada zona no desenho (viewBox 0–1000). */
const ZONE_BOUNDS: Record<BoatMapZone["id"], [number, number]> = {
  popa: [0, 260],
  cockpit: [260, 520],
  cabine: [520, 760],
  proa: [760, 1000],
};

const HULL =
  "M60 64 L560 56 C760 56 900 92 984 150 C900 208 760 244 560 244 L60 236 Q48 236 48 224 L48 76 Q48 64 60 64 Z";
const DECK =
  "M76 82 L556 74 C738 74 860 104 938 150 C860 196 738 226 556 226 L76 218 Q66 218 66 208 L66 92 Q66 82 76 82 Z";

/** Desenho estilizado (vista de cima) — não é planta técnica. */
function BoatHull({ highlight, className }: { highlight?: BoatMapZone["id"] | null; className?: string }) {
  const clipId = `hull-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const bounds = highlight ? ZONE_BOUNDS[highlight] : null;

  return (
    <svg viewBox="0 0 1000 300" className={cn("block h-auto w-full", className)} aria-hidden="true">
      <defs>
        <clipPath id={clipId}>
          <path d={HULL} />
          <rect x="16" y="84" width="34" height="132" rx="8" />
        </clipPath>
      </defs>

      {/* Água */}
      <g fill="none" stroke="#A9DCF3" strokeWidth="2" strokeLinecap="round" opacity="0.8">
        <path d="M-10 30c40 0 40-10 80-10s40 10 80 10" />
        <path d="M820 280c40 0 40-10 80-10s40 10 80 10" />
        <path d="M300 286c30 0 30-8 60-8s30 8 60 8" />
        <path d="M640 20c30 0 30-8 60-8s30 8 60 8" />
      </g>

      {/* Casco */}
      <rect x="16" y="84" width="34" height="132" rx="8" fill="#FFFFFF" stroke="#062B55" strokeOpacity="0.25" strokeWidth="2.5" />
      <path d={HULL} fill="#FFFFFF" stroke="#062B55" strokeOpacity="0.28" strokeWidth="2.5" />

      {bounds && (
        <g clipPath={`url(#${clipId})`}>
          <rect x={bounds[0]} y="0" width={bounds[1] - bounds[0]} height="300" fill="#24A9E0" opacity="0.2" />
        </g>
      )}

      <path d={DECK} fill="none" stroke="#168BC5" strokeOpacity="0.35" strokeWidth="2" />

      {/* Divisões das áreas */}
      <g clipPath={`url(#${clipId})`} stroke="#062B55" strokeOpacity="0.18" strokeWidth="2" strokeDasharray="6 8">
        <line x1="260" y1="0" x2="260" y2="300" />
        <line x1="520" y1="0" x2="520" y2="300" />
        <line x1="760" y1="0" x2="760" y2="300" />
      </g>

      <g fill="#EEF8FD" stroke="#168BC5" strokeOpacity="0.55" strokeWidth="2">
        {/* Popa: solário e escada da plataforma */}
        <rect x="90" y="106" width="140" height="88" rx="18" />
        <line x1="26" y1="128" x2="40" y2="128" />
        <line x1="26" y1="150" x2="40" y2="150" />
        <line x1="26" y1="172" x2="40" y2="172" />
        {/* Cockpit: sofá em L, mesa e posto de comando */}
        <rect x="284" y="178" width="160" height="26" rx="10" />
        <rect x="284" y="98" width="26" height="106" rx="10" />
        <rect x="334" y="120" width="70" height="44" rx="12" />
        <rect x="452" y="90" width="38" height="34" rx="9" />
        <circle cx="500" cy="150" r="11" fill="none" />
        {/* Cabine: para-brisa e escotilha */}
        <path d="M532 84 Q552 150 532 216" fill="none" />
        <rect x="590" y="112" width="120" height="76" rx="18" />
        <line x1="600" y1="150" x2="700" y2="150" />
        {/* Proa: solário de proa e paiol */}
        <path d="M784 110 L876 120 Q910 150 876 180 L784 190 Q774 150 784 110 Z" />
        <circle cx="944" cy="150" r="6" />
      </g>
    </svg>
  );
}

interface BoatMapProps {
  zones: BoatMapZone[];
  spaces: BoatSpace[];
  /** "mini" = só visual, com uma área destacada (tour guiado). */
  variant?: "full" | "mini";
  highlight?: BoatMapZone["id"] | null;
  defaultZone?: BoatMapZone["id"];
  className?: string;
}

/**
 * Mapa da embarcação: POPA · COCKPIT · CABINE · PROA.
 *
 * Cada área carrega um `TourTarget` (sceneId, yaw, pitch). No Matterport
 * público ainda não há Sweep IDs, então o botão só explica a área e abre o
 * tour; no Marzipano, o mesmo botão já leva direto para a cena.
 */
export function BoatMap({ zones, spaces, variant = "full", highlight, defaultZone = "cockpit", className }: BoatMapProps) {
  if (variant === "mini") {
    return <BoatHull highlight={highlight} className={className} />;
  }
  return <InteractiveBoatMap zones={zones} spaces={spaces} defaultZone={defaultZone} className={className} />;
}

function InteractiveBoatMap({
  zones,
  spaces,
  defaultZone,
  className,
}: {
  zones: BoatMapZone[];
  spaces: BoatSpace[];
  defaultZone: BoatMapZone["id"];
  className?: string;
}) {
  const { boat } = useBoatTour();
  const [selectedId, setSelectedId] = useState<BoatMapZone["id"]>(defaultZone);
  const panelId = useId();
  const selected = zones.find((zone) => zone.id === selectedId) ?? zones[0];
  const space = spaces.find((item) => item.id === selected?.spaceId);
  const index = zones.findIndex((zone) => zone.id === selected?.id);
  const canJump = boat.tourMode === "marzipano";

  return (
    <div className={className}>
      <div className="rounded-[28px] bg-sea-50 px-3 pt-6 pb-3 ring-1 ring-sea-100 sm:px-8 sm:pt-10 sm:pb-6">
        <div className="relative mx-auto max-w-5xl pb-14">
          <BoatHull highlight={selected?.id} />
          <div role="group" aria-label="Áreas da embarcação">
            {zones.map((zone) => {
              const [start, end] = ZONE_BOUNDS[zone.id];
              const active = zone.id === selected?.id;
              return (
                <button
                  key={zone.id}
                  type="button"
                  aria-pressed={active}
                  aria-controls={panelId}
                  data-scene-id={zone.target?.sceneId}
                  data-yaw={zone.target?.yaw}
                  data-pitch={zone.target?.pitch}
                  onClick={() => setSelectedId(zone.id)}
                  style={{ left: `${start / 10}%`, width: `${(end - start) / 10}%` }}
                  className="group absolute inset-y-0 flex items-end justify-center rounded-2xl transition-colors hover:bg-sea-400/[0.07]"
                >
                  <span
                    className={cn(
                      "mb-1 rounded-full px-2.5 py-1.5 text-[11px] font-bold tracking-[0.08em] uppercase transition-colors sm:px-3.5 sm:text-xs sm:tracking-[0.12em]",
                      active ? "bg-navy-900 text-white" : "bg-white text-navy-900 ring-1 ring-line group-hover:ring-sea-300",
                    )}
                  >
                    {zone.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div id={panelId} aria-live="polite" className="mt-4 rounded-3xl bg-white p-5 ring-1 ring-line sm:p-6">
        {selected && space && (
          <div key={selected.id} className="animate-fade-in sm:flex sm:items-end sm:justify-between sm:gap-8">
            <div className="max-w-xl">
              <p className="text-xs font-semibold tracking-[0.14em] text-ocean-700 uppercase">
                Área {index + 1} de {zones.length}
              </p>
              <h3 className="mt-1 text-xl font-bold tracking-tight">{selected.label}</h3>
              <p className="mt-1.5 text-ink-600">{space.description}</p>
              {space.tip && (
                <p className="mt-3 text-[15px] text-navy-900">
                  <span className="font-semibold">O que observar:</span> {space.tip}
                </p>
              )}
              <p className="mt-3 text-xs text-ink-500">
                {canJump
                  ? "Este botão leva direto para este ambiente do tour."
                  : "Na versão final, este botão levará direto para este ambiente do tour."}
              </p>
            </div>
            <EnterTourButton target={selected.target} variant="navy" className="mt-4 w-full sm:mt-0 sm:w-auto">
              {canJump ? `Ir para ${selected.label.toLowerCase()}` : "Entrar a bordo"}
              <ArrowRight className="size-[18px]" aria-hidden="true" />
            </EnterTourButton>
          </div>
        )}
      </div>
    </div>
  );
}
