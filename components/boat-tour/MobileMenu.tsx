"use client";

import { CalendarDays, ChevronRight, Menu } from "lucide-react";
import { useState } from "react";
import { buttonClass } from "@/components/ui/button";
import { Sheet, useSheet } from "@/components/ui/Sheet";
import { useBoatTour } from "./BoatTourProvider";

export interface NavLink {
  href: string;
  label: string;
}

export function MobileMenu({ links }: { links: NavLink[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Abrir menu"
        aria-haspopup="dialog"
        className="grid size-11 place-items-center rounded-full text-navy-900 transition-colors hover:bg-mist lg:hidden"
      >
        <Menu className="size-6" aria-hidden="true" />
      </button>
      <Sheet open={open} onClose={() => setOpen(false)} placement="bottom" title="Menu" closeLabel="Fechar menu">
        <MenuLinks links={links} />
      </Sheet>
    </>
  );
}

function MenuLinks({ links }: { links: NavLink[] }) {
  const { close } = useSheet();
  const { openPlanner } = useBoatTour();
  return (
    <nav aria-label="Principal">
      <ul className="divide-y divide-line">
        {links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              onClick={(event) => {
                // Fecha o painel e rola até a seção depois da animação.
                event.preventDefault();
                close();
                window.setTimeout(() => document.querySelector(link.href)?.scrollIntoView({ behavior: "smooth" }), 220);
              }}
              className="flex h-14 items-center justify-between text-lg font-semibold"
            >
              {link.label}
              <ChevronRight className="size-5 text-ink-500" aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => {
          close();
          openPlanner("form");
        }}
        className={buttonClass({ variant: "primary", size: "lg", block: true, className: "mt-5" })}
      >
        <CalendarDays className="size-5" aria-hidden="true" />
        Planejar passeio
      </button>
    </nav>
  );
}
