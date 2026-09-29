import { Icon360 } from "@/components/ui/Icon360";
import type { Boat } from "@/types/boat";
import { DetailsButton, EnterTourButton } from "./TourActions";
import { TourPreview } from "./TourPreview";

/** Primeira tela: tour à direita no desktop, primeiro no mobile. */
export function BoatHero({ boat }: { boat: Boat }) {
  return (
    <section id="embarcacao" aria-labelledby="hero-title" className="mx-auto max-w-7xl px-4 pt-4 pb-14 sm:px-6 sm:pt-6 lg:px-8 lg:pt-10 lg:pb-24">
      <div className="grid gap-7 lg:grid-cols-12 lg:items-center lg:gap-12">
        <div className="animate-scale-in lg:order-2 lg:col-span-7">
          <TourPreview boat={boat} />
        </div>

        <div className="animate-fade-up lg:order-1 lg:col-span-5">
          <p className="inline-flex items-center gap-2 rounded-full bg-sea-100 px-3 py-1.5 text-xs font-bold tracking-[0.16em] text-navy-900 uppercase">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-sea-400" />
            Experiência 360°
          </p>

          <h1
            id="hero-title"
            className="mt-4 text-[2.6rem] leading-[1.02] font-extrabold tracking-[-0.035em] text-balance text-navy-900 sm:text-6xl lg:text-[3.4rem] xl:text-[4.1rem]"
          >
            Entre a bordo antes de embarcar.
          </h1>

          <p className="mt-5 max-w-md text-lg text-pretty text-ink-600">
            Conheça os espaços da embarcação, veja onde seu grupo vai ficar e explore cada ambiente antes de escolher o
            passeio.
          </p>

          <dl className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl bg-white px-4 py-3.5 ring-1 ring-line">
            <div>
              <dt className="sr-only">Embarcação</dt>
              <dd className="text-sm font-bold tracking-[0.12em] uppercase">{boat.name}</dd>
            </div>
            <span aria-hidden="true" className="h-4 w-px bg-line" />
            <div>
              <dt className="sr-only">Comprimento</dt>
              <dd className="text-sm font-semibold tracking-[0.12em] text-ink-600 uppercase">{boat.length}</dd>
            </div>
            {boat.isDemo && (
              <div className="ml-auto">
                <dt className="sr-only">Tipo de tour</dt>
                <dd className="rounded-full bg-mist px-2.5 py-1 text-[11px] font-bold tracking-[0.12em] text-ocean-700 uppercase">
                  Tour demonstrativo
                </dd>
              </div>
            )}
          </dl>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <EnterTourButton size="lg" className="sm:px-8">
              <Icon360 className="w-8" />
              Entrar a bordo
            </EnterTourButton>
            <DetailsButton size="lg">Ver detalhes</DetailsButton>
          </div>

          <p className="mt-5 flex items-center gap-2.5 text-sm text-ink-500">
            <Icon360 className="w-8 text-ocean-500" />
            Arraste para olhar ao redor.
          </p>
          <a href="#espacos" className="mt-1 inline-block rounded text-sm text-ocean-700 underline underline-offset-4 hover:text-navy-900">
            Prefere ler? Veja os espaços em texto
          </a>
        </div>
      </div>
    </section>
  );
}
