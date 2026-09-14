"use client";

// ============================================================
// components/ui/Fallback2D.tsx — cinematic 2D version used when
// WebGL is unavailable OR on mobile (lightweight 2.5D journey).
// Content parity with the 3D world — nothing depends on WebGL.
// ============================================================

import { useEffect, useRef, useState } from "react";
import { profile } from "../../data/profile";
import { projects, CATEGORY_META } from "../../data/projects";
import { skillGroups } from "../../data/skills";
import { education } from "../../data/education";
import { locations } from "../../data/navigation";
import { useWorld } from "../../lib/store";

/* Parallax layer: depth-shifted background with scroll */
function Layer({
  speed,
  className,
  children,
}: {
  speed: number;
  className: string;
  children?: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onScroll = () => {
      if (ref.current)
        ref.current.style.transform = `translateY(${-window.scrollY * speed}px)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [speed]);
  return <div ref={ref} className={className} />;
}

function SectionTitle({ no, name, represents }: { no: string; name: string; represents: string }) {
  return (
    <header className="mb-8">
      <p className="font-mono-t text-[11px] tracking-[0.3em] text-tac-gray mb-2">
        LOCATION {no} // {represents}
      </p>
      <h2 className="font-display font-bold text-3xl md:text-4xl text-tac-paper">
        {name}
      </h2>
      <div className="w-16 h-0.5 bg-tac-orange mt-4" />
    </header>
  );
}

export default function Fallback2D() {
  const setMode = useWorld((s) => s.setMode);
  const toast = useWorld((s) => s.toast);
  const [filter, setFilter] = useState("ALL");
  const visible = projects.filter((p) => filter === "ALL" || p.category === filter);

  useEffect(() => {
    toast("LIGHTWEIGHT MODE ENGAGED", "info");
  }, [toast]);

  return (
    <div className="relative z-10">
      {/* parallax atmosphere */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <Layer
          speed={0.05}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,rgba(232,163,61,0.14),transparent_55%),radial-gradient(ellipse_at_20%_80%,rgba(79,163,199,0.08),transparent_50%)]" />
        </Layer>
        <Layer
          speed={0.12}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "linear-gradient(rgba(95,168,106,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(95,168,106,0.07) 1px, transparent 1px)",
              backgroundSize: "72px 72px",
            }}
          />
        </Layer>
        <div className="absolute inset-0 scanlines opacity-60" />
      </div>

      {/* recruiter toggle */}
      <div className="fixed top-4 right-4 z-50">
        <button
          className="btn-tac ghost !px-3 !py-2 text-[10px]"
          onClick={() => setMode("recruiter")}
        >
          ▤ RECRUITER MODE
        </button>
      </div>

      {/* HERO */}
      <section className="min-h-[92vh] flex items-center justify-center relative px-6">
        <div className="text-center max-w-2xl">
          <p className="font-mono-t text-[11px] tracking-[0.4em] text-tac-orange mb-4">
            {profile.roles.join(" · ")}
          </p>
          <h1 className="font-display font-bold text-6xl md:text-7xl mb-4 leading-[0.95]">
            SAKET
            <br />
            <span className="text-tac-orange">KUMAR</span>
          </h1>
          <p className="text-tac-dim text-lg italic mb-8">{profile.motto}</p>
          <a href="#command" className="btn-tac solid">
            ENTER THE SYSTEM ↓
          </a>
        </div>
      </section>

      <main className="relative max-w-4xl mx-auto px-6 pb-32 space-y-32">
        {/* 01 COMMAND CENTER — ABOUT */}
        <section id="command" className="scroll-mt-20">
          <SectionTitle no="01" name="COMMAND CENTER" represents="ABOUT ME" />
          <div className="tac-panel tac-panel-hi brackets p-8">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/3">
                <div className="border border-tac-orange/30 p-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={profile.photo}
                    alt="Saket Kumar"
                    className="w-full grayscale-[35%]"
                  />
                </div>
                <div className="mt-4 font-mono-t text-[10px] tracking-[0.16em] text-tac-gray space-y-1.5">
                  <p>◈ BASE: DELHI, INDIA</p>
                  <p>◈ STATUS: <span className="text-tac-green">OPEN TO WORK</span></p>
                  <p>◈ DIVISION: IIT GUWAHATI</p>
                </div>
              </div>
              <div className="md:w-2/3">
                <p className="k-label mb-3">OPERATOR DOSSIER</p>
                <p className="text-[15px] text-tac-dim leading-relaxed mb-4">
                  {profile.about}
                </p>
                <p className="text-[15px] text-tac-dim leading-relaxed mb-6">
                  {profile.aboutLong}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {profile.quickStats.map((s) => (
                    <div key={s.label} className="border border-tac-paper/10 p-3">
                      <p className="font-display font-bold text-2xl text-tac-orange">
                        {s.value}
                      </p>
                      <p className="hud-label mt-1">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 02 TRAINING GROUND — SKILLS */}
        <section id="training" className="scroll-mt-20">
          <SectionTitle no="02" name="AI TRAINING GROUND" represents="SKILLS" />
          <div className="grid md:grid-cols-2 gap-4">
            {skillGroups.map((g, i) => (
              <div key={g.id} className="tac-panel p-6 hover:tac-panel-hi transition-all">
                <div className="flex items-center justify-between mb-4">
                  <p className="font-mono-t text-[12px] tracking-[0.18em] text-tac-orange">
                    STATION {String(i + 1).padStart(2, "0")} · {g.label}
                  </p>
                  <span className="font-mono-t text-[10px] text-tac-gray">
                    {g.representation}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {g.skills.map((s) => (
                    <span
                      key={s.name}
                      className="font-mono-t text-[11px] border border-tac-paper/15 px-2.5 py-1.5 text-tac-dim hover:border-tac-orange/50 hover:text-tac-paper transition-colors"
                    >
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 03 MISSION ARCHIVE — PROJECTS */}
        <section id="archive" className="scroll-mt-20">
          <SectionTitle no="03" name="MISSION ARCHIVE" represents="PROJECTS" />

          <div className="flex flex-wrap gap-1.5 mb-6">
            {(["ALL", ...Object.keys(CATEGORY_META)] as string[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                aria-pressed={filter === f}
                className={`font-mono-t text-[10px] tracking-[0.14em] px-3 py-1.5 border transition-colors ${
                  filter === f
                    ? "border-tac-orange text-tac-orange bg-tac-orange/10"
                    : "border-tac-paper/15 text-tac-gray"
                }`}
              >
                {f === "ALL" ? "ALL" : CATEGORY_META[f as keyof typeof CATEGORY_META].short}
              </button>
            ))}
          </div>

          <div className="grid gap-4">
            {visible.map((p) => (
              <article
                key={p.id}
                className="tac-panel p-6 relative overflow-hidden group hover:tac-panel-hi transition-all"
              >
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-3">
                  <span className="font-mono-t text-[11px] text-tac-orange/80">
                    MISSION {p.missionNo}
                  </span>
                  <h3 className="font-display font-semibold text-xl">{p.name}</h3>
                  <span
                    className="font-mono-t text-[9px] tracking-[0.16em] ml-auto"
                    style={{ color: CATEGORY_META[p.category].accent }}
                  >
                    {CATEGORY_META[p.category].short} · {p.status}
                  </span>
                </div>
                <p className="text-[14px] text-tac-gray leading-relaxed mb-4">
                  {p.objective}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {p.tech.map((t) => (
                    <span
                      key={t}
                      className="font-mono-t text-[10px] text-tac-dim border border-tac-paper/10 px-2 py-0.5"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                {p.metrics && (
                  <div className="flex flex-wrap gap-x-5 gap-y-1 mb-4">
                    {p.metrics.map((m) => (
                      <span key={m} className="font-mono-t text-[10px] text-tac-green tracking-[0.08em]">
                        ◂ {m}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex gap-3">
                  {p.github && (
                    <a className="btn-tac !px-4 !py-2 text-[10px]" href={p.github} target="_blank" rel="noopener noreferrer">
                      ▣ GITHUB
                    </a>
                  )}
                  {p.demo && (
                    <a className="btn-tac ghost !px-4 !py-2 text-[10px]" href={p.demo} target="_blank" rel="noopener noreferrer">
                      ▶ LIVE DEMO
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 04 RESEARCH DIVISION — EDUCATION */}
        <section id="research" className="scroll-mt-20">
          <SectionTitle no="04" name="RESEARCH DIVISION" represents="EDUCATION" />
          <div className="tac-panel tac-panel-hi brackets p-8">
            <p className="font-mono-t text-[11px] text-tac-cyan tracking-[0.24em] mb-3">
              {education.period}
            </p>
            <h3 className="font-display font-semibold text-2xl mb-2">
              {education.degree}
            </h3>
            <p className="font-mono-t text-[13px] text-tac-dim mb-5">
              {education.institution}
            </p>
            <p className="text-[15px] text-tac-gray leading-relaxed max-w-3xl mb-6">
              {education.detail}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {education.focusAreas.map((f) => (
                <div
                  key={f}
                  className="border-l-2 border-tac-cyan/60 pl-3 py-1 font-mono-t text-[11px] tracking-[0.1em] text-tac-dim"
                >
                  {f}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 05 CLOUD OPS — infra skills */}
        <section id="cloud" className="scroll-mt-20">
          <SectionTitle no="05" name="CLOUD OPERATIONS" represents="INFRASTRUCTURE" />
          <div className="tac-panel p-8">
            <p className="text-[15px] text-tac-dim leading-relaxed mb-6 max-w-3xl">
              I don&apos;t just train models — I build systems. Every mission in the
              archive runs on a real deployment pipeline: CI, containers, and live
              public URLs.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {["DOCKER", "GITHUB ACTIONS", "VERCEL", "ONRENDER"].map((s) => (
                <div key={s} className="border border-tac-paper/10 p-4 text-center">
                  <p className="font-mono-t text-[12px] text-tac-dim tracking-[0.14em]">
                    {s}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 06 COMMS — CONTACT */}
        <section id="comms" className="scroll-mt-20">
          <SectionTitle no="06" name="COMMUNICATION TOWER" represents="CONTACT" />
          <div className="tac-panel tac-panel-hi brackets p-8">
            <h3 className="font-display font-bold text-2xl md:text-3xl mb-4 leading-tight">
              LET&apos;S BUILD THE NEXT{" "}
              <span className="text-tac-orange">INTELLIGENT SYSTEM.</span>
            </h3>
            <p className="text-[14px] text-tac-gray mb-8 leading-relaxed">
              Looking for AI/ML internships, data science opportunities, research
              collaboration and interesting projects.
            </p>
            <div className="flex flex-wrap gap-3">
              <a className="btn-tac solid" href={`mailto:${profile.email}`}>
                ✉ EMAIL
              </a>
              <a className="btn-tac" href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                ⌥ LINKEDIN
              </a>
              <a className="btn-tac" href={profile.github} target="_blank" rel="noopener noreferrer">
                ▣ GITHUB
              </a>
              <a className="btn-tac ghost" href={profile.resume} download>
                ⤓ DOWNLOAD RESUME
              </a>
            </div>
            <p className="font-mono-t text-[10px] text-tac-gray tracking-[0.14em] mt-8">
              {profile.email} · saketanand9693@gmail.com
            </p>
          </div>
        </section>
      </main>

      {/* fixed location strip */}
      <nav
        className="fixed bottom-0 inset-x-0 z-40 bg-tac-bg/90 backdrop-blur border-t border-tac-paper/10"
        aria-label="Locations"
      >
        <div className="max-w-4xl mx-auto px-4 py-2.5 flex gap-4 overflow-x-auto">
          {locations.map((l) => (
            <a
              key={l.id}
              href={`#${l.id === "command" ? "command" : l.id}`}
              className="font-mono-t text-[9px] tracking-[0.18em] text-tac-gray hover:text-tac-orange whitespace-nowrap"
            >
              {l.no} {l.short}
            </a>
          ))}
        </div>
      </nav>
    </div>
  );
}
