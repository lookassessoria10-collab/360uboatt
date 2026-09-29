"use client";

import type * as MarzipanoModule from "marzipano";
import { Smartphone } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";
import { shortestAngleDelta } from "@/lib/useDeviceOrientation";
import type { BoatScene, TourHotspot as TourHotspotData, TourTarget, ViewerStatus } from "@/types/tour";
import { TourError } from "./TourError";
import { TourHotspot } from "./TourHotspot";
import { TourLoading } from "./TourLoading";

type MarzipanoLib = typeof MarzipanoModule;

const DEFAULT_PANORAMA_WIDTH = 4096;
const DEFAULT_FOV = (90 * Math.PI) / 180;
const MAX_FOV = (110 * Math.PI) / 180;
const PANORAMA_TIMEOUT_MS = 30_000;

export interface MarzipanoViewerProps {
  scenes: BoatScene[];
  initialSceneId?: string;
  /** Muda de cena e/ou direção (tour guiado, mapa, cards). */
  target?: TourTarget;
  title: string;
  /** "Mover com o celular": só liga depois da permissão explícita do usuário. */
  motionEnabled?: boolean;
  onStatusChange?: (status: ViewerStatus) => void;
  onSceneChange?: (sceneId: string) => void;
  onInteract?: () => void;
  onFallback?: () => void;
}

function pickScene(scenes: BoatScene[], preferred?: string) {
  return scenes.find((scene) => scene.id === preferred)?.id ?? scenes[0]?.id ?? "";
}

/**
 * Viewer de panoramas equiretangulares próprios (Marzipano).
 *
 * - Sem panoramas cadastrados: mostra uma prévia técnica funcional
 *   (cenas, hotspots e navegação), sem imagens falsas.
 * - Com panoramas: carrega o Marzipano sob demanda (import dinâmico),
 *   cria cada cena só quando é visitada e pré-carrega apenas a próxima
 *   cena provável (primeiro hotspot de navegação da cena atual).
 */
export function MarzipanoViewer({ scenes, initialSceneId, target, onSceneChange, ...rest }: MarzipanoViewerProps) {
  const playable = useMemo(() => scenes.filter((scene) => scene.panorama), [scenes]);
  const available = playable.length > 0 ? playable : scenes;
  const [sceneId, setSceneId] = useState(() => pickScene(available, target?.sceneId ?? initialSceneId));
  const [lastTarget, setLastTarget] = useState(target);

  // Ajusta a cena quando o destino muda (padrão "estado derivado de props").
  if (target !== lastTarget) {
    setLastTarget(target);
    if (target?.sceneId && available.some((scene) => scene.id === target.sceneId)) setSceneId(target.sceneId);
  }

  useEffect(() => {
    if (sceneId) onSceneChange?.(sceneId);
  }, [sceneId, onSceneChange]);

  const navigate = (id: string) => {
    if (available.some((scene) => scene.id === id)) setSceneId(id);
  };

  if (playable.length === 0) {
    return <MarzipanoPlaceholder scenes={scenes} sceneId={sceneId} onNavigate={navigate} {...rest} />;
  }
  return <MarzipanoCanvas scenes={playable} sceneId={sceneId} target={target} onNavigate={navigate} {...rest} />;
}

/* -------------------------------------------------------------------------- */
/* Prévia técnica (sem panoramas)                                             */
/* -------------------------------------------------------------------------- */

interface ChildProps extends Omit<MarzipanoViewerProps, "scenes" | "initialSceneId" | "target" | "onSceneChange"> {
  scenes: BoatScene[];
  sceneId: string;
  onNavigate: (sceneId: string) => void;
}

