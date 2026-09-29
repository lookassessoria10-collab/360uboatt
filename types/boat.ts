import type { TourConfig, TourMode, TourTarget } from "./tour";

/** Chaves de ícone serializáveis (mapeadas em `components/boat-tour/icons.ts`). */
export type IconKey =
  | "sun"
  | "users"
  | "door"
  | "bath"
  | "bow"
  | "stern"
  | "anchor"
  | "info";

export interface MediaImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  credit?: { name: string; url: string };
}

/** Um espaço da embarcação (usado em cards, mapa e tour guiado). */
export interface BoatSpace {
  id: string;
  name: string;
  /** Descrição genérica do espaço. Especificações reais vêm do cadastro. */
  description: string;
  /** O que o grupo deve observar no tour. */
  tip?: string;
  icon: IconKey;
  target?: TourTarget;
}

/** Áreas clicáveis do diagrama da lancha (popa → proa). */
export interface BoatMapZone {
  id: "popa" | "cockpit" | "cabine" | "proa";
  label: string;
  spaceId: string;
  target?: TourTarget;
}

export interface GuidedStep {
  id: string;
  spaceId: string;
  /** Zona do mapa destacada durante a etapa. */
  zoneId: BoatMapZone["id"];
  title: string;
  text: string;
  tip?: string;
  /** Na versão Marzipano, a etapa troca para esta cena. */
  target?: TourTarget;
}

export interface Boat {
  id: string;
  name: string;
  model: string;
  /** Comprimento para exibição (ex.: "43 pés"). */
  length: string;
  /** `null` = ainda não informado no cadastro. Nunca inventar. */
  capacity: number | null;
  /** `null` = sem ponto de saída definido (ex.: embarcação demonstrativa). */
  location: string | null;
  cover: MediaImage | null;
  tourMode: TourMode;
  /** Embarcação usada só para demonstrar a experiência. */
  isDemo: boolean;
  tour: TourConfig;
  spaces: BoatSpace[];
  mapZones: BoatMapZone[];
  guidedSteps: GuidedStep[];
  /** Ids dos espaços exibidos no painel de detalhes, em ordem. */
  detailSpaceIds: string[];
}
