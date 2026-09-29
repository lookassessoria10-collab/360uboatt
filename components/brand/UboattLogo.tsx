import Image from "next/image";
import { brand } from "@/data/brand";
import { cn } from "@/lib/cn";

interface UboattLogoProps {
  tone?: "dark" | "light";
  /** Só o símbolo, sem o nome (telas estreitas). */
  compact?: boolean;
  className?: string;
}

/**
 * Logo Uboatt. Usa o arquivo de `data/brand.ts` quando disponível;
 * senão, um placeholder textual "UBOATT".
 */
export function UboattLogo({ tone = "dark", compact = false, className }: UboattLogoProps) {
  const file = tone === "light" ? (brand.logoOnDark ?? brand.logo) : brand.logo;

  if (file && !compact) {
    return <Image src={file.src} alt={brand.name} width={file.width} height={file.height} className={cn("h-8 w-auto", className)} />;
  }

  const light = tone === "light";
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <svg viewBox="0 0 32 32" className="size-8 shrink-0" aria-hidden="true">
        <rect width="32" height="32" rx="9" fill={light ? "#FFFFFF" : "#062B55"} />
        <path
          d="M10 8.5v7.2a6 6 0 0 0 12 0V8.5"
          fill="none"
          stroke={light ? "#062B55" : "#FFFFFF"}
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M6.5 25c2.3 0 2.3-1.5 4.6-1.5s2.3 1.5 4.6 1.5 2.3-1.5 4.6-1.5 2.3 1.5 4.6 1.5"
          fill="none"
          stroke="#24A9E0"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>
      {compact ? (
        <span className="sr-only">{brand.name}</span>
      ) : (
        <span className={cn("text-[1.05rem] font-extrabold tracking-[0.16em]", light ? "text-white" : "text-navy-900")}>
          UBOATT
        </span>
      )}
    </span>
  );
}
