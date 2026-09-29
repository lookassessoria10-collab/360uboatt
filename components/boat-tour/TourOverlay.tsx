"use client";

import { Eye, Smartphone } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/cn";
import { readSessionFlag, sessionFlags, writeSessionFlag } from "@/lib/storage";
import { useDeviceOrientationPermission } from "@/lib/useDeviceOrientation";
import { useFullscreen } from "@/lib/useFullscreen";
import type { Boat } from "@/types/boat";
import type { TourTarget, ViewerStatus } from "@/types/tour";
import type { PlannerEntry } from "./CTAPlanner";
import { CTAInviteCard } from "./CTAPlanner";
import { GestureHint } from "./GestureHint";
import { GuidedTour } from "./GuidedTour";
import { TourBottomBar } from "./TourBottomBar";
import { TourHeader } from "./TourHeader";
import { TourStartCard } from "./TourStartCard";
import { TourViewer } from "./TourViewer";

/** Depois de quanto tempo explorando o convite "Gostou do que viu?" aparece. */
const INVITE_AFTER_MS = 35_000;
/** Tempo mínimo no tour para considerar que a pessoa explorou. */
const EXPLORED_AFTER_MS = 15_000;

export interface TourExitSummary {
  explored: boolean;
}

type Card = "start" | "guided" | "invite" | null;

interface TourOverlayProps {
  boat: Boat;
  initialTarget?: TourTarget;
  simulateError?: boolean;
  onRequestClose: () => void;
  /** Chamado quando o tour é desmontado (X, Esc ou botão "voltar" do celular). */
  onExit: (summary: TourExitSummary) => void;
  onOpenDetails: () => void;
  onPlan: (entry: PlannerEntry) => void;
  onFallback: () => void;
}

/**
 * Modo imersivo. A interface Uboatt fica ao redor do viewer (header e barra
 * inferior), sem tocar no conteúdo cross-origin do Matterport.
 */
