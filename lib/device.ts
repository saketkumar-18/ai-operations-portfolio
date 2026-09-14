// ============================================================
// lib/device.ts — Device & capability detection.
// ============================================================

export interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isLowSpec: boolean;
  webglOK: boolean;
  reducedMotion: boolean;
  dpr: number;
}

export function detectDevice(): DeviceInfo {
  if (typeof window === "undefined")
    return { isMobile: false, isTablet: false, isLowSpec: false, webglOK: true, reducedMotion: false, dpr: 1 };

  const ua = navigator.userAgent;
  const isMobile = /Android|iPhone|iPod|Windows Phone/i.test(ua) ||
    (navigator.maxTouchPoints > 1 && window.innerWidth < 820);
  const isTablet = /iPad|Tablet/i.test(ua) ||
    (navigator.maxTouchPoints > 1 && window.innerWidth >= 820 && window.innerWidth < 1280);
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  // WebGL capability check (try/catch, no error UI)
  let webglOK = false;
  try {
    const c = document.createElement("canvas");
    webglOK = !!(window.WebGLRenderingContext &&
      (c.getContext("webgl2") || c.getContext("webgl")));
  } catch {
    webglOK = false;
  }

  // Heuristic: mobiles and low-core devices get lighter scenes
  const cores = (navigator as Navigator & { hardwareConcurrency?: number }).hardwareConcurrency || 4;
  const isLowSpec = isMobile || cores <= 4 || dpr > 2.5;

  return { isMobile, isTablet, isLowSpec, webglOK, reducedMotion, dpr };
}

export function isTouch() {
  return typeof window !== "undefined" && navigator.maxTouchPoints > 0;
}
