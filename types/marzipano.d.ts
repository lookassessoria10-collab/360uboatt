/**
 * Tipagem mínima do Marzipano (o pacote não publica tipos).
 * Cobre apenas o que `MarzipanoViewer` usa. Documentação: https://www.marzipano.net/reference/
 */
declare module "marzipano" {
  export interface ViewParameters {
    yaw?: number;
    pitch?: number;
    roll?: number;
    fov?: number;
  }

  export type ViewLimiter = (params: ViewParameters) => ViewParameters;

  export class RectilinearView {
    constructor(params?: ViewParameters, limiter?: ViewLimiter);
    yaw(): number;
    pitch(): number;
    fov(): number;
    setParameters(params: ViewParameters): void;
    screenToCoordinates(coords: { x: number; y: number }): { yaw: number; pitch: number };
    static limit: {
      traditional(maxResolution: number, maxVFov: number, maxHFov?: number): ViewLimiter;
    };
  }

  export class EquirectGeometry {
    constructor(levels: Array<{ width: number }>);
  }

  export class CubeGeometry {
    constructor(levels: Array<{ tileSize: number; size: number; fallbackOnly?: boolean }>);
  }

  export interface Source {
    readonly __source: unique symbol;
  }

  export const ImageUrlSource: {
    fromString(url: string, opts?: { cubeMapPreviewUrl?: string; cubeMapPreviewFaceOrder?: string }): Source;
  };

  export class Hotspot {
    destroy(): void;
  }

  export class HotspotContainer {
    createHotspot(
      element: HTMLElement,
      coords: { yaw: number; pitch: number },
      opts?: { perspective?: { radius?: number; extraTransforms?: string } },
    ): Hotspot;
  }

  export class Scene {
    switchTo(opts?: { transitionDuration?: number }, done?: () => void): void;
    hotspotContainer(): HotspotContainer;
    view(): RectilinearView;
    lookTo(params: ViewParameters, opts?: { transitionDuration?: number }, done?: () => void): void;
  }

  export class KeyControlMethod {
    constructor(keyCode: number, parameter: "x" | "y" | "zoom", velocity: number, friction: number, element?: HTMLElement);
  }

  export class Controls {
    registerMethod(id: string, method: KeyControlMethod, enable?: boolean): void;
  }

  export interface ViewerOptions {
    controls?: { mouseViewMode?: "drag" | "qtvr"; scrollZoom?: boolean };
    stage?: { progressive?: boolean };
  }

  export class Viewer {
    constructor(element: HTMLElement, opts?: ViewerOptions);
    createScene(opts: { source: Source; geometry: EquirectGeometry | CubeGeometry; view: RectilinearView; pinFirstLevel?: boolean }): Scene;
    scene(): Scene | null;
    controls(): Controls;
    updateSize(): void;
    destroy(): void;
  }
}