/** Converte (yaw, pitch) em posição sobre um quadro equiretangular 2:1. */
function toEquirectPercent({ yaw, pitch }: Pick<TourHotspotData, "yaw" | "pitch">) {
  const x = ((((yaw + Math.PI) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)) / (2 * Math.PI);
  const y = (pitch + Math.PI / 2) / Math.PI;
  return { left: `${(x * 100).toFixed(2)}%`, top: `${(Math.min(Math.max(y, 0.05), 0.95) * 100).toFixed(2)}%` };
}

function useOrientationReadout(enabled: boolean) {
  const [reading, setReading] = useState<{ alpha: number; beta: number } | null>(null);
  useEffect(() => {
    if (!enabled) return;
    const handle = (event: DeviceOrientationEvent) => {
      if (event.alpha == null || event.beta == null) return;
      setReading({ alpha: event.alpha, beta: event.beta });
    };
    window.addEventListener("deviceorientation", handle);
    return () => window.removeEventListener("deviceorientation", handle);
  }, [enabled]);
  return enabled ? reading : null;
}

function MarzipanoPlaceholder({ scenes, sceneId, onNavigate, onStatusChange, onInteract, motionEnabled = false }: ChildProps) {
  const scene = scenes.find((item) => item.id === sceneId) ?? scenes[0];
  const reading = useOrientationReadout(motionEnabled);
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onStatusChange?.("ready");
  }, [onStatusChange]);

  // Em telas estreitas o quadro rola na horizontal: começa centrado no yaw 0.
  useEffect(() => {
    const frame = frameRef.current;
    if (frame) frame.scrollLeft = (frame.scrollWidth - frame.clientWidth) / 2;
  }, [sceneId]);

  if (!scene) return null;

  return (
    <div className="absolute inset-0 flex flex-col bg-navy-950 text-white" onPointerDown={onInteract}>
      <div className="flex flex-wrap items-end justify-between gap-3 px-4 pt-4 sm:px-6">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.16em] text-sea-300 uppercase">Prévia técnica · Marzipano</p>
          <p className="text-lg font-bold tracking-tight">Cena: {scene.name}</p>
        </div>
        <div role="group" aria-label="Cenas" className="no-scrollbar -mx-1 flex max-w-full gap-1 overflow-x-auto px-1">
          {scenes.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={item.id === scene.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                "h-11 shrink-0 rounded-full px-4 text-sm font-semibold transition-colors",
                item.id === scene.id ? "bg-white text-navy-900" : "bg-white/10 text-white/85 hover:bg-white/20",
              )}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>

      <div
        ref={frameRef}
        tabIndex={0}
        role="region"
        aria-label={`Posições dos hotspots da cena ${scene.name}`}
        className="no-scrollbar relative mt-3 min-h-0 flex-1 overflow-x-auto overflow-y-hidden px-4 pb-4 sm:px-6"
      >
        <div className="relative mx-auto aspect-[2/1] h-full min-w-[640px] overflow-hidden rounded-3xl bg-navy-900 ring-1 ring-white/10">
          {/* Grade equiretangular: colunas a cada 45° de yaw, linhas a cada 45° de pitch */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(to_right,rgb(255_255_255/0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.07)_1px,transparent_1px)] bg-[size:12.5%_25%]"
          />
          <div aria-hidden="true" className="absolute inset-x-0 top-1/2 h-px bg-sea-300/40" />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(50%_40%_at_50%_50%,rgb(36_169_224/0.16),transparent_70%)]"
          />

          <div className="pointer-events-none absolute inset-x-0 top-[18%] flex flex-col items-center px-6 text-center">
            <p className="text-sm font-semibold">Panorama 360° pendente</p>
            <p className="mt-1 max-w-md text-xs text-white/65">
              JPEG equiretangular 2:1 (ex.: 8192×4096 ou 6000×3000) em{" "}
              <code className="rounded bg-white/10 px-1.5 py-0.5 text-[11px] text-sea-200">/boats/&lt;embarcação&gt;/{scene.id}.jpg</code>
            </p>
          </div>

          {(scene.hotspots ?? []).map((hotspot) => (
            <div key={hotspot.id} className="absolute" style={toEquirectPercent(hotspot)}>
              <TourHotspot hotspot={hotspot} onNavigate={onNavigate} />
            </div>
          ))}

          {reading && (
            <p className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-navy-950/80 px-3 py-1.5 text-xs font-medium tabular-nums">
              <Smartphone className="size-3.5 text-sea-300" aria-hidden="true" />
              Movimento ativo · {Math.round(reading.alpha)}° / {Math.round(reading.beta)}°
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Viewer real (com panoramas)                                                */
/* -------------------------------------------------------------------------- */

interface HotspotNode {
  key: string;
  sceneId: string;
  hotspot: TourHotspotData;
  element: HTMLDivElement;
}

interface Engine {
  lib: MarzipanoLib;
  viewer: MarzipanoModule.Viewer;
  created: Map<string, MarzipanoModule.Scene>;
  nodes: HotspotNode[];
}

function preloadImage(url: string, timeoutMs: number) {
  return new Promise<void>((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    const timer = window.setTimeout(() => reject(new Error("timeout")), timeoutMs);
    image.onload = () => {
      window.clearTimeout(timer);
      resolve();
    };
    image.onerror = () => {
      window.clearTimeout(timer);
      reject(new Error("load error"));
    };
    image.src = url;
  });
}

/** Pré-carrega só a próxima cena provável: o primeiro hotspot de navegação. */
function preloadLikelyNext(scenes: BoatScene[], sceneId: string) {
  const current = scenes.find((scene) => scene.id === sceneId);
  const nextId = current?.hotspots?.find((hotspot) => hotspot.type === "navigation" && hotspot.targetScene)?.targetScene;
  const next = scenes.find((scene) => scene.id === nextId);
  if (!next?.panorama) return;
  const image = new Image();
  image.crossOrigin = "anonymous";
  image.decoding = "async";
  image.src = next.panorama;
}

function ensureScene(engine: Engine, scenes: BoatScene[], sceneId: string) {
  const existing = engine.created.get(sceneId);
  if (existing) return existing;
  const data = scenes.find((scene) => scene.id === sceneId);
  if (!data) return null;

  const { lib, viewer } = engine;
  const width = data.panoramaWidth ?? DEFAULT_PANORAMA_WIDTH;
  const scene = viewer.createScene({
    source: lib.ImageUrlSource.fromString(data.panorama),
    geometry: new lib.EquirectGeometry([{ width }]),
    view: new lib.RectilinearView(
      { yaw: data.initialYaw ?? 0, pitch: data.initialPitch ?? 0, fov: data.initialFov ?? DEFAULT_FOV },
      lib.RectilinearView.limit.traditional(width, MAX_FOV),
    ),
    pinFirstLevel: true,
  });

  for (const node of engine.nodes) {
    if (node.sceneId !== sceneId) continue;
    scene.hotspotContainer().createHotspot(node.element, { yaw: node.hotspot.yaw, pitch: node.hotspot.pitch });
  }

  engine.created.set(sceneId, scene);
  return scene;
}

function MarzipanoCanvas({
  scenes,
  sceneId,
  target,
  title,
  motionEnabled = false,
  onNavigate,
  onStatusChange,
  onInteract,
  onFallback,
}: ChildProps & { target?: TourTarget }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Engine | null>(null);
  const firstSceneRef = useRef(sceneId);
  const [attempt, setAttempt] = useState(0);
  const [readyAttempt, setReadyAttempt] = useState<number | null>(null);
  const [failed, setFailed] = useState(false);
  const [nodes, setNodes] = useState<HotspotNode[]>([]);
  const engineReady = readyAttempt === attempt;
  const status: ViewerStatus = failed ? "error" : engineReady ? "ready" : "loading";

  useEffect(() => {
    onStatusChange?.(status);
  }, [status, onStatusChange]);

  // Carrega a biblioteca e o primeiro panorama.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let cancelled = false;
    let viewer: MarzipanoModule.Viewer | null = null;

    (async () => {
      try {
        const first = scenes.find((scene) => scene.id === firstSceneRef.current) ?? scenes[0];
        await preloadImage(first.panorama, PANORAMA_TIMEOUT_MS);
        const imported = await import("marzipano");
        const lib = ((imported as { default?: MarzipanoLib }).default ?? imported) as MarzipanoLib;
        if (cancelled) return;

        viewer = new lib.Viewer(container, { controls: { mouseViewMode: "drag" }, stage: { progressive: true } });
        // Setas do teclado quando o panorama está em foco.
        const controls = viewer.controls();
        controls.registerMethod("key-left", new lib.KeyControlMethod(37, "x", -0.7, 3, container), true);
        controls.registerMethod("key-right", new lib.KeyControlMethod(39, "x", 0.7, 3, container), true);
        controls.registerMethod("key-up", new lib.KeyControlMethod(38, "y", -0.7, 3, container), true);
        controls.registerMethod("key-down", new lib.KeyControlMethod(40, "y", 0.7, 3, container), true);

        const hotspotNodes = scenes.flatMap((scene) =>
          (scene.hotspots ?? []).map((hotspot) => ({
            key: `${scene.id}:${hotspot.id}`,
            sceneId: scene.id,
            hotspot,
            element: document.createElement("div"),
          })),
        );
        engineRef.current = { lib, viewer, created: new Map(), nodes: hotspotNodes };
        setNodes(hotspotNodes);
        setReadyAttempt(attempt);
      } catch {
        if (!cancelled) setFailed(true);
      }
    })();

    return () => {
      cancelled = true;
      engineRef.current = null;
      viewer?.destroy();
    };
  }, [scenes, attempt]);

  // Troca de cena (e direção, quando o destino informa yaw/pitch).
  useEffect(() => {
    const engine = engineRef.current;
    if (!engineReady || !engine) return;
    const scene = ensureScene(engine, scenes, sceneId);
    if (!scene) return;
    if (target?.sceneId === sceneId && target.yaw !== undefined) {
      scene.view().setParameters({ yaw: target.yaw, pitch: target.pitch ?? 0, ...(target.fov ? { fov: target.fov } : {}) });
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    scene.switchTo({ transitionDuration: reduced ? 0 : 700 });
    preloadLikelyNext(scenes, sceneId);
  }, [engineReady, sceneId, scenes, target]);

  // Acompanha o tamanho do container (ex.: ao esconder a interface).
  useEffect(() => {
    const container = containerRef.current;
    if (!engineReady || !container) return;
    const observer = new ResizeObserver(() => engineRef.current?.viewer.updateSize());
    observer.observe(container);
    return () => observer.disconnect();
  }, [engineReady]);

  // "Mover com o celular" (DeviceOrientation), relativo à posição inicial.
  useEffect(() => {
    const engine = engineRef.current;
    if (!motionEnabled || !engineReady || !engine) return;
    let base: { alpha: number; beta: number; yaw: number; pitch: number } | null = null;
    const handle = (event: DeviceOrientationEvent) => {
      const view = engine.viewer.scene()?.view();
      if (!view || event.alpha == null || event.beta == null) return;
      base ??= { alpha: event.alpha, beta: event.beta, yaw: view.yaw(), pitch: view.pitch() };
      const yaw = base.yaw - (shortestAngleDelta(event.alpha - base.alpha) * Math.PI) / 180;
      const pitch = Math.min(1.4, Math.max(-1.4, base.pitch - ((event.beta - base.beta) * Math.PI) / 180));
      view.setParameters({ yaw, pitch });
    };
    window.addEventListener("deviceorientation", handle);
    return () => window.removeEventListener("deviceorientation", handle);
  }, [motionEnabled, engineReady, sceneId]);

  function retry() {
    setFailed(false);
    setAttempt((value) => value + 1);
  }

  /**
   * Ajuda a cadastrar hotspots: com `?debug=hotspots` na URL, cada clique no
   * panorama mostra no console o yaw/pitch daquele ponto.
   */
  function logCoordinates(event: ReactMouseEvent<HTMLDivElement>) {
    if (new URLSearchParams(window.location.search).get("debug") !== "hotspots") return;
    const view = engineRef.current?.viewer.scene()?.view();
    if (!view) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const { yaw, pitch } = view.screenToCoordinates({ x: event.clientX - rect.left, y: event.clientY - rect.top });
    console.info(`[hotspot] cena "${sceneId}" → yaw: ${yaw.toFixed(3)}, pitch: ${pitch.toFixed(3)}`);
  }

  return (
    <div className="absolute inset-0 overflow-hidden bg-navy-950">
      <div
        ref={containerRef}
        tabIndex={0}
        role="application"
        aria-roledescription="panorama 360°"
        aria-label={`${title}. Arraste ou use as setas do teclado para olhar ao redor.`}
        className="absolute inset-0"
        onPointerDown={onInteract}
        onClick={logCoordinates}
      />
      {nodes.map((node) =>
        createPortal(<TourHotspot hotspot={node.hotspot} onNavigate={onNavigate} />, node.element, node.key),
      )}
      <TourLoading visible={status === "loading"} />
      {status === "error" && <TourError onRetry={retry} onFallback={onFallback} />}
    </div>
  );
}
