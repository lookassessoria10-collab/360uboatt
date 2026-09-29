import type { Metadata } from "next";
import { BoatTourPage } from "@/components/boat-tour/BoatTourPage";
import { demoBoat } from "@/data/demoBoat";

export const metadata: Metadata = {
  title: "Entre a bordo antes de embarcar",
  description: "Conheça cada espaço da embarcação em 360° antes de escolher seu passeio. Protótipo da experiência Uboatt.",
  alternates: { canonical: "/boat-tour" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Uboatt",
    title: "Entre a bordo antes de embarcar | Uboatt",
    description: "Dá para entrar e conhecer a lancha em 360° antes de escolher o passeio.",
  },
};

export default function Page() {
  return <BoatTourPage boat={demoBoat} />;
}
