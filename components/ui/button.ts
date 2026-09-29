import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "navy" | "outline" | "light" | "ghostDark" | "outlineDark" | "link";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold transition-[background-color,color,box-shadow,transform] duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50";

const sizes: Record<ButtonSize, string> = {
  sm: "h-11 px-4 text-sm",
  md: "h-12 px-5 text-[15px]",
  lg: "h-14 px-7 text-base",
};

const variants: Record<ButtonVariant, string> = {
  // Azul claro com texto marinho: contraste 5,3:1.
  primary: "bg-sea-400 text-navy-950 shadow-[0_10px_24px_-12px_rgb(36_169_224/0.9)] hover:bg-sea-300",
  navy: "bg-navy-900 text-white hover:bg-navy-800",
  outline: "bg-white text-navy-900 ring-1 ring-inset ring-navy-900/15 hover:bg-sea-50 hover:ring-navy-900/30",
  light: "bg-white text-navy-900 hover:bg-sea-50",
  ghostDark: "bg-white/10 text-white hover:bg-white/20",
  outlineDark: "text-white ring-1 ring-inset ring-white/30 hover:bg-white/10",
  link: "h-auto rounded-md px-1 text-ocean-700 underline-offset-4 hover:underline",
};

export function buttonClass({
  variant = "primary",
  size = "md",
  block = false,
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
  className?: string;
} = {}) {
  return cn(base, variant === "link" ? "text-[15px]" : sizes[size], variants[variant], block && "w-full", className);
}

/** Botões da barra inferior do tour no mobile (estilo app). */
export function tabButtonClass({ active = false, primary = false }: { active?: boolean; primary?: boolean } = {}) {
  return cn(
    "flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl px-1 text-[11px] font-semibold leading-none transition-colors",
    primary
      ? "bg-sea-400 text-navy-950 hover:bg-sea-300"
      : active
        ? "bg-white/15 text-white"
        : "text-white/80 hover:bg-white/10 hover:text-white",
  );
}
