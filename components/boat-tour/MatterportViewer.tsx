"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { buildMatterportUrl } from "@/lib/matterport";
import type { MatterportSource, ViewerStatus } from "@/types/tour";
import { TourError } from "./TourError";
import { TourLoading } from "./TourLoading";

const LOAD_TIMEOUT_MS = 25_000;
/** Evita um "piscar" do loading quando o iframe carrega muito rápido. */
const MIN_LOADING_MS = 900;

export interface MatterportViewerProps {
  modelId: string;
  params?: MatterportSource["params"];
  title: string;
  /** Força o estado de erro na primeira tentativa (demonstração). */
  simulateError?: boolean;
  onStatusChange?: (status: ViewerStatus) => void;
  /** Disparado na primeira interação com o iframe (clique/toque dentro dele). */
  onInteract?: () => void;
  onFallback?: () => void;
}

/**
 * Tour Matterport via iframe público oficial.
 *
 * O iframe é cross-origin: nada dentro dele é acessado ou modificado.
 * A interface Uboatt é construída ao redor. Com SDK (conta + SDK key +
 * permissão sobre o modelo), este componente poderá receber `TourTarget`
 * com `sweepId` e mover a câmera.
 */
export function MatterportViewer({
  modelId,
  params,
  title,
  simulateError = false,
  onStatusChange,
  onInteract,
  onFallback,
}: MatterportViewerProps) {
  const src = useMemo(() => buildMatterportUrl({ modelId, params }), [modelId, params]);
  const [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState<ViewerStatus>(() =>
    simulateError || (typeof navigator !== "undefined" && navigator.onLine === false) ? "error" : "loading",
  );
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const loadStartedAt = useRef(0);

  useEffect(() => {
    onStatusChange?.(status);
  }, [status, onStatusChange]);

  // Tempo limite e queda de conexão durante o carregamento.
  useEffect(() => {
    if (status !== "loading") return;
    loadStartedAt.current = performance.now();
    const timeout = window.setTimeout(() => setStatus("error"), LOAD_TIMEOUT_MS);
    const handleOffline = () => setStatus("error");
    window.addEventListener("offline", handleOffline);
    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener("offline", handleOffline);
    };
  }, [status, attempt]);

  // Iframes não repassam eventos: detectamos a primeira interação pelo foco.
  useEffect(() => {
    if (!onInteract) return;
    const handleBlur = () => {
      window.setTimeout(() => {
        if (document.activeElement === iframeRef.current) onInteract();
      }, 0);
    };
    window.addEventListener("blur", handleBlur);
    return () => window.removeEventListener("blur", handleBlur);
  }, [onInteract]);

  function handleLoad() {
    const elapsed = performance.now() - loadStartedAt.current;
    window.setTimeout(
      () => setStatus((current) => (current === "loading" ? "ready" : current)),
      Math.max(0, MIN_LOADING_MS - elapsed),
    );
  }

  function retry() {
    setAttempt((value) => value + 1);
    setStatus(navigator.onLine === false ? "error" : "loading");
  }

  return (
    <div className="absolute inset-0 overflow-hidden bg-navy-950">
      {status !== "error" && (
        <iframe
          key={attempt}
          ref={iframeRef}
          src={src}
          title={title}
          width="100%"
          height="100%"
          allow="fullscreen; xr-spatial-tracking"
          allowFullScreen
          onLoad={handleLoad}
          className={cn(
            "absolute inset-0 h-full w-full border-0 transition-opacity duration-700",
            status === "ready" ? "opacity-100" : "opacity-0",
          )}
        />
      )}
      <TourLoading visible={status === "loading"} />
      {status === "error" && <TourError onRetry={retry} onFallback={onFallback} />}
    </div>
  );
}
