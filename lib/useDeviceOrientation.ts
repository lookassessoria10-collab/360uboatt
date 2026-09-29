"use client";

import { useCallback, useState, useSyncExternalStore } from "react";

type PermissionState = "idle" | "granted" | "denied";

type DeviceOrientationEventWithPermission = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<"granted" | "denied">;
};

const noopSubscribe = () => () => {};

function getSupported() {
  return "DeviceOrientationEvent" in window && window.matchMedia("(pointer: coarse)").matches;
}

/**
 * "Mover com o celular" (modo Marzipano).
 *
 * A permissão só é pedida dentro de `request()`, que deve ser chamado
 * a partir de um clique do usuário. Nunca é solicitada automaticamente.
 */
export function useDeviceOrientationPermission() {
  const supported = useSyncExternalStore(noopSubscribe, getSupported, () => false);
  const [state, setState] = useState<PermissionState>("idle");

  const request = useCallback(async () => {
    const DeviceOrientation = window.DeviceOrientationEvent as DeviceOrientationEventWithPermission | undefined;
    if (!DeviceOrientation) {
      setState("denied");
      return false;
    }
    // iOS 13+ exige permissão explícita.
    if (typeof DeviceOrientation.requestPermission === "function") {
      try {
        const result = await DeviceOrientation.requestPermission();
        setState(result === "granted" ? "granted" : "denied");
        return result === "granted";
      } catch {
        setState("denied");
        return false;
      }
    }
    setState("granted");
    return true;
  }, []);

  const disable = useCallback(() => setState("idle"), []);

  return { supported, state, enabled: state === "granted", request, disable };
}

/** Diferença angular mais curta em graus, no intervalo [-180, 180]. */
export function shortestAngleDelta(deg: number) {
  return ((((deg + 180) % 360) + 360) % 360) - 180;
}
