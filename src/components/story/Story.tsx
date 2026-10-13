"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowRight, Phone, ShieldCheck, Home } from "lucide-react";
import { STORY, SITE, telLink, waLink, DEFAULT_WA } from "@/content/site";
import { WhatsAppIcon } from "../icons";
import type { StoryWorld } from "./world";

const HERO_END = 0.07;
const WINDOW = 0.085;

function activeIndex(p: number) {
  if (p < HERO_END) return -1;
  let best = -1, bestD = 1;
  STORY.forEach((c, i) => {
    const d = Math.abs(p - c.at);
    if (d < bestD) { bestD = d; best = i; }
  });
  return bestD <= WINDOW ? best : -2; // -2 = between chapters (just driving)
}

export function Story() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<StoryWorld | null>(null);
  const [active, setActive] = useState(-1);
  const [fallback, setFallback] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let raf = 0, last = performance.now(), visible = true, disposed = false;
    let cleanupResize = () => {};
    const section = sectionRef.current!, canvas = canvasRef.current!;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = matchMedia("(max-width: 767px)").matches || navigator.hardwareConcurrency <= 4;

    const progress = () => {
      const r = section.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      return Math.min(1, Math.max(0, -r.top / Math.max(1, total)));
    };
    const onScroll = () => {
      const p = progress();
      worldRef.current?.setProgress(p);
      railRef.current?.style.setProperty("--p", String(p));
      const a = activeIndex(p);
      setActive((prev) => (prev === a ? prev : a));
    };

    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { rootMargin: "100px" });
    io.observe(section);

    (async () => {
      const mod = await import("./world");
      if (disposed) return;
      if (!mod.webglAvailable()) { setFallback(true); onScroll(); return; }
      try {
        worldRef.current = new mod.StoryWorld({ canvas, mobile, reduced });
      } catch {
        setFallback(true); onScroll(); return;
      }
      const resize = () => worldRef.current?.resize(canvas.clientWidth, canvas.clientHeight);
      resize();
      window.addEventListener("resize", resize);
      onScroll();
      setReady(true);
      const loop = (t: number) => {
        const dt = Math.min(0.05, (t - last) / 1000);
        last = t;
        if (visible && !document.hidden && worldRef.current) worldRef.current.frame(dt);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
      cleanupResize = () => window.removeEventListener("resize", resize);
    })();

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      cleanupResize();
      window.removeEventListener("scroll", onScroll);
      worldRef.current?.dispose();
      worldRef.current = null;
    };
  }, []);

  const jump = (p: number) => {
    const s = sectionRef.current!;
    const top = s.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + p * (s.offsetHeight - window.innerHeight), behavior: "smooth" });
  };

  return (
    <section ref={sectionRef} id="home" aria-label="The G-TECH journey" className="relative h-[560vh] md:h-[640vh]">
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        {/* 3D canvas */}
        <canvas ref={canvasRef} className={`absolute inset-0 h-full w-full transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"}`} aria-hidden />
        {fallback && (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,#FF5C5C_0%,#D2090F_45%,#8A0606_100%)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/logo-mark-white.png" alt="" className="absolute right-[8%] top-1/2 w-[34vw] max-w-[360px] -translate-y-1/2 opacity-30" />
          </div>
        )}
        {/* soft edge vignette for legibility */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/80 via-white/10 to-transparent md:from-white/70" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white/70 to-transparent" />

        {/* Hero (chapter 0) */}
        <div className={`absolute inset-0 flex items-center transition-all duration-700 ${active === -1 ? "opacity-100" : "pointer-events-none -translate-y-6 opacity-0"}`}>
          <div className="mx-auto w-full max-w-7xl px-5 pt-16 sm:px-8">
            <div className="max-w-xl">
              <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-red-600 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-white shadow-glow">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" /> {SITE.taglineParts[0]} · {SITE.taglineParts[1]}
              </p>
              <h1 className="font-display text-[44px] font-extrabold leading-[0.98] tracking-tight text-ink sm:text-6xl lg:text-7xl">
                Learn to Drive.
                <span className="block text-red-600">Drive with Confidence.</span>
              </h1>
              <p className="mt-5 max-w-md text-base leading-relaxed text-ink-soft sm:text-lg">
                Professional two-wheeler and four-wheeler training with friendly instructors, safety-focused vehicles and RTO procedures support.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a href="#enquire" className="btn-red">Start Your Training <ArrowRight className="h-4 w-4" /></a>
                <a href={telLink} className="btn-ghost"><Phone className="h-4 w-4" /> Call</a>
                <a href={waLink(DEFAULT_WA)} target="_blank" rel="noopener" className="btn-ghost"><WhatsAppIcon className="h-4 w-4" /> WhatsApp</a>
              </div>
              <div className="mt-7 flex flex-wrap gap-2 text-sm">
                <span className="chip"><ShieldCheck className="h-4 w-4 text-red-600" /> 5 star safety rated dual control</span>
                <span className="chip"><Home className="h-4 w-4 text-red-600" /> Door to door · 7 days</span>
              </div>
              <p className="mt-6 font-display text-sm font-bold text-red-600">{SITE.joinLine}</p>
            </div>
          </div>
        </div>

        {/* Chapter cards */}
        {STORY.map((c, i) => {
          const on = active === i;
          const right = i % 2 === 0;
          return (
            <div key={c.title} aria-hidden={!on}
              className={`pointer-events-none absolute inset-x-0 bottom-6 flex px-4 transition-all duration-700 md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:px-10 ${right ? "md:justify-end" : "md:justify-start"} ${on ? "opacity-100" : "translate-y-8 opacity-0"}`}>
              <article className={`pointer-events-auto relative w-full max-w-md overflow-hidden rounded-3xl border border-white/70 bg-white/90 p-6 shadow-card backdrop-blur-md sm:p-7 ${on ? "" : "pointer-events-none"}`}>
                <span className="absolute -right-3 -top-6 font-display text-[110px] font-extrabold leading-none text-red-600/10">0{i + 1}</span>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-600">{c.kicker}</p>
                <h2 className="mt-2 font-display text-2xl font-extrabold text-ink sm:text-3xl">{c.title}</h2>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{c.body}</p>
                {i === STORY.length - 1 && (
                  <a href="#enquire" className="btn-red mt-5">Start Your Training <ArrowRight className="h-4 w-4" /></a>
                )}
              </article>
            </div>
          );
        })}

        {/* Progress rail */}
        <div ref={railRef} className="absolute right-4 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-3 lg:flex" style={{ ["--p" as string]: 0 }}>
          <div className="relative h-56 w-[3px] overflow-hidden rounded-full bg-red-600/15">
            <div className="absolute inset-x-0 top-0 rounded-full bg-red-600" style={{ height: "calc(var(--p) * 100%)" }} />
          </div>
          <div className="flex flex-col gap-2">
            {[{ t: "Start", at: 0 }, ...STORY.map((s, i) => ({ t: `0${i + 1}`, at: s.at }))].map((d, i) => (
              <button key={d.t} onClick={() => jump(d.at)} aria-label={`Go to ${i === 0 ? "start" : STORY[i - 1].title}`}
                className={`h-8 w-8 rounded-full text-[10px] font-bold transition ${active === i - 1 ? "bg-red-600 text-white shadow-glow" : "bg-white/80 text-ink-soft hover:bg-white"}`}>
                {d.t === "Start" ? "GO" : d.t}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile progress bar */}
        <div className="absolute inset-x-0 top-[64px] h-[3px] bg-red-600/10 lg:hidden">
          <MobileBar sectionRef={sectionRef} />
        </div>

        {/* Scroll cue + skip */}
        <div className={`absolute inset-x-0 bottom-5 flex items-center justify-center gap-4 transition-opacity duration-500 ${active === -1 ? "opacity-100" : "opacity-0"}`}>
          <button onClick={() => jump(STORY[0].at)} className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-2.5 text-sm font-semibold text-ink shadow-card">
            <ArrowDown className="h-4 w-4 animate-bounce text-red-600" /> Scroll to start the drive
          </button>
          <a href="#training" className="text-sm font-semibold text-ink-soft underline-offset-4 hover:underline">Skip story</a>
        </div>
      </div>
    </section>
  );
}

function MobileBar({ sectionRef }: { sectionRef: React.RefObject<HTMLElement | null> }) {
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const on = () => {
      const s = sectionRef.current; if (!s || !bar.current) return;
      const r = s.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - window.innerHeight)));
      bar.current.style.transform = `scaleX(${p})`;
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, [sectionRef]);
  return <div ref={bar} className="h-full origin-left bg-red-600" style={{ transform: "scaleX(0)" }} />;
}
