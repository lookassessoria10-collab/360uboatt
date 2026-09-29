"use client";

import { X } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

type Placement = "responsive" | "bottom" | "center";

const SheetContext = createContext<{ close: () => void } | null>(null);

/** Fecha o painel atual com animação. Use dentro de um <Sheet>. */
export function useSheet() {
  const context = useContext(SheetContext);
  if (!context) throw new Error("useSheet deve ser usado dentro de <Sheet>");
  return context;
}

interface SheetProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  eyebrow?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  /**
   * responsive: bottom sheet no mobile e drawer lateral a partir de 1024px.
   * bottom: sempre bottom sheet. center: diálogo central.
   */
  placement?: Placement;
  closeLabel?: string;
  bodyClassName?: string;
}

const DRAG_CLOSE_THRESHOLD = 96;

/**
 * Painel modal sobre <dialog> nativo: foco preso, Esc, top layer e
 * fundo inerte sem bibliotecas. No mobile, arrastar o topo para baixo fecha.
 */
export function Sheet({
  open,
  onClose,
  title,
  eyebrow,
  description,
  children,
  footer,
  placement = "responsive",
  closeLabel = "Fechar",
  bodyClassName,
}: SheetProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const backdropPress = useRef(false);
  const drag = useRef<{ startY: number; dy: number } | null>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.removeAttribute("data-closing");
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  const close = useCallback(() => {
    const dialog = dialogRef.current;
    if (!dialog?.open || dialog.hasAttribute("data-closing")) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      dialog.close();
      return;
    }
    dialog.setAttribute("data-closing", "");
    closeTimer.current = window.setTimeout(() => dialog.close(), 190);
  }, []);

  const contextValue = useMemo(() => ({ close }), [close]);

  function handleNativeClose() {
    dialogRef.current?.removeAttribute("data-closing");
    if (panelRef.current) {
      panelRef.current.style.transform = "";
      panelRef.current.style.transition = "";
    }
    onClose();
  }

  function isBottomSheet() {
    return placement === "bottom" || (placement === "responsive" && !window.matchMedia("(min-width: 1024px)").matches);
  }

  function handleDragStart(event: ReactPointerEvent<HTMLDivElement>) {
    if (!isBottomSheet() || (event.target as HTMLElement).closest("button, a, input, select, textarea")) return;
    drag.current = { startY: event.clientY, dy: 0 };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handleDragMove(event: ReactPointerEvent<HTMLDivElement>) {
    const panel = panelRef.current;
    if (!drag.current || !panel) return;
    const dy = Math.max(0, event.clientY - drag.current.startY);
    drag.current.dy = dy;
    panel.style.transition = "none";
    panel.style.transform = `translateY(${dy}px)`;
  }

  function handleDragEnd() {
    const panel = panelRef.current;
    if (!drag.current || !panel) return;
    const { dy } = drag.current;
    drag.current = null;
    panel.style.transition = "transform 0.2s var(--ease-soft)";
    if (dy > DRAG_CLOSE_THRESHOLD) close();
    else panel.style.transform = "";
  }

  return (
    <dialog
      ref={dialogRef}
      className="sheet"
      data-placement={placement}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onClose={handleNativeClose}
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      onPointerDown={(event) => {
        backdropPress.current = event.target === event.currentTarget;
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget && backdropPress.current) close();
      }}
    >
      <SheetContext.Provider value={contextValue}>
        <div ref={panelRef} className="sheet-panel text-navy-900">
          <div
            className="shrink-0 touch-none select-none"
            onPointerDown={handleDragStart}
            onPointerMove={handleDragMove}
            onPointerUp={handleDragEnd}
            onPointerCancel={handleDragEnd}
          >
            {placement !== "center" && (
              <div aria-hidden="true" className={cn("flex justify-center pt-3", placement === "responsive" && "lg:hidden")}>
                <span className="h-1.5 w-10 rounded-full bg-navy-900/15" />
              </div>
            )}
            <div className="flex items-start justify-between gap-4 px-5 pt-4 pb-3 sm:px-6 lg:pt-6">
              <div className="min-w-0">
                {eyebrow && (
                  <p className="mb-1 text-xs font-semibold tracking-[0.14em] text-ocean-700 uppercase">{eyebrow}</p>
                )}
                <h2 id={titleId} className="text-xl leading-tight font-bold tracking-tight text-navy-900 sm:text-2xl">
                  {title}
                </h2>
                {description && (
                  <p id={descriptionId} className="mt-1.5 text-[15px] text-ink-600">
                    {description}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={close}
                aria-label={closeLabel}
                className="-mr-1 grid size-11 shrink-0 place-items-center rounded-full bg-mist text-navy-900 transition-colors hover:bg-sea-100"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div
            className={cn(
              "min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 sm:px-6",
              footer ? "pb-5" : "pb-[max(1.5rem,env(safe-area-inset-bottom))]",
              bodyClassName,
            )}
          >
            {open && children}
          </div>

          {footer && open && (
            <div className="shrink-0 border-t border-line bg-white px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6">
              {footer}
            </div>
          )}
        </div>
      </SheetContext.Provider>
    </dialog>
  );
}

/** Botão que fecha o <Sheet> atual com animação. */
export function SheetCloseButton({ className, children }: { className?: string; children: ReactNode }) {
  const { close } = useSheet();
  return (
    <button type="button" onClick={close} className={className}>
      {children}
    </button>
  );
}
