import type { Boat, BoatSpace } from "@/types/boat";
import { BoatMap } from "./BoatMap";
import { spaceIcons } from "./icons";

/** "Conheça os espaços": mapa da lancha + descrição em texto (alternativa ao tour). */
export function SpacesSection({ boat }: { boat: Boat }) {
  const spaces = boat.detailSpaceIds
    .map((id) => boat.spaces.find((space) => space.id === id))
    .filter((space): space is BoatSpace => Boolean(space));

  return (
    <section id="espacos" aria-labelledby="espacos-title" className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-bold tracking-[0.16em] text-ocean-700 uppercase">Mapa da embarcação</p>
          <h2 id="espacos-title" className="mt-3 text-3xl font-extrabold tracking-[-0.025em] text-balance sm:text-5xl">
            Conheça os espaços.
          </h2>
          <p className="mt-4 text-lg text-pretty text-ink-600">
            Toque em uma área da lancha para saber o que observar quando estiver a bordo.
          </p>
        </div>

        <BoatMap zones={boat.mapZones} spaces={boat.spaces} className="mt-10" />

        <div className="mt-16">
          <h3 className="text-lg font-bold tracking-tight">A embarcação por escrito</h3>
          <p className="mt-1 text-ink-600">
            Para quem prefere ler ou não consegue usar o tour 360°.
            {boat.isDemo && " Dados demonstrativos."}
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {spaces.map((space) => {
              const Icon = spaceIcons[space.icon];
              return (
                <li key={space.id} className="rounded-3xl bg-mist p-5">
                  <span className="grid size-11 place-items-center rounded-2xl bg-white text-ocean-500 ring-1 ring-line">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <h4 className="mt-4 font-bold">{space.name}</h4>
                  <p className="mt-1 text-[15px] text-ink-600">{space.description}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
