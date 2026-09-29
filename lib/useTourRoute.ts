"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * O modo imersivo fica refletido na URL (`#a-bordo`), para que o botão
 * "voltar" do celular feche o tour em vez de sair da página, e para que
 * o link `/boat-tour#a-bordo` abra direto dentro da embarcação.
 */
export const TOUR_HASH = "#a-bordo";
const ROUTE_EVENT = "uboatt:tour-route";

function subscribe(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  window.addEventListener("hashchange", onChange);
  window.addEventListener(ROUTE_EVENT, onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener("hashchange", onChange);
    window.removeEventListener(ROUTE_EVENT, onChange);
  };
}

const getSnapshot = () => window.location.hash === TOUR_HASH;
const getServerSnapshot = () => false;

export function useTourRoute() {
  const isOpen = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const open = useCallback(() => {
    if (getSnapshot()) return;
    window.history.pushState({ uboattTour: true }, "", TOUR_HASH);
    window.dispatchEvent(new Event(ROUTE_EVENT));
  }, []);

  const close = useCallback(() => {
    if (!getSnapshot()) return;
    if (window.history.state?.uboattTour) {
      // Entrada criada por nós: voltar mantém o histórico limpo.
      window.history.back();
      return;
    }
    // Chegou direto pelo link com #a-bordo.
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
    window.dispatchEvent(new Event(ROUTE_EVENT));
  }, []);

  return { isOpen, open, close };
}
