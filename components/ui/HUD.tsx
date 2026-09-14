"use client";

// ============================================================
// components/ui/HUD.tsx — corner readouts + toasts + controls:
// audio toggle, recruiter mode, assistant, mission directory.
// ============================================================

import { useEffect, useRef } from "react";
import { locations } from "../../data/navigation";
import { useWorld } from "../../lib/store";
import { profile } from "../../data/profile";
import MissionDossier from "./MissionDossier";
import MissionDirectory from "./MissionDirectory";
import AIConsole from "./AIConsole";
import BattleHUD from "./BattleHUD";
import AudioEngine from "../../lib/audio";
export default function HUD() {
  const activeLocation = useWorld((s) => s.activeLocation);
  const toasts = useWorld((s) => s.toasts);
  const audioEnabled = useWorld((s) => s.audioEnabled);
  const setAudioEnabled = useWorld((s) => s.setAudioEnabled);
  const mode = useWorld((s) => s.mode);
  const setMode = useWorld((s) => s.setMode);
  const showAssistant = useWorld((s) => s.showAssistant);
  const setShowAssistant = useWorld((s) => s.setShowAssistant);
  const setShowDirectory = useWorld((s) => s.toast); // placeholder ref
  const audioRef = useRef<AudioEngine | null>(null);

  const loc = locations.find((l) => l.id === activeLocation)!;

  useEffect(() => {
    if (audioEnabled && !audioRef.current) {
      audioRef.current = new AudioEngine();
      audioRef.current.start();
    } else if (!audioEnabled && audioRef.current) {
      audioRef.current.stop();
      audioRef.current = null;
    }
  }, [audioEnabled]);

  return (
    <>
      {/* top-left: operator id */}
      <div className="fixed top-4 left-4 z-40 select-none">
        <div className="tac-panel px-4 py-2">
          <div className="font-mono-t text-[12px] tracking-[0.2em]">
            <span className="text-tac-orange">{profile.callsign}</span>
            <span className="text-tac-gray"> // AI OPERATIONS</span>
          </div>
          <div className="hud-label mt-0.5">{loc.represents}</div>
        </div>
      </div>

      {/* location readout — above health bar, bottom-left */}
      <div className="fixed bottom-24 left-4 z-30 select-none pointer-events-none">
        <div className="font-mono-t text-[10px] tracking-[0.14em] text-tac-orange">
          {loc.no} · {loc.name}
        </div>
        <div className="hud-label mt-0.5 text-tac-green flex items-center gap-1.5">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-tac-green" />
          SYSTEM ONLINE
        </div>
      </div>

      {/* bottom-right (above minimap): status + controls */}
      <div className="fixed bottom-[270px] right-4 z-40 flex flex-col items-end gap-2">
        <div className="flex gap-2">
          <button
            className="btn-tac ghost !px-3 !py-2 text-[10px]"
            onClick={() => setAudioEnabled(!audioEnabled)}
            aria-pressed={audioEnabled}
            title="Toggle ambient audio"
          >
            {audioEnabled ? "◉ AUDIO ON" : "◎ AUDIO OFF"}
          </button>
          <button
            className="btn-tac ghost !px-3 !py-2 text-[10px]"
            onClick={() => setShowAssistant(!showAssistant)}
            aria-pressed={showAssistant}
            title="S.A.K.E.T. assistant"
          >
            ◈ S.A.K.E.T.
          </button>
          <button
            className="btn-tac ghost !px-3 !py-2 text-[10px]"
            onClick={() =>
              setMode(mode === "recruiter" ? "world" : "recruiter")
            }
            aria-pressed={mode === "recruiter"}
            title="Fast professional view"
          >
            ▤ RECRUITER MODE
          </button>
        </div>
      </div>

      {/* toasts — center-bottom above health bar */}
      <div className="fixed bottom-40 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`tac-panel tac-panel-hi brackets px-5 py-2 font-mono-t text-[11px] tracking-[0.25em] anim-rise ${
              t.kind === "mission"
                ? "text-tac-orange"
                : t.kind === "nav"
                ? "text-tac-green"
                : "text-tac-dim"
            }`}
          >
            ▸ {t.text}
          </div>
        ))}
      </div>

      {/* dossier + directory + assistant + battle HUD */}
      <MissionDossier />
      <MissionDirectory />
      <AIConsole />
      <BattleHUD />
    </>
  );
}
