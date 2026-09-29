import { cn } from "@/lib/cn";

/** Pequeno ícone "360°" com órbita, usado em dicas e no tour. */
export function Icon360({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 34 22" fill="none" aria-hidden="true" className={cn("h-auto w-8", className)}>
      <text
        x="17"
        y="11.5"
        textAnchor="middle"
        fontSize="10"
        fontWeight="700"
        fill="currentColor"
        fontFamily="inherit"
        letterSpacing="-0.2"
      >
        360°
      </text>
      <path
        d="M3.5 12.8c0 3.1 6 5.6 13.5 5.6s13.5-2.5 13.5-5.6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path d="m27.6 16.9 3.1-4.2 1.9 4.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
