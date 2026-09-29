"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ToastProvider } from "@/components/ui/Toast";
import { readSessionFlag, sessionFlags, writeSessionFlag } from "@/lib/storage";
import { useTourRoute } from "@/lib/useTourRoute";
import type { Boat } from "@/types/boat";
import type { TourTarget } from "@/types/tour";
import { BoatDetailsDrawer } from "./BoatDetailsDrawer";
import { CTAPlanner, type PlannerEntry } from "./CTAPlanner";
import { TourOverlay, type TourExitSummary } from "./TourOverlay";

interface BoatTourContextValue {
  boat: Boat;
  tourOpen: boolean;
  openTour: (target?: TourTarget) => void;
  openDetails: () => void;
  openPlanner: (entry?: PlannerEntry) => void;
}

const BoatTourContext = createContext<BoatTourContextValue | null>(null);

export function useBoatTour() {
  const context = useContext(BoatTourContext);
  if (!context) throw new Error("useBoatTour deve ser usado dentro de <BoatTourProvider>");
  return context;
}

/**
 * Estados da experiência:
 * 1. apresentação (página) → 2. preparação (loading) → 3. tour imersivo
 * → 4. informações (drawer) → 5. CTA de planejamento.
 */
export function BoatTourProvider({ boat, children }: { boat: Boat; children: ReactNode }) {
  const route = useTourRoute();
  const { open: openRoute, close: closeRoute, isOpen: tourOpen } = route;
  const [target, setTarget] = useState<TourTarget | undefined>();
  const [simulateError, setSimulateError] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [planner, setPlanner] = useState<{ open: boolean; entry: PlannerEntry; session: number }>({
    open: false,
    entry: "form",
    session: 0,
  });
  const lastTrigger = useRef<HTMLElement | null>(null);
  const wasOpen = useRef(false);

  const openTour = useCallback(
    (nextTarget?: TourTarget) => {
      lastTrigger.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setTarget(nextTarget);
      // `?simular=erro` força o estado de erro para demonstração.
      setSimulateError(new URLSearchParams(window.location.search).get("simular") === "erro");
      setDetailsOpen(false);
      openRoute();
    },
    [openRoute],
  );

  const openDetails = useCallback(() => setDetailsOpen(true), []);

  const openPlanner = useCallback((entry: PlannerEntry = "form") => {
    setDetailsOpen(false);
    setPlanner((current) => ({ open: true, entry, session: current.session + 1 }));
  }, []);

  // Ao sair do tour depois de explorar, convida a planejar (uma vez por sessão).
  const handleTourExit = useCallback(({ explored }: TourExitSummary) => {
    if (!explored || readSessionFlag(sessionFlags.ctaShown)) return;
    writeSessionFlag(sessionFlags.ctaShown);
    setPlanner((current) => ({ open: true, entry: "invite", session: current.session + 1 }));
  }, []);

  const handleFallback = useCallback(() => {
    closeRoute();
    setDetailsOpen(true);
  }, [closeRoute]);

  // Devolve o foco para quem abriu o tour.
  useEffect(() => {
    if (wasOpen.current && !tourOpen) lastTrigger.current?.focus({ preventScroll: true });
    wasOpen.current = tourOpen;
  }, [tourOpen]);

  const value = useMemo<BoatTourContextValue>(
    () => ({ boat, tourOpen, openTour, openDetails, openPlanner }),
    [boat, tourOpen, openTour, openDetails, openPlanner],
  );

  return (
    <BoatTourContext.Provider value={value}>
      <ToastProvider>
        <div inert={tourOpen}>{children}</div>

        {tourOpen && (
          <TourOverlay
            boat={boat}
            initialTarget={target}
            simulateError={simulateError}
            onRequestClose={closeRoute}
            onExit={handleTourExit}
            onOpenDetails={openDetails}
            onPlan={openPlanner}
            onFallback={handleFallback}
          />
        )}

        <BoatDetailsDrawer
          boat={boat}
          open={detailsOpen}
          inTour={tourOpen}
          onClose={() => setDetailsOpen(false)}
          onEnterTour={() => openTour()}
          onPlan={() => openPlanner("form")}
        />

        <CTAPlanner
          key={planner.session}
          open={planner.open}
          entry={planner.entry}
          onClose={() => setPlanner((current) => ({ ...current, open: false }))}
          onContinueExploring={() => {
            if (!tourOpen) openTour();
          }}
        />
      </ToastProvider>
    </BoatTourContext.Provider>
  );
}
