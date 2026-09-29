"use client";

import { FlaskConical } from "lucide-react";
import { useState } from "react";
import { buttonClass } from "@/components/ui/button";
import { Sheet, SheetCloseButton } from "@/components/ui/Sheet";
import { cn } from "@/lib/cn";

/** Selo permanente "PROTÓTIPO" com explicação ao tocar. */
export function PrototypeBadge({ tone = "light", className }: { tone?: "light" | "dark"; className?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
        className={cn("group inline-flex h-11 shrink-0 items-center rounded-full", className)}
      >
        <span
          className={cn(
            "inline-flex h-7 items-center gap-1.5 rounded-full px-2.5 text-[11px] font-bold tracking-[0.12em] uppercase ring-1 transition-colors ring-inset",
            tone === "dark"
              ? "bg-amber-300/15 text-amber-200 ring-amber-300/30 group-hover:bg-amber-300/25"
              : "bg-amber-50 text-amber-900 ring-amber-200 group-hover:bg-amber-100",
          )}
        >
          <FlaskConical className="size-3.5" aria-hidden="true" />
          Protótipo
        </span>
      </button>

      <Sheet
        open={open}
        onClose={() => setOpen(false)}
        placement="center"
        eyebrow="Conheça antes de embarcar"
        title="Protótipo"
        footer={<SheetCloseButton className={buttonClass({ variant: "navy", block: true })}>Entendi</SheetCloseButton>}
      >
        <p className="text-[15px] leading-relaxed text-ink-600">
          Este projeto demonstra como poderá funcionar o tour 360 das embarcações Uboatt. A embarcação exibida atualmente
          pertence a uma demonstração externa e será substituída por conteúdo próprio.
        </p>
      </Sheet>
    </>
  );
}
