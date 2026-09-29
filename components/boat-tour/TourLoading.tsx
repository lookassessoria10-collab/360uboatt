import { Icon360 } from "@/components/ui/Icon360";
import { cn } from "@/lib/cn";

/** "Preparando seu embarque..." — cobre o viewer até o tour carregar e some com fade. */
export function TourLoading({ visible = true }: { visible?: boolean }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-hidden={!visible}
      className={cn(
        "absolute inset-0 z-10 grid place-items-center overflow-hidden bg-navy-950 transition-[opacity,visibility] duration-700",
        visible ? "visible opacity-100" : "invisible opacity-0",
      )}
    >
      {/* Luz suave de fundo */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_45%,rgb(22_139_197/0.28),transparent_70%)]"
      />

      <div className="relative flex flex-col items-center px-6 text-center text-white">
        <div className="relative grid size-28 place-items-center" aria-hidden="true">
          <span className="absolute inset-0 animate-ripple rounded-full border border-sea-300/50" />
          <span className="absolute inset-0 animate-ripple rounded-full border border-sea-300/50 [animation-delay:1.3s]" />
          <span className="grid size-[72px] place-items-center rounded-full bg-white/10 ring-1 ring-white/15">
            <Icon360 className="w-10 text-white" />
          </span>
        </div>
        <p className="mt-7 text-lg font-semibold tracking-tight sm:text-xl">Preparando seu embarque...</p>
        <p className="mt-1.5 text-sm text-white/70 sm:text-[15px]">Você já vai poder explorar cada espaço.</p>
        <div className="mt-7 h-1 w-40 overflow-hidden rounded-full bg-white/10" aria-hidden="true">
          <div className="h-full w-2/5 animate-progress rounded-full bg-sea-400" />
        </div>
      </div>

      {/* Linha d'água discreta */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1200 40"
        preserveAspectRatio="none"
        className="absolute inset-x-[-24px] bottom-8 h-6 w-[calc(100%+48px)] animate-wave text-sea-400/25"
      >
        <path
          d="M0 20c50 0 50-12 100-12s50 12 100 12 50-12 100-12 50 12 100 12 50-12 100-12 50 12 100 12 50-12 100-12 50 12 100 12 50-12 100-12 50 12 100 12 50-12 100-12 50 12 100 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}
