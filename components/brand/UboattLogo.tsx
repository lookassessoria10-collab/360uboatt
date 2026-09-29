import Image from "next/image";
import { brand } from "@/data/brand";
import { cn } from "@/lib/cn";

interface UboattLogoProps {
  /** "dark" = logo azul-marinho (fundos claros); "light" = versão para fundos escuros. */
  tone?: "dark" | "light";
  /** Só o símbolo do barco, para espaços estreitos. */
  compact?: boolean;
  /** Defina a altura pela classe, ex.: "h-10". A largura acompanha a proporção. */
  className?: string;
  /** Carrega sem lazy-load (logo no topo da página). */
  priority?: boolean;
}

/** Marca oficial da Uboatt. */
export function UboattLogo({ tone = "dark", compact = false, className, priority = false }: UboattLogoProps) {
  const file = (compact ? brand.symbol : brand.logo)[tone];
  return (
    <Image
      src={file.src}
      alt={brand.name}
      width={file.width}
      height={file.height}
      // PNG já otimizado e nítido: servido direto, sem recompressão.
      unoptimized
      loading={priority ? "eager" : "lazy"}
      className={cn("w-auto shrink-0 select-none", className)}
    />
  );
}
