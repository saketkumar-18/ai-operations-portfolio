"use client";

// ============================================================
// components/ui/RecruiterMode.tsx — fast professional view.
// Same design language, zero exploration friction.
// ============================================================

import { useEffect } from "react";
import { profile } from "../../data/profile";
import { projects, CATEGORY_META } from "../../data/projects";
import { skillGroups } from "../../data/skills";
import { education } from "../../data/education";
import { useWorld } from "../../lib/store";

const SECTIONS = [
  { id: "about", label: "ABOUT" },
  { id: "skills", label: "SKILLS" },
  { id: "projects", label: "PROJECTS" },
  { id: "education", label: "EDUCATION" },
  { id: "contact", label: "CONTACT" },
] as const;

export default function RecruiterMode() {
  const setMode = useWorld((s) => s.setMode);
  const setAudio = useWorld((s) => s.setAudioEnabled);

  useEffect(() => {
    setAudio(false);
  }, [setAudio]);

  return (
    <div className="fixed inset-0 z-[85] bg-tac-bg overflow-y-auto">
      <div className="scanlines fixed inset-0 pointer-events-none opacity-40" />

      {/* top bar */}
      <header className="sticky top-0 z-10 bg-tac-bg/95 backdrop-blur border-b border-tac-paper/10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="font-mono-t text-[13px] tracking-[0.2em]">
            <span className="text-tac-orange">SK</span>
            <span className="text-tac-gray"> // RECRUITER MODE</span>
          </div>
          <button
            className="btn-tac ghost !px-3 !py-2 text-[10px]"
            onClick={() => setMode("world")}
          >
            ↩ FULL EXPERIENCE
          </button>
        </div>
        <nav
          className="max-w-5xl mx-auto px-6 pb-3 flex gap-4 overflow-x-auto"
          aria-label="Section navigation"
        >
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="font-mono-t text-[10px] tracking-[0.2em] text-tac-gray hover:text-tac-orange transition-colors whitespace-nowrap"
            >
              {s.label}
            </a>
          ))}
        </nav>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10 space-y-14">
        {/* ABOUT */}
        <section id="about" className="scroll-mt-28">
          <p className="k-label mb-4">OPERATOR PROFILE</p>
          <h1 className="font-display font-bold text-4xl mb-2">
            SAKET <span className="text-tac-orange">KUMAR</span>
          </h1>
          <p className="font-mono-t text-[12px] tracking-[0.2em] text-tac-dim mb-6">
            {profile.roles.join(" · ")}
          </p>
          <p className="text-[15px] text-tac-dim leading-relaxed max-w-3xl mb-4">
            {profile.about}
          </p>
          <p className="text-[15px] text-tac-dim leading-relaxed max-w-3xl mb-6">
            {profile.aboutLong}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              ["LOCATION", profile.location],
              ["DEGREE", "BSc (Hons.) DS&AI — IIT Guwahati"],
              ["EMAIL", profile.email],
              ["STATUS", profile.statusShort],
            ].map(([k, v]) => (
              <div key={k} className="tac-panel p-4">
                <p className="hud-label">{k}</p>
                <p className="font-mono-t text-[12px] text-tac-dim mt-1.5">{v}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SKILLS */}
        <section id="skills" className="scroll-mt-28">
          <p className="k-label mb-4">TECHNICAL SYSTEMS</p>
          <div className="grid md:grid-cols-2 gap-4">
            {skillGroups.map((g) => (
              <div key={g.id} className="tac-panel p-5">
                <p className="font-mono-t text-[12px] tracking-[0.18em] text-tac-orange mb-3">
                  {g.label}
                </p>
                <div className="flex flex-wrap gap-2">
                  {g.skills.map((s) => (
                    <span
                      key={s.name}
                      className="font-mono-t text-[11px] border border-tac-paper/15 px-2.5 py-1 text-tac-dim"
                    >
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PROJECTS */}
        <section id="projects" className="scroll-mt-28">
          <p className="k-label mb-4">MISSIONS ({projects.length})</p>
          <div className="space-y-3">
            {projects.map((p) => (
              <article key={p.id} className="tac-panel p-5 hover:tac-panel-hi transition-all">
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-2">
                  <span className="font-mono-t text-[11px] text-tac-orange/80">
                    M-{p.missionNo}
                  </span>
                  <h3 className="font-display font-semibold text-lg">{p.name}</h3>
                  <span
                    className="font-mono-t text-[9px] tracking-[0.16em] ml-auto"
                    style={{ color: CATEGORY_META[p.category].accent }}
                  >
                    {CATEGORY_META[p.category].short}
                  </span>
                </div>
                <p className="text-[13.5px] text-tac-gray leading-relaxed mb-3">
                  {p.objective}
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 items-center">
                  {p.metrics?.map((m) => (
                    <span key={m} className="font-mono-t text-[10px] text-tac-green tracking-[0.08em]">
                      ◂ {m}
                    </span>
                  ))}
                  <a
                    className="font-mono-t text-[10px] tracking-[0.16em] text-tac-dim hover:text-tac-orange transition-colors ml-auto"
                    href={p.github}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GITHUB ↗
                  </a>
                  {p.demo && (
                    <a
                      className="font-mono-t text-[10px] tracking-[0.16em] text-tac-dim hover:text-tac-orange transition-colors"
                      href={p.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      LIVE ↗
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* EDUCATION */}
        <section id="education" className="scroll-mt-28">
          <p className="k-label mb-4">EDUCATION</p>
          <div className="tac-panel p-6">
            <p className="font-mono-t text-[11px] text-tac-cyan tracking-[0.2em] mb-2">
              {education.period}
            </p>
            <h3 className="font-display font-semibold text-xl mb-1">
              {education.degree}
            </h3>
            <p className="font-mono-t text-[12px] text-tac-dim mb-4">
              {education.institution}
            </p>
            <p className="text-[14px] text-tac-gray leading-relaxed max-w-3xl">
              {education.detail}
            </p>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="scroll-mt-28 pb-16">
          <p className="k-label mb-4">COMMUNICATION</p>
          <h2 className="font-display font-bold text-3xl mb-6">
            LET&apos;S BUILD THE NEXT{" "}
            <span className="text-tac-orange">INTELLIGENT SYSTEM.</span>
          </h2>
          <div className="flex flex-wrap gap-3">
            <a className="btn-tac solid" href={`mailto:${profile.email}`}>
              ✉ EMAIL
            </a>
            <a
              className="btn-tac"
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              ⌥ LINKEDIN
            </a>
            <a
              className="btn-tac"
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              ▣ GITHUB
            </a>
            <a className="btn-tac ghost" href={profile.resume} download>
              ⤓ DOWNLOAD RESUME
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
