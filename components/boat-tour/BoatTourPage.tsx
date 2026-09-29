import type { Boat } from "@/types/boat";
import { BoatHero } from "./BoatHero";
import { BoatTourProvider } from "./BoatTourProvider";
import { CampaignSection } from "./CampaignSection";
import { HowItWorks } from "./HowItWorks";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";
import { SpacesSection } from "./SpacesSection";

/**
 * "Conheça antes de embarcar": página da embarcação com o tour 360°
 * integrado à jornada de escolha. As seções são Server Components; só os
 * pontos interativos rodam no cliente.
 */
export function BoatTourPage({ boat }: { boat: Boat }) {
  return (
    <BoatTourProvider boat={boat}>
      <SiteHeader />
      <main>
        <BoatHero boat={boat} />
        <SpacesSection boat={boat} />
        <HowItWorks />
        <CampaignSection />
      </main>
      <SiteFooter />
    </BoatTourProvider>
  );
}
