// ============================================================
// lib/store.ts — Zustand store: central world state.
// ============================================================

"use client";

import { create } from "zustand";
import { locations as LOCATIONS } from "../data/navigation";
import type { LocationId } from "../data/navigation";
import type { Project } from "../data/projects";

export type Mode = "boot" | "world" | "recruiter";
export type ToastKind = "info" | "mission" | "nav" | "link";

interface Toast {
  id: number;
  text: string;
  kind: ToastKind;
}

interface WorldState {
  mode: Mode;
  started: boolean;
  activeLocation: LocationId;
  journey: number; // 0..1 scroll progress
  targetJourney: number; // where we want to be (scroll or click)
  audioEnabled: boolean;
  showAssistant: boolean;
  activeProject: Project | null; // dossier open
  highlightProject: string | null; // 3D highlight
  filter: string; // mission filter
  toasts: Toast[];
  lowSpec: boolean; // mobile / low-power detected
  webglOK: boolean | null; // null = unchecked

  setMode: (m: Mode) => void;
  setStarted: (s: boolean) => void;
  setActiveLocation: (id: LocationId, announce?: boolean) => void;
  setJourney: (j: number) => void;
  setTargetJourney: (j: number) => void;
  goto: (id: LocationId) => void;
  openProject: (p: Project | null) => void;
  setHighlightProject: (id: string | null) => void;
  setFilter: (f: string) => void;
  toast: (text: string, kind?: ToastKind) => void;
  dismissToast: (id: number) => void;
  setAudioEnabled: (b: boolean) => void;
  setShowAssistant: (b: boolean) => void;
  setLowSpec: (b: boolean) => void;
  setWebglOK: (b: boolean | null) => void;
}

let toastId = 0;

export const useWorld = create<WorldState>((set, get) => ({
  mode: "boot",
  started: false,
  activeLocation: "command",
  journey: 0,
  targetJourney: 0,
  audioEnabled: false, // default muted
  showAssistant: false,
  activeProject: null,
  highlightProject: null,
  filter: "ALL",
  toasts: [],
  lowSpec: false,
  webglOK: null,

  setMode: (m) => set({ mode: m }),
  setStarted: (s) => set({ started: s }),
  setActiveLocation: (id, announce) => {
    const loc = LOCATIONS.find((l) => l.id === id);
    if (announce && loc && get().activeLocation !== id) {
      get().toast(loc.message, "nav");
    }
    set({ activeLocation: id });
  },
  setJourney: (j) => set({ journey: j }),
  setTargetJourney: (j) => set({ targetJourney: j }),
  goto: (id) => {
    const loc = LOCATIONS.find((l) => l.id === id);
    if (!loc) return;
    if (get().mode === "recruiter") {
      // recruiter mode: switch section via hash
      if (typeof window !== "undefined")
        window.location.hash = id;
      return;
    }
    set({ targetJourney: loc.journey });
    // keep window scroll in sync so the wheel doesn't fight the jump
    if (typeof window !== "undefined") {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      window.scrollTo(0, max * loc.journey);
    }
  },
  openProject: (p) => {
    if (p) get().toast("MISSION BRIEFING LOADED", "mission");
    set({ activeProject: p });
  },
  setHighlightProject: (id) => set({ highlightProject: id }),
  setFilter: (f) => set({ filter: f }),
  toast: (text, kind = "info") => {
    const id = ++toastId;
    set((s) => ({ toasts: [...s.toasts.slice(-2), { id, text, kind }] }));
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, 2600);
  },
  dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
  setAudioEnabled: (b) => set({ audioEnabled: b }),
  setShowAssistant: (b) => set({ showAssistant: b }),
  setLowSpec: (b) => set({ lowSpec: b }),
  setWebglOK: (b) => set({ webglOK: b }),
}));
