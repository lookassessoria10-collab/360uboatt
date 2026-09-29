import { Icon360 } from "@/components/ui/Icon360";
import { Photo } from "@/components/ui/Photo";
import { media } from "@/data/media";
import { ShareButton } from "./ShareButton";
import { EnterTourButton } from "./TourActions";

const steps = [
  {
    title: "Entre a bordo",
    text: "Explore a lancha em 360° pelo celular e entenda o espaço antes de escolher.",
  },
  {
    title: "Mande no grupo",
    text: "Compartilhe o tour no grupo e deixe todo mundo ver onde vai ficar.",
  },
  {
    title: "Marque o mar",
    text: "Escolha a data, informe o tamanho do grupo e encontre sua embarcação.",
  },
];

export function HowItWorks() {
  return (
    <section id="como-funciona" aria-labelledby="como-funciona-title" className="py-16 sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] bg-navy-900 lg:aspect-[5/6]">
          <Photo image={media.friends} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy-950/60 to-transparent" />
          <p className="absolute right-5 bottom-5 left-5 w-fit rounded-2xl bg-white/90 px-4 py-2 text-sm font-semibold text-navy-900 backdrop-blur">
            Agora eu consigo imaginar meu grupo aqui.
          </p>
        </div>

        <div>
          <p className="text-xs font-bold tracking-[0.16em] text-ocean-700 uppercase">Como funciona</p>
          <h2 id="como-funciona-title" className="mt-3 text-3xl font-extrabold tracking-[-0.025em] text-balance sm:text-5xl">
            Do tour ao passeio marcado.
          </h2>
          <p className="mt-4 max-w-lg text-lg text-pretty text-ink-600">
            Quem organiza não precisa convencer ninguém com fotos soltas. O grupo entra, vê o espaço e decide junto.
          </p>

          <ol className="mt-9 space-y-3">
            {steps.map((step, index) => (
              <li key={step.title} className="flex gap-4 rounded-3xl bg-white p-5 ring-1 ring-line">
                <span className="text-2xl leading-none font-extrabold text-sea-400 tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-bold">{step.title}</h3>
                  <p className="mt-1 text-[15px] text-ink-600">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <EnterTourButton size="lg">
              <Icon360 className="w-8" />
              Explorar em 360°
            </EnterTourButton>
            <ShareButton size="lg" />
          </div>
        </div>
      </div>
    </section>
  );
}
