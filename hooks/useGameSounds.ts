"use client";

import { useRef, useCallback } from "react";

// Jazzy Lounge — 100 BPM, 4-bar ii-V-I swing loop
const BEAT = 0.6;              // 100 BPM
const SL   = BEAT * 2 / 3;    // swing long  (0.4s)
const SS   = BEAT / 3;         // swing short (0.2s)
const LOOP_DUR = BEAT * 16;    // 4 bars = 9.6s

// 32 swung 8th notes: [freq, dur]
const MELODY: [number, number][] = [
  // Bar 1 — Dm7
  [587.33, SL], [698.46, SS], [440.00, SL], [523.25, SS],
  [587.33, SL], [698.46, SS], [659.26, SL], [523.25, SS],
  // Bar 2 — G7
  [493.88, SL], [587.33, SS], [392.00, SL], [349.23, SS],
  [440.00, SL], [493.88, SS], [587.33, SL], [698.46, SS],
  // Bar 3 — Cmaj7
  [659.26, SL], [783.99, SS], [523.25, SL], [493.88, SS],
  [392.00, SL], [329.63, SS], [523.25, SL], [587.33, SS],
  // Bar 4 — A7 turnaround
  [554.37, SL], [659.26, SS], [440.00, SL], [392.00, SS],
  [349.23, SL], [293.66, SS], [329.63, SL], [349.23, SS],
];

// Walking bass: [freq, beat offset] — steady quarters
const WALK: [number, number][] = [
  [146.83, 0],  [174.61, 1],  [220.00, 2],  [130.81, 3],  // Dm7: D3 F3 A3 C3
  [196.00, 4],  [246.94, 5],  [146.83, 6],  [174.61, 7],  // G7:  G3 B3 D3 F3
  [130.81, 8],  [164.81, 9],  [196.00, 10], [246.94, 11], // Cmaj7: C3 E3 G3 B3
  [220.00, 12], [138.59, 13], [164.81, 14], [196.00, 15], // A7: A3 C#3 E3 G3
];

function makeScratchBuffer(ctx: AudioContext): AudioBuffer {
  const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.15), ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.4;
  return buf;
}

