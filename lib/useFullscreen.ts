"use client";

import { useCallback, useSyncExternalStore } from "react";

type FullscreenDocument = Document & {
  webkitFullscreenEnabled?: boolean;
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void> | void;
};

type FullscreenElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void;
};

function subscribe(onChange: () => void) {
  document.addEventListener("fullscreenchange", onChange);
  document.addEventListener("webkitfullscreenchange", onChange);
  return () => {
    document.removeEventListener("fullscreenchange", onChange);
    document.removeEventListener("webkitfullscreenchange", onChange);
  };
}

const noopSubscribe = () => () => {};

function getIsFullscreen() {
  const doc = document as FullscreenDocument;
  return Boolean(doc.fullscreenElement ?? doc.webkitFullscreenElement);
}

function getSupported() {
  const doc = document as FullscreenDocument;
  // iPhone (Safari) não permite tela cheia em elementos: o botão fica oculto.
  return Boolean(doc.fullscreenEnabled || doc.webkitFullscreenEnabled);
}

/** Tela cheia do documento inteiro, para manter a interface Uboatt visível. */
export function useFullscreen() {
  const isFullscreen = useSyncExternalStore(subscribe, getIsFullscreen, () => false);
  const supported = useSyncExternalStore(noopSubscribe, getSupported, () => false);

  const exit = useCallback(async () => {
    const doc = document as FullscreenDocument;
    if (!getIsFullscreen()) return;
    try {
      if (doc.exitFullscreen) await doc.exitFullscreen();
      else await doc.webkitExitFullscreen?.();
    } catch {
      // Navegador recusou: nada a fazer.
    }
  }, []);

  const toggle = useCallback(async () => {
    if (getIsFullscreen()) return exit();
    const root = document.documentElement as FullscreenElement;
    try {
      if (root.requestFullscreen) await root.requestFullscreen({ navigationUI: "hide" });
      else await root.webkitRequestFullscreen?.();
    } catch {
      // Permissão negada pelo navegador: segue sem tela cheia.
    }
  }, [exit]);

  return { supported, isFullscreen, toggle, exit };
}
