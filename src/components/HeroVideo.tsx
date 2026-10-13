"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Home, Pause, Phone, Play, ShieldCheck } from "lucide-react";
import { DEFAULT_WA, HERO_VIDEO, SITE, telLink, waLink } from "@/content/site";
import { WhatsAppIcon } from "./icons";

/**
 * Full-screen hero with a muted, looping background video (the H test).
 * Put the file at public/videos/hero-h-test.mp4 (optional .webm + poster).
 * If the video is missing or fails, an animated H-track drawing is shown instead.
 */
export function HeroVideo() {
  const vid = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    const v = vid.current;
    if (!v) return;
    v.muted = true; // muted is required for autoplay on phones
    v.defaultMuted = true;
    // The browser may have tried (and failed) to load the file before React attached its handlers,
    // so check the current state and also confirm the file exists.
    if (v.error || v.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) { setFailed(true); return; }
    fetch(HERO_VIDEO.mp4, { method: "HEAD" }).then((r) => { if (!r.ok) setFailed(true); }).catch(() => {});
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { v.pause(); setPlaying(false); return; }
    const start = () => v.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    if (v.readyState >= 2) start(); else v.addEventListener("canplay", start, { once: true });
    if (v.readyState === 0) v.load();
    return () => v.removeEventListener("canplay", start);
  }, []);

  const toggle = () => {
    const v = vid.current;
    if (!v) return;
    if (v.paused) v.play().then(() => setPlaying(true)).catch(() => {});
    else { v.pause(); setPlaying(false); }
  };

  return (
    <section id="home" aria-label="G-TECH Motor Driving School" className="relative overflow-hidden bg-white text-ink-dark">
      {/* soft red accents on pure white */}
      <div className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-red-600/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-[380px] w-[380px] rounded-full bg-red-600/[0.07] blur-3xl" />

      <div className="wrap relative grid min-h-[100svh] items-center gap-10 pb-16 pt-28 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
        <div>
          <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-red-600 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-white shadow-glow">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" /> G-TECH Motor Driving School · Vellarada
          </p>
          <h1 className="font-display text-4xl font-extrabold uppercase leading-[1.05] tracking-tight text-red-600 sm:text-6xl lg:text-[4.2rem]">
            {SITE.taglineParts[0]}
            <span className="block text-[#5C0404]">{SITE.taglineParts[1]}</span>
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-[#5b4446] sm:text-lg">
            Master the Kerala &ldquo;H&rdquo; test and the road beyond it with patient, trained instructors and 5 star safety rated dual control cars.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#enquire" className="btn-red">Start Your Training <ArrowRight className="h-4 w-4" /></a>
            <a href={telLink} className="inline-flex h-12 items-center justify-center gap-2 rounded-full border-2 border-red-600 px-5 text-sm font-bold text-red-600 transition hover:bg-red-600 hover:text-white"><Phone className="h-4 w-4" /> Call</a>
            <a href={waLink(DEFAULT_WA)} target="_blank" rel="noopener" className="inline-flex h-12 items-center justify-center gap-2 rounded-full border-2 border-red-600 px-5 text-sm font-bold text-red-600 transition hover:bg-red-600 hover:text-white"><WhatsAppIcon className="h-4 w-4" /> WhatsApp</a>
          </div>
          <div className="mt-8 flex flex-wrap gap-2 text-sm">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-[#FFF5F5] px-3 py-1.5 font-semibold text-[#5C0404]"><ShieldCheck className="h-4 w-4 text-red-600" /> 5 star safety rated dual control</span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-[#FFF5F5] px-3 py-1.5 font-semibold text-[#5C0404]"><Home className="h-4 w-4 text-red-600" /> Door to door · 7 days</span>
          </div>
        </div>

        {/* Video card */}
        <div className="relative">
          <div className="absolute -inset-3 rounded-[36px] bg-gradient-to-br from-red-600 to-[#8A0606] opacity-90 sm:-inset-4" aria-hidden />
          <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] bg-white shadow-[0_30px_80px_-20px_rgba(138,6,6,.55)]">
            {!failed ? (
              <video
                ref={vid}
                className="absolute inset-0 h-full w-full object-cover"
                src={HERO_VIDEO.mp4}
                poster={HERO_VIDEO.poster || undefined}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                disablePictureInPicture
                aria-label="A car completing the Kerala H driving test"
                onError={() => setFailed(true)}
              />
            ) : (
              <HTrackFallback />
            )}
            {!failed && (
              <button
                onClick={toggle}
                className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-white shadow-glow transition hover:bg-red-700"
                aria-label={playing ? "Pause video" : "Play video"}
              >
                {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </button>
            )}
          </div>
          <p className="relative mt-6 text-center text-xs font-bold uppercase tracking-[0.2em] text-red-600">The Kerala &ldquo;H&rdquo; test · we train you for every move</p>
        </div>
      </div>
    </section>
  );
}

/** Lightweight animated H-track shown when no video file is available. */
function HTrackFallback() {
  // H path: up left arm, back to middle, across, down right arm, up right arm, back across, down left arm.
  const path = "M200 520 L200 120 L200 320 L520 320 L520 520 L520 120 L520 320 L200 320 L200 520";
  return (
    <div className="absolute inset-0 bg-white" aria-hidden>
      <svg viewBox="0 0 720 640" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid meet">
        {/* track outline */}
        <g fill="none" stroke="#FFE1E1" strokeWidth="70" strokeLinecap="square" strokeLinejoin="miter">
          <path d="M200 520 L200 120 M520 520 L520 120 M200 320 L520 320" />
        </g>
        {/* poles */}
        {[[160, 110], [240, 110], [480, 110], [560, 110], [160, 530], [240, 530], [480, 530], [560, 530]].map(([x, y], i) => (
          <g key={i}><rect x={x - 5} y={y - 22} width="10" height="44" rx="3" fill="#fff" stroke="#D2090F" strokeWidth="2" /><rect x={x - 5} y={y - 8} width="10" height="10" fill="#F5222A" /></g>
        ))}
        {/* route */}
        <path d={path} fill="none" stroke="#F5222A" strokeWidth="4" strokeDasharray="10 14" className="animate-dash" />
        {/* car */}
        <g>
          <rect x="-16" y="-26" width="32" height="52" rx="9" fill="#D2090F" />
          <rect x="-12" y="-16" width="24" height="12" rx="3" fill="#1E1516" />
          <rect x="-3" y="-26" width="6" height="52" fill="#fff" />
          <animateMotion dur="14s" repeatCount="indefinite" path={path} rotate="0" />
        </g>
      </svg>
    </div>
  );
}