export function useGameSounds() {
  const ctxRef = useRef<AudioContext | null>(null);

  // Scratch refs
  const scratchSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const scratchGainRef = useRef<GainNode | null>(null);
  const isScratchingRef = useRef(false);

  // Theme refs
  const themeGainRef = useRef<GainNode | null>(null);
  const themeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const themeActiveRef = useRef(false);

  const getCtx = useCallback((): AudioContext | null => {
    if (typeof window === "undefined") return null;
    if (!ctxRef.current) ctxRef.current = new AudioContext();
    if (ctxRef.current.state === "suspended") ctxRef.current.resume();
    return ctxRef.current;
  }, []);

  const scheduleLoop = useCallback(
    (ctx: AudioContext, master: GainNode, startAt: number) => {
      // Swung melody — triangle wave, piano-like decay
      let t = startAt;
      MELODY.forEach(([freq, dur]) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.value = freq;
        osc.connect(g); g.connect(master);
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.55, t + 0.01);
        g.gain.exponentialRampToValueAtTime(0.001, t + dur * 0.85);
        osc.start(t); osc.stop(t + dur);
        t += dur;
      });

      // Walking bass — sine, steady quarters
      WALK.forEach(([freq, beat]) => {
        const bt = startAt + beat * BEAT;
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        osc.connect(g); g.connect(master);
        g.gain.setValueAtTime(0, bt);
        g.gain.linearRampToValueAtTime(0.5, bt + 0.02);
        g.gain.exponentialRampToValueAtTime(0.001, bt + BEAT * 0.75);
        osc.start(bt); osc.stop(bt + BEAT);
      });
    },
    []
  );

  // ── THEME ────────────────────────────────────────────────────────────────

  const startTheme = useCallback(() => {
    if (themeActiveRef.current) return;
    themeActiveRef.current = true;
    const ctx = getCtx();
    if (!ctx) return;

    const master = ctx.createGain();
    master.gain.setValueAtTime(0.12, ctx.currentTime);
    master.connect(ctx.destination);
    themeGainRef.current = master;

    scheduleLoop(ctx, master, ctx.currentTime);
    let nextLoop = ctx.currentTime + LOOP_DUR;

    const tick = () => {
      if (!themeActiveRef.current) return;
      const c = ctxRef.current;
      const m = themeGainRef.current;
      if (!c || !m) return;
      scheduleLoop(c, m, nextLoop);
      nextLoop += LOOP_DUR;
      themeTimerRef.current = setTimeout(tick, (LOOP_DUR - 0.5) * 1000);
    };
    themeTimerRef.current = setTimeout(tick, (LOOP_DUR - 0.5) * 1000);
  }, [getCtx, scheduleLoop]);

  const stopTheme = useCallback(() => {
    themeActiveRef.current = false;
    if (themeTimerRef.current) { clearTimeout(themeTimerRef.current); themeTimerRef.current = null; }
    const g = themeGainRef.current;
    const ctx = ctxRef.current;
    if (g && ctx) g.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5);
    themeGainRef.current = null;
  }, []);

  // ── TITLE ENTRANCE ───────────────────────────────────────────────────────

  const playTitleEntrance = useCallback(() => {
    const ctx = getCtx();
    if (!ctx || ctx.state !== "running") return; // skip on first load — context not yet unlocked
    const t = ctx.currentTime;

    // Bass whomp (matches spring pop-in)
    const whomp = ctx.createOscillator();
    const whompG = ctx.createGain();
    whomp.type = "sine";
    whomp.frequency.setValueAtTime(80, t);
    whomp.frequency.exponentialRampToValueAtTime(50, t + 0.12);
    whomp.connect(whompG); whompG.connect(ctx.destination);
    whompG.gain.setValueAtTime(0.5, t);
    whompG.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
    whomp.start(t); whomp.stop(t + 0.12);

    // High sparkle
    const spark = ctx.createOscillator();
    const sparkG = ctx.createGain();
    spark.type = "triangle";
    spark.frequency.value = 1400;
    spark.connect(sparkG); sparkG.connect(ctx.destination);
    sparkG.gain.setValueAtTime(0.25, t);
    sparkG.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
    spark.start(t); spark.stop(t + 0.06);

    // Settle shimmer at +700ms (matches phase "moving")
    [880, 1100].forEach((freq, i) => {
      const s = ctx.createOscillator();
      const sG = ctx.createGain();
      s.type = "triangle";
      s.frequency.value = freq;
      const st = t + 0.7 + i * 0.07;
      s.connect(sG); sG.connect(ctx.destination);
      sG.gain.setValueAtTime(0, st);
      sG.gain.linearRampToValueAtTime(0.18, st + 0.02);
      sG.gain.exponentialRampToValueAtTime(0.001, st + 0.1);
      s.start(st); s.stop(st + 0.1);
    });
  }, [getCtx]);

  // ── CARD GRID ENTRANCE ───────────────────────────────────────────────────

  const playEntrance = useCallback(() => {
    const ctx = getCtx();
    if (!ctx) return;
    const t = ctx.currentTime;

    // Ascending sweep
    const sweep = ctx.createOscillator();
    const sweepG = ctx.createGain();
    sweep.type = "sine";
    sweep.frequency.setValueAtTime(300, t);
    sweep.frequency.exponentialRampToValueAtTime(1200, t + 0.3);
    sweep.connect(sweepG); sweepG.connect(ctx.destination);
    sweepG.gain.setValueAtTime(0.3, t);
    sweepG.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
    sweep.start(t); sweep.stop(t + 0.3);

    // Two sparkle hits
    [1800, 2200].forEach((freq, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "triangle";
      o.frequency.value = freq;
      const st = t + 0.3 + i * 0.1;
      o.connect(g); g.connect(ctx.destination);
      g.gain.setValueAtTime(0.2, st);
      g.gain.exponentialRampToValueAtTime(0.001, st + 0.07);
      o.start(st); o.stop(st + 0.07);
    });
  }, [getCtx]);

  // ── CARD SELECT ──────────────────────────────────────────────────────────

  const playCardSelect = useCallback(() => {
    const ctx = getCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(220, t);
    o.frequency.exponentialRampToValueAtTime(110, t + 0.12);
    o.connect(g); g.connect(ctx.destination);
    g.gain.setValueAtTime(0.5, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    o.start(t); o.stop(t + 0.2);
  }, [getCtx]);

  // ── SCRATCH ──────────────────────────────────────────────────────────────

  const startScratch = useCallback(() => {
    if (isScratchingRef.current) return;
    isScratchingRef.current = true;
    const ctx = getCtx();
    if (!ctx) return;

    const buf = makeScratchBuffer(ctx);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, ctx.currentTime);
    g.gain.linearRampToValueAtTime(0.35, ctx.currentTime + 0.04);

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 1200;
    filter.Q.value = 0.8;

    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    src.playbackRate.value = 1.0 + Math.random() * 0.3;

    src.connect(filter); filter.connect(g); g.connect(ctx.destination);
    src.start();

    scratchSourceRef.current = src;
    scratchGainRef.current = g;
  }, [getCtx]);

  const stopScratch = useCallback(() => {
    if (!isScratchingRef.current) return;
    isScratchingRef.current = false;
    const ctx = ctxRef.current;
    const g = scratchGainRef.current;
    const src = scratchSourceRef.current;
    if (!ctx || !g || !src) return;
    const stopAt = ctx.currentTime + 0.06;
    g.gain.linearRampToValueAtTime(0, stopAt);
    src.stop(stopAt);
    scratchSourceRef.current = null;
    scratchGainRef.current = null;
  }, []);

  // ── REVEAL ───────────────────────────────────────────────────────────────

  const playReveal = useCallback(() => {
    const ctx = getCtx();
    if (!ctx) return;
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      const t = ctx.currentTime + i * 0.1;
      o.type = "triangle";
      o.frequency.value = freq;
      o.connect(g); g.connect(ctx.destination);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.4, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
      o.start(t); o.stop(t + 0.35);
    });
  }, [getCtx]);

  // ── CONGRATS (prize.webp reveal moment) ─────────────────────────────────

  const playCongrats = useCallback(() => {
    const ctx = getCtx();
    if (!ctx) return;
    const t = ctx.currentTime;

    // Three ascending bell hits (C5 → E5 → G5)
    [523.25, 659.25, 783.99].forEach((freq, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = freq;
      o.connect(g); g.connect(ctx.destination);
      const st = t + i * 0.11;
      g.gain.setValueAtTime(0.65, st);
      g.gain.exponentialRampToValueAtTime(0.001, st + 0.65);
      o.start(st); o.stop(st + 0.65);
    });

    // Brass chord swell (sawtooth + lowpass sweep) — C major
    const filt = ctx.createBiquadFilter();
    filt.type = "lowpass";
    filt.frequency.setValueAtTime(350, t + 0.3);
    filt.frequency.linearRampToValueAtTime(2200, t + 0.65);
    filt.Q.value = 2;
    filt.connect(ctx.destination);

    [261.63, 329.63, 392.00, 523.25].forEach((freq) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sawtooth";
      o.frequency.value = freq;
      o.connect(g); g.connect(filt);
      g.gain.setValueAtTime(0, t + 0.28);
      g.gain.linearRampToValueAtTime(0.11, t + 0.45);
      g.gain.exponentialRampToValueAtTime(0.001, t + 1.9);
      o.start(t + 0.28); o.stop(t + 1.9);
    });

    // High shimmer ring on top
    const shimmer = ctx.createOscillator();
    const shimG = ctx.createGain();
    shimmer.type = "triangle";
    shimmer.frequency.value = 1046.5; // C6
    shimmer.connect(shimG); shimG.connect(ctx.destination);
    shimG.gain.setValueAtTime(0, t + 0.32);
    shimG.gain.linearRampToValueAtTime(0.38, t + 0.35);
    shimG.gain.exponentialRampToValueAtTime(0.001, t + 1.1);
    shimmer.start(t + 0.32); shimmer.stop(t + 1.1);
  }, [getCtx]);

  // ── CELEBRATION ──────────────────────────────────────────────────────────

  const playCelebration = useCallback(() => {
    const ctx = getCtx();
    if (!ctx) return;
    const t = ctx.currentTime;

    // C major chord
    [523.25, 659.25, 783.99].forEach((freq, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = freq;
      o.connect(g); g.connect(ctx.destination);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.25, t + 0.05 + i * 0.03);
      g.gain.exponentialRampToValueAtTime(0.001, t + 1.2);
      o.start(t); o.stop(t + 1.2);
    });

    // High shimmer hits
    [1046.5, 1318.51].forEach((freq, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "triangle";
      o.frequency.value = freq;
      const st = t + 0.15 + i * 0.12;
      o.connect(g); g.connect(ctx.destination);
      g.gain.setValueAtTime(0.3, st);
      g.gain.exponentialRampToValueAtTime(0.001, st + 0.3);
      o.start(st); o.stop(st + 0.3);
    });
  }, [getCtx]);

  // ── PLAY AGAIN ───────────────────────────────────────────────────────────

  const playPlayAgain = useCallback(() => {
    const ctx = getCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(440, t);
    o.frequency.exponentialRampToValueAtTime(880, t + 0.08);
    o.connect(g); g.connect(ctx.destination);
    g.gain.setValueAtTime(0.3, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
    o.start(t); o.stop(t + 0.15);
  }, [getCtx]);

  return {
    startTheme, stopTheme,
    playTitleEntrance,
    playEntrance,
    playCardSelect,
    startScratch, stopScratch,
    playReveal,
    playCongrats,
    playCelebration,
    playPlayAgain,
  };
}
