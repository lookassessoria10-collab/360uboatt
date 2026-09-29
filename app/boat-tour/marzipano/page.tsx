import type { Metadata } from "next";
import { BoatTourPage } from "@/components/boat-tour/BoatTourPage";
import { demoBoatMarzipano } from "@/data/demoBoat";

/**
 * Prévia técnica: a mesma página com `tourMode: "marzipano"`.
 * Sem panoramas cadastrados, o viewer mostra cenas e hotspots sobre uma
 * grade equiretangular (sem imagens falsas).
 */
export const metadata: Metadata = {
  title: "Prévia técnica · modo Marzipano",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <BoatTourPage boat={demoBoatMarzipano} />;
}
