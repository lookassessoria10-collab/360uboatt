import { ArrowRight } from "lucide-react";
import { Photo } from "@/components/ui/Photo";
import { media } from "@/data/media";
import { PlanButton } from "./TourActions";

/** Ponte com a campanha "Quem marca, embarca". */
export function CampaignSection() {
  return (
    <section id="passeios" aria-labelledby="campanha-title" className="px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[32px] bg-navy-900 text-white">
        <div className="absolute inset-0 lg:left-1/3">
          <Photo image={media.sunset} fill sizes="(min-width: 1024px) 70vw, 100vw" className="object-cover" />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/70 to-navy-900/10 lg:bg-gradient-to-r lg:from-navy-900 lg:via-navy-900/50 lg:to-transparent"
          />
        </div>

        <div className="relative flex min-h-[540px] flex-col justify-end p-7 sm:p-12 lg:min-h-[560px] lg:max-w-xl lg:justify-center lg:p-16">
          <p className="text-xs font-bold tracking-[0.2em] text-sea-300 uppercase">Quem marca, embarca</p>
          <h2 id="campanha-title" className="mt-4 text-4xl leading-[1.02] font-extrabold tracking-[-0.03em] text-balance sm:text-6xl">
            O verão começa antes.
          </h2>
          <p className="mt-4 text-xl text-white/85">Começa quando alguém marca a data.</p>

          <div className="mt-9">
            <PlanButton variant="primary" size="lg" className="w-full sm:w-auto sm:px-9">
              Marca o mar
              <ArrowRight className="size-5" aria-hidden="true" />
            </PlanButton>
            <p className="mt-4 text-sm text-white/70">
              Passeios privativos de lancha em Salvador e na Baía de Todos os Santos.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
