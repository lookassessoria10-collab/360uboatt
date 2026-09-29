/**
 * Tipos do tour 360°.
 *
 * O tour funciona em dois modos:
 * - `matterport`: iframe público oficial (usado no protótipo, sem SDK);
 * - `marzipano`: panoramas equiretangulares próprios da Uboatt (versão futura).
 */

export type TourMode = "matterport" | "marzipano";

/** Estado de carregamento de qualquer viewer. */
export type ViewerStatus = "loading" | "ready" | "error";

/** Hotspot exibido dentro de um panorama Marzipano. */
export interface TourHotspot {
  id: string;
  type: "navigation" | "info";
  /** Ângulo horizontal em radianos (0 = frente da cena). */
  yaw: number;
  /** Ângulo vertical em radianos (convenção Marzipano: positivo = abaixo do horizonte). */
  pitch: number;
  label: string;
  /** Obrigatório para hotspots de navegação. */
  targetScene?: string;
  /** Texto do card de informação. Deve vir do cadastro da embarcação. */
  description?: string;
  /** Chave de ícone opcional (ver `components/boat-tour/icons.ts`). */
  icon?: string;
}

/** Um ambiente da embarcação = uma cena/panorama 360°. */
export interface BoatScene {
  id: string;
  name: string;
  /**
   * URL do JPEG equiretangular 2:1 (ex.: 8192×4096 ou 6000×3000).
   * Vazio enquanto não houver fotografias reais.
   */
  panorama: string;
  initialYaw?: number;
  initialPitch?: number;
  /** Campo de visão inicial em radianos. */
  initialFov?: number;
  hotspots?: TourHotspot[];
  /** Largura em pixels do panorama (usada pela geometria do Marzipano). */
  panoramaWidth?: number;
  /** Miniatura leve para listas e transições. */
  thumbnail?: string;
}

/**
 * Destino dentro do tour. Botões do mapa, cards e tour guiado apontam
 * para um `TourTarget`. No Marzipano, `sceneId`/`yaw`/`pitch` movem a câmera.
 * No Matterport (com SDK no futuro) poderá usar `sweepId`.
 */
export interface TourTarget {
  sceneId?: string;
  yaw?: number;
  pitch?: number;
  fov?: number;
  /** Reservado para o Matterport SDK (Sweep ID do modelo). */
  sweepId?: string;
}

export interface MatterportSource {
  modelId: string;
  /** Parâmetros extras da URL `my.matterport.com/show` (ex.: `{ play: 1 }`). */
  params?: Record<string, string | number | boolean>;
}

export interface MarzipanoSource {
  scenes: BoatScene[];
  initialSceneId?: string;
}

/** Fontes disponíveis para uma embarcação. `Boat.tourMode` escolhe qual usar. */
export interface TourConfig {
  matterport?: MatterportSource;
  marzipano?: MarzipanoSource;
}
