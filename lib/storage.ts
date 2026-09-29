/**
 * Acesso seguro ao sessionStorage (pode falhar em aba anônima,
 * WebViews do Instagram ou com armazenamento bloqueado).
 */
export const sessionFlags = {
  gestureHintSeen: "uboatt:gesture-hint-seen",
  ctaShown: "uboatt:cta-shown",
} as const;

export function readSessionFlag(key: string): boolean {
  try {
    return window.sessionStorage.getItem(key) === "1";
  } catch {
    return false;
  }
}

export function writeSessionFlag(key: string) {
  try {
    window.sessionStorage.setItem(key, "1");
  } catch {
    // Sem armazenamento: o fluxo continua funcionando, só pode repetir a dica.
  }
}
