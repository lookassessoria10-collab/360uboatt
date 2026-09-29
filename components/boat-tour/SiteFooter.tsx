import { UboattLogo } from "@/components/brand/UboattLogo";
import { brand } from "@/data/brand";
import { mediaCredits } from "@/data/media";

export function SiteFooter() {
  return (
    <footer className="bg-navy-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div>
          <UboattLogo tone="light" className="h-14" />
          <p className="mt-4 max-w-xs text-sm text-white/70">
            Passeios privativos de lancha em Salvador e na Baía de Todos os Santos.
          </p>
          <a
            href={brand.siteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block rounded text-sm font-semibold text-sea-300 underline-offset-4 hover:underline"
          >
            uboatt.com.br
            <span className="sr-only"> (abre em nova aba)</span>
          </a>
        </div>

        <div>
          <h2 className="text-xs font-bold tracking-[0.16em] text-white/60 uppercase">Protótipo</h2>
          <p className="mt-3 max-w-sm text-sm text-white/70">
            Tour demonstrativo. A versão final utilizará imagens reais das embarcações Uboatt. O tour 360° exibido é um
            modelo público do Matterport de outra embarcação, incorporado pelo player oficial.
          </p>
        </div>

        <div>
          <h2 className="text-xs font-bold tracking-[0.16em] text-white/60 uppercase">Fotos</h2>
          <ul className="mt-3 space-y-1.5 text-sm text-white/70">
            {mediaCredits.map((image) =>
              image.credit ? (
                <li key={image.src}>
                  <a href={image.credit.url} target="_blank" rel="noopener noreferrer" className="rounded underline-offset-4 hover:text-white hover:underline">
                    {image.credit.name}
                  </a>{" "}
                  via Unsplash
                </li>
              ) : null,
            )}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-7xl px-4 py-5 text-xs text-white/60 sm:px-6 lg:px-8">
          © {new Date().getFullYear()} Uboatt · Conheça antes de embarcar · Protótipo demonstrativo
        </p>
      </div>
    </footer>
  );
}
