import Link from "next/link";
import { UboattLogo } from "@/components/brand/UboattLogo";
import { MobileMenu, type NavLink } from "./MobileMenu";
import { PrototypeBadge } from "./PrototypeBadge";
import { PlanButton } from "./TourActions";

const links: NavLink[] = [
  { href: "#passeios", label: "Passeios" },
  { href: "#embarcacao", label: "Embarcações" },
  { href: "#como-funciona", label: "Como funciona" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-2 px-4 sm:gap-3 sm:px-6 lg:px-8">
        <Link href="/boat-tour" aria-label="Uboatt — início" className="shrink-0 rounded-lg">
          <UboattLogo priority className="h-9 lg:h-11" />
        </Link>
        <PrototypeBadge className="ml-1" />

        <nav aria-label="Principal" className="ml-auto hidden lg:block">
          <ul className="flex items-center gap-1">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="inline-flex h-11 items-center rounded-full px-4 text-[15px] font-medium text-navy-900/80 transition-colors hover:bg-mist hover:text-navy-900"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-1.5 lg:ml-3">
          <PlanButton size="sm" className="max-sm:hidden">
            Planejar passeio
          </PlanButton>
          {/* Abaixo de 440px o logo completo precisa do espaço: "Planejar" fica no menu. */}
          <PlanButton size="sm" className="px-3.5 max-[439px]:hidden sm:hidden" ariaLabel="Planejar passeio">
            Planejar
          </PlanButton>
          <MobileMenu links={links} />
        </div>
      </div>
    </header>
  );
}
