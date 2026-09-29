"use client";

import { MapPin } from "lucide-react";
import { Icon360 } from "@/components/ui/Icon360";
import { Photo } from "@/components/ui/Photo";
import { media } from "@/data/media";
import type { Boat } from "@/types/boat";
import { useBoatTour } from "./BoatTourProvider";

/**
 * Janela de entrada do tour na primeira tela ("facade"): leve, sem carregar
 * o Matterport até a pessoa decidir entrar. Bom para quem chega do Instagram,
 * WhatsApp ou Meta Ads com 4G.
 */
export function TourPreview({ boat }: { boat: Boat }) {
  const { openTour } = useBoatTour();

  return (
    <button
      type="button"
      onClick={() => openTour()}
      aria-label={`Entrar a bordo: abrir o tour 360° da ${boat.name}`}
      className="group relative block aspect-[4/4.3] w-full overflow-hidden rounded-[28px] bg-navy-900 text-left text-white shadow-[0_40px_80px_-40px_rgb(6_43_85/0.7)] sm:aspect-[16/11] lg:aspect-auto lg:h-[min(76vh,720px)]"
    >
      <Photo
        image={media.bay}
        fill
        loading="eager"
        fetchPriority="high"
        sizes="(min-width: 1024px) 58vw, 100vw"
        className="animate-drift object-cover"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/10 to-navy-950/30" />

      {/* Topo */}
      <div className="absolute inset-x-4 top-4 flex items-start justify-between gap-3 sm:inset-x-6 sm:top-6">
        <span className="inline-flex items-center gap-2 rounded-full bg-navy-950/55 py-1.5 pr-3.5 pl-2.5 text-xs font-semibold tracking-wide backdrop-blur-md">
          <Icon360 className="w-7 text-sea-300" />
          Tour demonstrativo
        </span>
        <span className="hidden items-center gap-1.5 rounded-full bg-navy-950/55 px-3 py-1.5 text-xs font-medium backdrop-blur-md sm:inline-flex">
          <MapPin className="size-3.5 text-sea-300" aria-hidden="true" />
          Baía de Todos os Santos
        </span>
      </div>

      {/* Centro */}
      <span className="absolute inset-0 grid place-items-center" aria-hidden="true">
        <span className="flex flex-col items-center gap-4">
          <span className="relative grid size-24 place-items-center sm:size-28">
            <span className="absolute inset-0 animate-ripple rounded-full border-2 border-white/60" />
            <span className="absolute inset-0 animate-ripple rounded-full border-2 border-white/60 [animation-delay:1.3s]" />
            <span className="grid size-full place-items-center rounded-full bg-white/15 ring-1 ring-white/50 backdrop-blur-md transition-transform duration-300 group-hover:scale-105">
              <Icon360 className="w-12 text-white sm:w-14" />
            </span>
          </span>
          <span className="rounded-full bg-white px-5 py-2.5 text-sm font-bold tracking-[0.08em] text-navy-900 uppercase shadow-lg transition-colors group-hover:bg-sea-50">
            Entrar a bordo
          </span>
        </span>
      </span>

      {/* Base */}
      <div className="absolute inset-x-4 bottom-4 sm:inset-x-6 sm:bottom-6">
        <p className="text-lg font-bold tracking-tight sm:text-xl">{boat.name}</p>
        <p className="text-sm text-white/80">{boat.length} · Tour 360°</p>
        {boat.isDemo && (
          <p className="mt-2 max-w-md text-xs text-white/65">
            Tour demonstrativo. A versão final utilizará imagens reais das embarcações Uboatt.
          </p>
        )}
      </div>
    </button>
  );
}
