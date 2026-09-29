"use client";

import type { BoatScene, MatterportSource, TourTarget, ViewerStatus } from "@/types/tour";
import { MarzipanoViewer } from "./MarzipanoViewer";
import { MatterportViewer } from "./MatterportViewer";

interface CommonViewerProps {
  /** Nome acessível do viewer (title do iframe / aria-label do panorama). */
  title: string;
  onStatusChange?: (status: ViewerStatus) => void;
  onInteract?: () => void;
  /** Ação de "Ver embarcação" no estado de erro. */
  onFallback?: () => void;
}

interface MatterportModeProps extends CommonViewerProps {
  mode: "matterport";
  /** Model ID público do Matterport (ex.: "WVdYpfzTFcg"). */
  source: string;
  params?: MatterportSource["params"];
  simulateError?: boolean;
}

interface MarzipanoModeProps extends CommonViewerProps {
  mode: "marzipano";
  scenes: BoatScene[];
  initialSceneId?: string;
  target?: TourTarget;
  motionEnabled?: boolean;
  onSceneChange?: (sceneId: string) => void;
}

export type TourViewerProps = MatterportModeProps | MarzipanoModeProps;

/**
 * Abstração do tour 360°. O resto da interface não sabe qual motor está
 * por trás:
 *
 *   <TourViewer mode="matterport" source="WVdYpfzTFcg" title="…" />
 *   <TourViewer mode="marzipano" scenes={boatScenes} title="…" />
 */
export function TourViewer(props: TourViewerProps) {
  const common = {
    title: props.title,
    onStatusChange: props.onStatusChange,
    onInteract: props.onInteract,
    onFallback: props.onFallback,
  };

  if (props.mode === "matterport") {
    return <MatterportViewer modelId={props.source} params={props.params} simulateError={props.simulateError} {...common} />;
  }

  return (
    <MarzipanoViewer
      scenes={props.scenes}
      initialSceneId={props.initialSceneId}
      target={props.target}
      motionEnabled={props.motionEnabled}
      onSceneChange={props.onSceneChange}
      {...common}
    />
  );
}
