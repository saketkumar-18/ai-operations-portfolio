// ============================================================
// lib/utils.ts
// ============================================================

export const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
// frame-rate independent damping
export const damp = (a: number, b: number, lambda: number, dt: number) =>
  lerp(a, b, 1 - Math.exp(-lambda * dt));
export const pad2 = (n: number) => String(n).padStart(2, "0");

export function formatCoord(lat: number, lon: number) {
  const latS = `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? "N" : "S"}`;
  const lonS = `${Math.abs(lon).toFixed(4)}° ${lon >= 0 ? "E" : "W"}`;
  return { latS, lonS };
}

// Real locations used as design coordinates (from actual life data):
// Delhi (base), IIT Guwahati (research). Not fake precision.
export const COORDS = {
  delhi: { lat: 28.6139, lon: 77.209 },
  guwahati: { lat: 26.2442, lon: 91.8457 },
};
