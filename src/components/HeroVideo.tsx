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
    v.muted = true; // required for autoplay on mobile
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      v.pause();
      setPlaying(false);
      return;
    }
    v.play().catch(() => setPlaying(false));
  }, []);

  const toggle = () => {
    const v = vid.current;
    if (!v) return;
    if (v.paused) { v.play().then(() => setPlaying(true)).catch(() => {}); }
    else { v.pause(); setPlaying(false); }
  };

  return (
    <section id="home" aria-label="G-TECH Motor Driving School" className="relative flex min-h-[100svh] items-center overflow-hidden bg-surface">
      {/* Background video */}
      {!failed && (
        <video
          ref={vid}
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={HERO_VIDEO.poster || undefined}
          aria-hidden
          onError={() => setFailed(true)}
        >
          {HERO_VIDEO.webm && <source src={HERO_VIDEO.webm} type="video/webm" />}
          <source src={HERO_VIDEO.mp4} type="video/mp4" onError={() => setFailed(true)} />
        </video>
      )}
      {failed && <HTrackFallback />}

      {/* Maroon overlays keep text readable over any footage */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#360202]/95 via-[#360202]/70 to-[#360202]/20" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-surface to-transparent" />

      <div className="wrap relative z-10 pb-20 pt-28">
        <div className="max-w-2xl">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-red-600 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-white shadow-glow">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" /> G-TECH Motor Driving School · Vellarada
          </p>
          <h1 className="font-display text-4xl font-extrabold uppercase leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
            {SITE.taglineParts[0]}
            <span className="block text-red-400">{SITE.taglineParts[1]}</span>
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-ink-soft sm:text-lg">
            Master the Kerala &ldquo;H&rdquo; test and the road beyond it with patient, trained instructors and 5 star safety rated dual control cars.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#enquire" className="btn-red">Start Your Training <ArrowRight className="h-4 w-4" /></a>
            <a href={telLink} className="btn-ghost"><Phone className="h-4 w-4" /> Call</a>
            <a href={waLink(DEFAULT_WA)} target="_blank" rel="noopener" className="btn-ghost"><WhatsAppIcon className="h-4 w-4" /> WhatsApp</a>
          </div>
          <div className="mt-8 flex flex-wrap gap-2 text-sm">
            <span className="chip"><ShieldCheck className="h-4 w-4 text-red-400" /> 5 star safety rated dual control</span>
            <span className="chip"><Home className="h-4 w-4 text-red-400" /> Door to door · 7 days</span>
          </div>
        </div>
      </div>

      {!failed && (
        <button
          onClick={toggle}
          className="absolute bottom-6 right-5 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur transition hover:bg-black/50 sm:right-8"
          aria-label={playing ? "Pause background video" : "Play background video"}
        >
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </button>
      )}
    </section>
  );
}

/** Lightweight animated H-track shown when no video file is available. */
function HTrackFallback() {
  // H path: up left arm, back to middle, across, down right arm, up right arm, back across, down left arm.
  const path = "M200 520 L200 120 L200 320 L520 320 L520 520 L520 120 L520 320 L200 320 L200 520";
  return (
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_45%,#8A0606_0%,#5C0404_40%,#360202_100%)]" aria-hidden>
      <svg viewBox="0 0 720 640" className="absolute right-[-10%] top-1/2 h-[90%] -translate-y-1/2 opacity-70 sm:right-0" preserveAspectRatio="xMidYMid meet">
        {/* track outline */}
        <g fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="70" strokeLinecap="square" strokeLinejoin="miter">
          <path d="M200 520 L200 120 M520 520 L520 120 M200 320 L520 320" />
        </g>
        {/* poles */}
        {[[160, 110], [240, 110], [480, 110], [560, 110], [160, 530], [240, 530], [480, 530], [560, 530]].map(([x, y], i) => (
          <g key={i}><rect x={x - 5} y={y - 22} width="10" height="44" rx="3" fill="#fff" /><rect x={x - 5} y={y - 8} width="10" height="10" fill="#F5222A" /></g>
        ))}
        {/* route */}
        <path d={path} fill="none" stroke="#F5222A" strokeWidth="4" strokeDasharray="10 14" className="animate-dash" />
        {/* car */}
        <g>
          <rect x="-16" y="-26" width="32" height="52" rx="9" fill="#fff" />
          <rect x="-12" y="-16" width="24" height="12" rx="3" fill="#360202" />
          <rect x="-10" y="-30" width="20" height="5" rx="2" fill="#F5222A" />
          <animateMotion dur="14s" repeatCount="indefinite" path={path} rotate="0" />
        </g>
      </svg>
    </div>
  );
}
