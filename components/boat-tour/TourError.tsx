import { RefreshCw, WifiOff } from "lucide-react";
import { buttonClass } from "@/components/ui/button";

interface TourErrorProps {
  onRetry: () => void;
  onFallback?: () => void;
}

/** Nunca deixa tela branca: explica e oferece caminhos. */
export function TourError({ onRetry, onFallback }: TourErrorProps) {
  return (
    <div role="alert" className="absolute inset-0 z-10 grid place-items-center bg-navy-950 px-6 text-white">
      <div className="max-w-sm animate-fade-up text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-white/10 ring-1 ring-white/15">
          <WifiOff className="size-6 text-sea-300" aria-hidden="true" />
        </span>
        <h2 className="mt-5 text-xl font-bold tracking-tight">Não conseguimos abrir o tour agora.</h2>
        <p className="mt-2 text-[15px] text-white/70">
          Pode ser a conexão ou uma instabilidade momentânea. Tente de novo ou veja os espaços da embarcação.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button type="button" onClick={onRetry} className={buttonClass({ variant: "primary" })}>
            <RefreshCw className="size-[18px]" aria-hidden="true" />
            Tentar novamente
          </button>
          {onFallback && (
            <button type="button" onClick={onFallback} className={buttonClass({ variant: "outlineDark" })}>
              Ver embarcação
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
