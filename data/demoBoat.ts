import type { Boat } from "@/types/boat";
import type { BoatScene } from "@/types/tour";

/**
 * Cenas futuras (Marzipano). Estrutura simulada: ainda não existem
 * fotografias 360° reais, por isso `panorama` fica vazio.
 *
 * Quando houver imagens, use JPEG equiretangular 2:1, por exemplo:
 *   panorama: "/boats/<id-da-embarcacao>/cockpit.jpg"
 *
 * Os valores de yaw/pitch dos hotspots abaixo são apenas exemplos de posição.
 * Textos de hotspots de informação devem vir do cadastro de cada embarcação:
 * nunca inventar especificações.
 */
export const demoBoatScenes: BoatScene[] = [
  {
    id: "cockpit",
    name: "Cockpit",
    panorama: "",
    initialYaw: 0,
    initialPitch: 0,
    hotspots: [
      { id: "go-proa", type: "navigation", yaw: 1.2, pitch: -0.1, label: "Ir para a proa", targetScene: "proa" },
      { id: "go-cabine", type: "navigation", yaw: -0.6, pitch: 0.2, label: "Entrar na cabine", targetScene: "cabine" },
      { id: "go-popa", type: "navigation", yaw: 2.9, pitch: 0.15, label: "Ir para a popa", targetScene: "popa" },
      { id: "info-convivencia", type: "info", yaw: -1.8, pitch: 0.3, label: "Área de convivência" },
      { id: "info-som", type: "info", yaw: 0.5, pitch: -0.05, label: "Sistema de som" },
    ],
  },
  {
    id: "proa",
    name: "Proa",
    panorama: "",
    initialYaw: 0,
    hotspots: [
      { id: "back-cockpit", type: "navigation", yaw: 3.1, pitch: 0.1, label: "Voltar ao cockpit", targetScene: "cockpit" },
      { id: "info-capacidade", type: "info", yaw: 0.3, pitch: 0.4, label: "Capacidade" },
    ],
  },
  {
    id: "cabine",
    name: "Cabine",
    panorama: "",
    initialYaw: 0,
    hotspots: [
      { id: "back-cockpit", type: "navigation", yaw: 2.8, pitch: 0.05, label: "Voltar ao cockpit", targetScene: "cockpit" },
      { id: "info-banheiro", type: "info", yaw: -1.2, pitch: 0.1, label: "Banheiro" },
    ],
  },
  {
    id: "popa",
    name: "Popa",
    panorama: "",
    initialYaw: 0,
    hotspots: [
      { id: "go-cockpit", type: "navigation", yaw: 0, pitch: 0.15, label: "Ir para o cockpit", targetScene: "cockpit" },
      { id: "info-ducha", type: "info", yaw: -2.4, pitch: 0.35, label: "Ducha externa" },
      { id: "info-cooler", type: "info", yaw: 2.2, pitch: 0.3, label: "Cooler" },
    ],
  },
];

/**
 * Embarcação demonstrativa.
 *
 * O tour Matterport abaixo é público e pertence a outra embarcação
 * (Fairline Targa 43). Ele é usado APENAS para demonstrar a interação e
 * será substituído pelas embarcações reais da Uboatt.
 */
export const demoBoat: Boat = {
  id: "demo-fairline-targa-43",
  name: "Fairline Targa 43",
  model: "Fairline Targa 43",
  length: "43 pés",
  capacity: null,
  location: null,
  cover: null,
  tourMode: "matterport",
  isDemo: true,
  tour: {
    matterport: { modelId: "WVdYpfzTFcg", params: { play: 1 } },
    marzipano: { scenes: demoBoatScenes, initialSceneId: "cockpit" },
  },
  spaces: [
    {
      id: "area-externa",
      name: "Área externa",
      description: "Espaço aberto onde o grupo aproveita o sol e o mar durante o passeio.",
      tip: "Repare onde dá para sentar, onde bate sol e onde tem sombra.",
      icon: "sun",
      target: { sceneId: "popa" },
    },
    {
      id: "popa",
      name: "Popa",
      description: "Parte traseira da lancha, geralmente usada para embarque e acesso ao mar.",
      tip: "Veja por onde o grupo embarca e como é a circulação até o cockpit.",
      icon: "stern",
      target: { sceneId: "popa" },
    },
    {
      id: "cockpit",
      name: "Cockpit",
      description: "Área de convivência e circulação da embarcação.",
      tip: "Imagine seu grupo aqui: como todo mundo se acomoda e circula?",
      icon: "users",
      target: { sceneId: "cockpit" },
    },
    {
      id: "cabine",
      name: "Cabine",
      description: "Ambiente interno, protegido do sol e do vento.",
      tip: "Observe o espaço e onde dá para guardar bolsas e mochilas.",
      icon: "door",
      target: { sceneId: "cabine" },
    },
    {
      id: "banheiro",
      name: "Banheiro",
      description: "Localização e acesso ao banheiro. Os detalhes são confirmados no cadastro de cada embarcação.",
      tip: "Procure no tour onde fica e como é o acesso.",
      icon: "bath",
      target: { sceneId: "cabine", yaw: -1.2, pitch: 0.1 },
    },
    {
      id: "proa",
      name: "Proa",
      description: "Parte da frente da lancha, com vista aberta para o mar.",
      tip: "Veja quanto espaço existe para o grupo aproveitar a vista.",
      icon: "bow",
      target: { sceneId: "proa" },
    },
  ],
  mapZones: [
    { id: "popa", label: "Popa", spaceId: "popa", target: { sceneId: "popa" } },
    { id: "cockpit", label: "Cockpit", spaceId: "cockpit", target: { sceneId: "cockpit" } },
    { id: "cabine", label: "Cabine", spaceId: "cabine", target: { sceneId: "cabine" } },
    { id: "proa", label: "Proa", spaceId: "proa", target: { sceneId: "proa" } },
  ],
  guidedSteps: [
    {
      id: "passo-area-externa",
      spaceId: "area-externa",
      zoneId: "popa",
      title: "Área externa",
      text: "É onde o grupo passa boa parte do passeio.",
      tip: "Repare onde dá para sentar, onde bate sol e onde tem sombra.",
      target: { sceneId: "popa" },
    },
    {
      id: "passo-cockpit",
      spaceId: "cockpit",
      zoneId: "cockpit",
      title: "Cockpit",
      text: "Área de convivência e circulação da embarcação.",
      tip: "Imagine seu grupo aqui: como todo mundo se acomoda e circula?",
      target: { sceneId: "cockpit" },
    },
    {
      id: "passo-cabine",
      spaceId: "cabine",
      zoneId: "cabine",
      title: "Cabine",
      text: "Ambiente interno, protegido do sol e do vento.",
      tip: "Observe o espaço e onde dá para guardar bolsas e mochilas.",
      target: { sceneId: "cabine" },
    },
    {
      id: "passo-proa",
      spaceId: "proa",
      zoneId: "proa",
      title: "Proa",
      text: "A parte da frente da lancha, com vista aberta para o mar.",
      tip: "Veja quanto espaço existe para o grupo aproveitar a vista.",
      target: { sceneId: "proa" },
    },
  ],
  detailSpaceIds: ["area-externa", "cockpit", "cabine", "banheiro", "proa"],
};

/** Mesma embarcação configurada para o modo Marzipano (prévia técnica). */
export const demoBoatMarzipano: Boat = { ...demoBoat, tourMode: "marzipano" };
