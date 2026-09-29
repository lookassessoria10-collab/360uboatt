"use client";

import { Send } from "lucide-react";
import { useState } from "react";
import { buttonClass, tabButtonClass, type ButtonSize, type ButtonVariant } from "@/components/ui/button";
import { useToast } from "@/components/ui/Toast";
import { buildTourShareMessage, getTourShareUrl, shareOrCopy, type SharePayload } from "@/lib/share";

interface ShareButtonProps {
  label?: string;
  /** "tab" = botão da barra inferior mobile do tour. */
  variant?: ButtonVariant | "tab";
  size?: ButtonSize;
  block?: boolean;
  className?: string;
  /** Mensagem customizada; padrão: convite para ver o tour 360°. */
  getPayload?: () => SharePayload;
}

/**
 * "Mandar no grupo": Web Share API no mobile (WhatsApp, Instagram…);
 * no desktop ou sem suporte, copia a mensagem com o link.
 */
export function ShareButton({ label = "Mandar no grupo", variant = "outline", size = "md", block, className, getPayload }: ShareButtonProps) {
  const toast = useToast();
  const [busy, setBusy] = useState(false);

  async function handleClick() {
    if (busy) return;
    setBusy(true);
    try {
      const payload = getPayload?.() ?? buildTourShareMessage(getTourShareUrl());
      const result = await shareOrCopy(payload);
      if (result === "copied") toast("Link copiado. Agora manda no grupo.");
      if (result === "failed") toast("Não deu para copiar. Copie o endereço da página.", "info");
    } finally {
      setBusy(false);
    }
  }

  const ariaLabel = label === "Mandar no grupo" ? undefined : `${label}: mandar no grupo`;

  if (variant === "tab") {
    return (
      <button type="button" onClick={handleClick} aria-label="Mandar no grupo" aria-busy={busy} className={tabButtonClass()}>
        <Send className="size-[22px]" aria-hidden="true" />
        {label}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={ariaLabel}
      aria-busy={busy}
      className={buttonClass({ variant, size, block, className })}
    >
      <Send className="size-[18px]" aria-hidden="true" />
      {label}
    </button>
  );
}
