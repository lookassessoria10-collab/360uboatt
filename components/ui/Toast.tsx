"use client";

import { Check, Info } from "lucide-react";
import { createContext, useCallback, useContext, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";

type ToastTone = "success" | "info";
type ShowToast = (message: string, tone?: ToastTone) => void;

const ToastContext = createContext<ShowToast>(() => {});

export function useToast() {
  return useContext(ToastContext);
}

const noopSubscribe = () => () => {};
const getPopoverSupport = () => typeof HTMLElement.prototype.showPopover === "function";

/**
 * Toast acessível. Quando o navegador suporta Popover API, o toast vai para
 * o top layer e aparece acima de painéis modais e da tela cheia.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<{ id: number; message: string; tone: ToastTone } | null>(null);
  const supportsPopover = useSyncExternalStore(noopSubscribe, getPopoverSupport, () => false);
  const elementRef = useRef<HTMLDivElement>(null);
  const timer = useRef<number | undefined>(undefined);

  const show = useCallback<ShowToast>((message, tone = "success") => {
    window.clearTimeout(timer.current);
    setToast({ id: Date.now(), message, tone });
    timer.current = window.setTimeout(() => setToast(null), 3400);
  }, []);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  useEffect(() => {
    const element = elementRef.current;
    if (!supportsPopover || !element) return;
    try {
      // Reabrir leva o toast para o topo, acima de um painel aberto depois dele.
      if (element.matches(":popover-open")) element.hidePopover();
      if (toast) element.showPopover();
    } catch {
      // Estado de popover inconsistente: o toast continua no fluxo normal.
    }
  }, [toast, supportsPopover]);

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div role="status" aria-live="polite" className="sr-only">
        {toast?.message}
      </div>
      <div
        ref={elementRef}
        popover={supportsPopover ? "manual" : undefined}
        aria-hidden="true"
        className="toast pointer-events-none fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+7.5rem)] z-[100] mx-auto flex w-fit max-w-[calc(100vw-32px)] justify-center lg:bottom-28"
        hidden={!supportsPopover && !toast}
      >
        {toast && (
          <div
            key={toast.id}
            className="flex animate-fade-up items-center gap-3 rounded-full bg-navy-900 py-2.5 pr-5 pl-2.5 text-[15px] font-medium text-white shadow-[0_18px_40px_-12px_rgb(4_28_56/0.55)] ring-1 ring-white/10"
          >
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-sea-400 text-navy-950">
              {toast.tone === "success" ? <Check className="size-4" strokeWidth={3} /> : <Info className="size-4" strokeWidth={2.5} />}
            </span>
            {toast.message}
          </div>
        )}
      </div>
    </ToastContext.Provider>
  );
}
