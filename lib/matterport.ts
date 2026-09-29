import type { MatterportSource } from "@/types/tour";

export const MATTERPORT_ORIGIN = "https://my.matterport.com";

/**
 * Monta a URL do iframe público oficial do Matterport.
 * Ex.: { modelId: "WVdYpfzTFcg", params: { play: 1 } }
 *   → https://my.matterport.com/show/?m=WVdYpfzTFcg&play=1
 *
 * Referência de parâmetros: https://support.matterport.com/s/article/URL-Parameters
 */
export function buildMatterportUrl({ modelId, params = {} }: MatterportSource) {
  const url = new URL("/show/", MATTERPORT_ORIGIN);
  url.searchParams.set("m", modelId);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, typeof value === "boolean" ? String(Number(value)) : String(value));
  }
  return url.toString();
}
