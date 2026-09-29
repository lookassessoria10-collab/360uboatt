"use client";

import { Maximize2, Minimize2, X } from "lucide-react";
import { UboattLogo } from "@/components/brand/UboattLogo";
import { Icon360 } from "@/components/ui/Icon360";
import { PrototypeBadge } from "./PrototypeBadge";

interface TourHeaderProps {
  onClose: () => void;
  fullscreen: { supported: boolean; isFullscreen: boolean; toggle: () => void };
}

export function TourHeader({ onClose, fullscreen }: TourHeaderProps) {
  return (
    <header className="flex min-h-14 shrink-0 items-center justify-between gap-2 bg-navy-950 pt-[env(safe-area-inset-top)] pr-2 pl-3 text-white sm:min-h-16 sm:pr-4 sm:pl-5">
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <UboattLogo tone="light" compact priority className="h-8 sm:hidden" />
        <UboattLogo tone="light" priority className="h-9 max-sm:hidden" />
        <span aria-hidden="true" className="hidden h-6 w-px bg-white/15 sm:block" />
        <span className="flex items-center gap-1.5 text-sm font-semibold">
          <Icon360 className="w-7 text-sea-300" />
          <span className="sr-only sm:not-sr-only">Tour 360</span>
        </span>
        <PrototypeBadge tone="dark" />
      </div>

      <div className="flex shrink-0 items-center gap-1">
        {fullscreen.supported && (
          <button
            type="button"
            onClick={fullscreen.toggle}
            aria-label={fullscreen.isFullscreen ? "Sair da tela cheia" : "Ver em tela cheia"}
            aria-pressed={fullscreen.isFullscreen}
            className="grid size-11 place-items-center rounded-full text-white/85 transition-colors hover:bg-white/10 hover:text-white"
          >
            {fullscreen.isFullscreen ? (
              <Minimize2 className="size-5" aria-hidden="true" />
            ) : (
              <Maximize2 className="size-5" aria-hidden="true" />
            )}
          </button>
        )}
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar tour"
          className="flex h-11 items-center gap-1.5 rounded-full bg-white/10 pr-4 pl-3 text-sm font-semibold transition-colors hover:bg-white/20"
        >
          <X className="size-5" aria-hidden="true" />
          Fechar
        </button>
      </div>
    </header>
  );
}
