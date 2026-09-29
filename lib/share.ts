export interface SharePayload {
  title: string;
  text: string;
  url: string;
}

export type ShareResult = "shared" | "copied" | "cancelled" | "failed";

/** URL pública da página do tour (sem hash de estado). */
export function getTourShareUrl(path = "/boat-tour") {
  return new URL(path, window.location.origin).toString();
}

export function buildTourShareMessage(url: string): SharePayload {
  return {
    title: "Tour 360° da lancha | Uboatt",
    text: "Olha a lancha que encontrei para nosso passeio 👀🚤\n\nDá para entrar e conhecer ela em 360° antes de escolher.",
    url,
  };
}

export function buildPlanShareMessage(url: string, dateLabel: string, people: number): SharePayload {
  return {
    title: "Marquei o mar | Uboatt",
    text: `Marquei o mar: passeio de lancha ${dateLabel}, para ${people} ${people === 1 ? "pessoa" : "pessoas"} 🚤\n\nQuem marca, embarca. Dá para conhecer a lancha em 360° antes:`,
    url,
  };
}

function prefersNativeShare() {
  if (typeof navigator.share !== "function") return false;
  // Web Share no mobile; no desktop, copiar o link é mais natural.
  return window.matchMedia("(pointer: coarse)").matches;
}

function legacyCopy(value: string) {
  // Fallback para WebViews sem Clipboard API (ou com ela bloqueada).
  // Com um painel modal aberto o resto da página fica inerte, então o
  // campo temporário precisa ficar dentro do próprio painel.
  const host = document.querySelector<HTMLDialogElement>("dialog.sheet[open]") ?? document.body;
  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  host.appendChild(textarea);
  textarea.select();
  const ok = document.execCommand("copy");
  textarea.remove();
  if (!ok) throw new Error("copy failed");
}

async function copyText(value: string) {
  try {
    if (!navigator.clipboard?.writeText) throw new Error("no clipboard api");
    await navigator.clipboard.writeText(value);
  } catch {
    legacyCopy(value);
  }
}

/** Web Share API quando disponível no mobile; senão copia texto + link. */
export async function shareOrCopy(payload: SharePayload): Promise<ShareResult> {
  if (prefersNativeShare()) {
    const data = { title: payload.title, text: payload.text, url: payload.url };
    if (!navigator.canShare || navigator.canShare(data)) {
      try {
        await navigator.share(data);
        return "shared";
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return "cancelled";
        // Qualquer outro erro: tenta copiar.
      }
    }
  }

  try {
    await copyText(`${payload.text}\n\n${payload.url}`);
    return "copied";
  } catch {
    return "failed";
  }
}
