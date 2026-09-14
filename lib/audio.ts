// ============================================================
// lib/audio.ts — Subtle procedural ambient audio (Web Audio).
// No autoplay: starts only when user enables the toggle.
// Wind + facility hum + UI blips. Default muted.
// ============================================================

export class AudioEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private nodes: AudioNode[] = [];
  private started = false;

  start() {
    if (this.started) return;
    try {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      this.ctx = new Ctx();
      const ctx = this.ctx;
      this.master = ctx.createGain();
      this.master.gain.value = 0.0;
      this.master.connect(ctx.destination);
      this.master.gain.linearRampToValueAtTime(0.16, ctx.currentTime + 2.5);

      // --- wind: filtered noise, slowly modulated ---
      const windBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
      const data = windBuf.getChannelData(0);
      let last = 0;
      for (let i = 0; i < data.length; i++) {
        const white = Math.random() * 2 - 1;
        last = last * 0.96 + white * 0.04; // brownish
        data[i] = last * 3;
      }
      const wind = ctx.createBufferSource();
      wind.buffer = windBuf;
      wind.loop = true;
      const windFilter = ctx.createBiquadFilter();
      windFilter.type = "lowpass";
      windFilter.frequency.value = 420;
      const windGain = ctx.createGain();
      windGain.gain.value = 0.55;
      // LFO on wind gain for gusts
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.09;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.22;
      lfo.connect(lfoGain).connect(windGain.gain);
      wind.connect(windFilter).connect(windGain).connect(this.master);
      wind.start();
      lfo.start();

      // --- facility hum: two low sines beating ---
      const hum1 = ctx.createOscillator();
      hum1.frequency.value = 52;
      hum1.type = "sine";
      const hum2 = ctx.createOscillator();
      hum2.frequency.value = 52.7;
      hum2.type = "sine";
      const humGain = ctx.createGain();
      humGain.gain.value = 0.045;
      hum1.connect(humGain);
      hum2.connect(humGain);
      humGain.connect(this.master);
      hum1.start();
      hum2.start();

      // --- distant radio beeps (sparse, subtle) ---
      this.scheduleBlips();

      this.nodes.push(wind, lfo, hum1, hum2);
      this.started = true;
    } catch {
      // audio unavailable — silently ignore
    }
  }

  private scheduleBlips() {
    if (!this.ctx || !this.master) return;
    const blip = () => {
      if (!this.ctx || !this.master) return;
      const ctx = this.ctx;
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = 880 + Math.random() * 500;
      const g = ctx.createGain();
      g.gain.value = 0;
      g.gain.linearRampToValueAtTime(0.035, ctx.currentTime + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3);
      osc.connect(g).connect(this.master);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
      setTimeout(blip, 6000 + Math.random() * 9000);
    };
    setTimeout(blip, 4000);
  }

  /** UI click blip */
  blip(freq = 720, vol = 0.06) {
    if (!this.ctx || !this.master) return;
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.value = freq;
    const g = ctx.createGain();
    g.gain.value = vol;
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.18);
    osc.connect(g).connect(this.master);
    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  }

  stop() {
    if (this.master && this.ctx) {
      this.master.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.6);
    }
    setTimeout(() => {
      this.nodes.forEach((n) => {
        try {
          (n as OscillatorNode).stop?.();
        } catch {
          /* already stopped */
        }
      });
      this.ctx?.close();
      this.ctx = null;
      this.started = false;
    }, 800);
  }
}

export default AudioEngine;
