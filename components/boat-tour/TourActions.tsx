"use client";

import type { ReactNode } from "react";
import { buttonClass, type ButtonSize, type ButtonVariant } from "@/components/ui/button";
import type { TourTarget } from "@/types/tour";
import type { PlannerEntry } from "./CTAPlanner";
import { useBoatTour } from "./BoatTourProvider";

interface ActionButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
  className?: string;
  ariaLabel?: string;
}

/** Botões que podem ser usados dentro de Server Components. */
export function EnterTourButton({ target, variant = "primary", size = "md", block, className, ariaLabel, children }: ActionButtonProps & { target?: TourTarget }) {
  const { openTour } = useBoatTour();
  return (
    <button type="button" aria-label={ariaLabel} onClick={() => openTour(target)} className={buttonClass({ variant, size, block, className })}>
      {children}
    </button>
  );
}

export function DetailsButton({ variant = "outline", size = "md", block, className, ariaLabel, children }: ActionButtonProps) {
  const { openDetails } = useBoatTour();
  return (
    <button type="button" aria-label={ariaLabel} onClick={openDetails} className={buttonClass({ variant, size, block, className })}>
      {children}
    </button>
  );
}

export function PlanButton({ entry = "form", variant = "navy", size = "md", block, className, ariaLabel, children }: ActionButtonProps & { entry?: PlannerEntry }) {
  const { openPlanner } = useBoatTour();
  return (
    <button type="button" aria-label={ariaLabel} onClick={() => openPlanner(entry)} className={buttonClass({ variant, size, block, className })}>
      {children}
    </button>
  );
}