export function TourOverlay({
  boat,
  initialTarget,
  simulateError,
  onRequestClose,
  onExit,
  onOpenDetails,
  onPlan,
  onFallback,
}: TourOverlayProps) {
  const toast = useToast();
  const fullscreen = useFullscreen();
  const motion = useDeviceOrientationPermission();
  const [status, setStatus] = useState<ViewerStatus>("loading");
  const [uiHidden, setUiHidden] = useState(false);
  const [card, setCard] = useState<Card>(null);
  const [interacted, setInteracted] = useState(false);
  const [guidedIndex, setGuidedIndex] = useState(0);
  const [target, setTarget] = useState<TourTarget | undefined>(initialTarget);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const session = useRef({ readyAt: null as number | null, startShown: false, guidedDone: false });

  const isMarzipano = boat.tourMode === "marzipano";
  const steps = boat.guidedSteps;
  const { exit: exitFullscreen } = fullscreen;

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  // Relata a saída (inclusive pelo "voltar" do navegador) e sai da tela cheia.
  useEffect(() => {
    const state = session.current;
    return () => {
      void exitFullscreen();
      const exploredLongEnough = state.readyAt !== null && Date.now() - state.readyAt > EXPLORED_AFTER_MS;
      onExit({ explored: state.guidedDone || exploredLongEnough });
    };
  }, [exitFullscreen, onExit]);

  const handleStatusChange = useCallback((next: ViewerStatus) => {
    setStatus(next);
    if (next !== "ready") return;
    session.current.readyAt ??= Date.now();
    if (!session.current.startShown) {
      session.current.startShown = true;
      setCard((current) => current ?? "start");
    }
  }, []);

  const handleInteract = useCallback(() => {
    setInteracted(true);
    setCard((current) => (current === "start" ? null : current));
  }, []);

  // Convite "Gostou do que viu?" depois de um tempo explorando (uma vez por sessão).
  useEffect(() => {
    if (status !== "ready" || card !== null || uiHidden || readSessionFlag(sessionFlags.ctaShown)) return;
    const readyAt = session.current.readyAt ?? Date.now();
    const wait = Math.max(4_000, INVITE_AFTER_MS - (Date.now() - readyAt));
    const timer = window.setTimeout(() => {
      writeSessionFlag(sessionFlags.ctaShown);
      setCard("invite");
    }, wait);
    return () => window.clearTimeout(timer);
  }, [status, card, uiHidden]);

  // Esc: volta a interface, fecha o cartão aberto ou sai do tour.
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || document.querySelector("dialog.sheet[open]")) return;
      if (uiHidden) setUiHidden(false);
      else if (card) setCard(null);
      else onRequestClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [uiHidden, card, onRequestClose]);

  const goToStep = (index: number) => {
    const bounded = Math.min(Math.max(index, 0), steps.length - 1);
    setGuidedIndex(bounded);
    setTarget(steps[bounded]?.target);
  };

  const toggleGuided = () => {
    if (card === "guided") {
      setCard(null);
      return;
    }
    setCard("guided");
    goToStep(session.current.guidedDone ? 0 : guidedIndex);
  };

  const completeGuided = () => {
    session.current.guidedDone = true;
    writeSessionFlag(sessionFlags.ctaShown);
    setCard("invite");
  };

  const enterFreeMode = () => {
    setCard(null);
    setUiHidden(true);
  };

  const toggleMotion = async () => {
    if (motion.enabled) {
      motion.disable();
      return;
    }
    const granted = await motion.request();
    toast(granted ? "Movimento ativado. Mova o celular para olhar ao redor." : "Não foi possível usar o movimento do celular.", granted ? "success" : "info");
  };

  const motionControl = isMarzipano && motion.supported ? { enabled: motion.enabled, onToggle: toggleMotion } : undefined;
  const viewerTitle = `Tour 360° da embarcação ${boat.name}${boat.isDemo ? " (demonstração externa)" : ""}`;

  return (
    <dialog
      open
      data-tour=""
      aria-modal="true"
      aria-labelledby="tour-title"
      className="fixed inset-0 z-50 m-0 flex h-dvh max-h-none w-full max-w-none animate-scale-in flex-col overflow-hidden border-0 bg-navy-950 p-0 text-white"
    >
      <h1 id="tour-title" ref={headingRef} tabIndex={-1} className="sr-only">
        {viewerTitle}
      </h1>

      <button
        type="button"
        onClick={onOpenDetails}
        className="sr-only z-40 rounded-full bg-white px-4 py-2 font-semibold text-navy-900 focus:not-sr-only focus:absolute focus:top-3 focus:left-1/2 focus:-translate-x-1/2"
      >
        Ver os espaços da embarcação em texto
      </button>

      {!uiHidden && <TourHeader onClose={onRequestClose} fullscreen={fullscreen} />}

      <div className="relative min-h-0 flex-1">
        {isMarzipano ? (
          <TourViewer
            mode="marzipano"
            scenes={boat.tour.marzipano?.scenes ?? []}
            initialSceneId={boat.tour.marzipano?.initialSceneId}
            target={target}
            motionEnabled={motion.enabled}
            title={viewerTitle}
            onStatusChange={handleStatusChange}
            onInteract={handleInteract}
            onFallback={onFallback}
          />
        ) : (
          <TourViewer
            mode="matterport"
            source={boat.tour.matterport?.modelId ?? ""}
            params={boat.tour.matterport?.params}
            simulateError={simulateError}
            title={viewerTitle}
            onStatusChange={handleStatusChange}
            onInteract={handleInteract}
            onFallback={onFallback}
          />
        )}

        <GestureHint active={status === "ready" && !interacted} />

        {!uiHidden && status === "ready" && (
          <>
            {card === "start" && (
              <TourStartCard
                stepsCount={steps.length}
                onGuided={toggleGuided}
                onFree={enterFreeMode}
                onDismiss={() => setCard(null)}
                motion={motionControl}
              />
            )}
            {card === "guided" && (
              <GuidedTour
                steps={steps}
                zones={boat.mapZones}
                spaces={boat.spaces}
                index={guidedIndex}
                onIndexChange={goToStep}
                onClose={() => setCard(null)}
                onComplete={completeGuided}
                controlsViewer={isMarzipano}
              />
            )}
            {card === "invite" && (
              <CTAInviteCard
                onPlan={() => {
                  setCard(null);
                  onPlan("form");
                }}
                onDismiss={() => setCard(null)}
              />
            )}
            {motionControl && card !== "start" && (
              <button
                type="button"
                onClick={motionControl.onToggle}
                aria-pressed={motionControl.enabled}
                aria-label={motionControl.enabled ? "Desligar movimento do celular" : "Mover com o celular"}
                className={cn(
                  "absolute top-3 right-3 z-20 grid size-12 place-items-center rounded-full shadow-lg ring-1 backdrop-blur transition-colors",
                  motionControl.enabled ? "bg-sea-400 text-navy-950 ring-sea-300" : "bg-navy-950/70 text-white ring-white/20",
                )}
              >
                <Smartphone className="size-5" aria-hidden="true" />
              </button>
            )}
          </>
        )}

        {uiHidden && (
          <button
            type="button"
            onClick={() => setUiHidden(false)}
            className="absolute top-[max(0.75rem,env(safe-area-inset-top))] left-1/2 z-30 flex h-11 -translate-x-1/2 animate-fade-in items-center gap-2 rounded-full bg-navy-950/75 px-4 text-sm font-semibold text-white shadow-lg ring-1 ring-white/20 backdrop-blur"
          >
            <Eye className="size-4" aria-hidden="true" />
            Mostrar interface
          </button>
        )}
      </div>

      {!uiHidden && (
        <TourBottomBar
          boat={boat}
          guidedActive={card === "guided"}
          onGuided={toggleGuided}
          onFree={enterFreeMode}
          onDetails={onOpenDetails}
          onPlan={() => onPlan("form")}
        />
      )}
    </dialog>
  );
}
