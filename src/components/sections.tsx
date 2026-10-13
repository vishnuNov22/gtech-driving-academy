"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion, motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, Bike, Car, Check, ChevronDown, FileText, HeartHandshake, Home, MapPin, Mail, Phone, ShieldCheck, Sprout, Users, Navigation,
} from "lucide-react";
import {
  CLAIMS, DEFAULT_WA, FAQ, GALLERY, RTO_STEPS, SIGNS, SITE, TEAM, TRAINING, WHY, fmtPhone, telLink, waLink,
} from "@/content/site";
import { Reveal } from "./Reveal";
import { LogoMark, SignSvg, WhatsAppIcon } from "./icons";
import { Brand } from "./Chrome";

/* ------------------------------------------------------------- ticker */
export function Ticker() {
  const items = ["Two-Wheeler Training", "Four-Wheeler Training", ...CLAIMS, "RTO Procedures Support", SITE.hashtag];
  return (
    <div className="relative overflow-hidden bg-red-600 py-4 text-white">
      <div className="flex w-max animate-marquee gap-10 whitespace-nowrap font-display text-lg font-bold">
        {[...items, ...items].map((t, i) => (
          <span key={i} className="flex items-center gap-10">{t}<span className="h-2 w-2 rotate-45 bg-white/70" /></span>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- brand promise */
export function BrandPromise() {
  const [a, b] = SITE.taglineParts;
  return (
    <section aria-label={SITE.tagline} className="relative overflow-hidden bg-white py-20 sm:py-28">
      <LogoMark className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 text-red-600/[0.05]" bg="#ffffff" />
      <div className="wrap relative text-center">
        <Reveal><span className="kicker justify-center">Our promise</span></Reveal>
        <motion.p initial={{ opacity: 0, x: -60 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
          className="mt-6 font-display text-[13vw] font-extrabold uppercase leading-[0.92] tracking-tight text-red-600 sm:text-7xl lg:text-8xl">
          {a}
        </motion.p>
        <motion.p initial={{ opacity: 0, x: 60 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.9, delay: 0.12, ease: [0.2, 0.8, 0.2, 1] }}
          className="font-display text-[13vw] font-extrabold uppercase leading-[0.92] tracking-tight text-transparent [-webkit-text-stroke:2px_#D2090F] sm:text-7xl lg:text-8xl">
          {b}
        </motion.p>
        <Reveal delay={0.2}>
          <p className="lead mx-auto">Quality training in 5 star safety rated dual control vehicles, and the trust of more than 5000 students who started their journey with G-TECH.</p>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- stats */
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduced = useReducedMotion();
  useEffect(() => {
    if (!inView || !ref.current) return;
    if (reduced) { ref.current.textContent = to.toLocaleString("en-IN") + suffix; return; }
    const c = animate(0, to, { duration: 1.8, ease: "easeOut", onUpdate: (v) => { if (ref.current) ref.current.textContent = Math.round(v).toLocaleString("en-IN") + suffix; } });
    return () => c.stop();
  }, [inView, to, suffix, reduced]);
  return <span ref={ref}>0{suffix}</span>;
}

export function Stats() {
  const stats = [
    { v: <Counter to={5000} suffix="+" />, l: "Students trained by G-TECH" },
    { v: "5 Star", l: "Safety rated dual control vehicles" },
    { v: "7 Days", l: "Door to door service" },
    { v: "Family", l: "Owned & operated" },
  ];
  return (
    <section className="relative z-10 -mt-px bg-white">
      <div className="wrap grid grid-cols-2 gap-px overflow-hidden rounded-b-3xl bg-line lg:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal key={i} delay={i * 0.06} className="bg-white px-5 py-8 text-center sm:py-10">
            <div className="font-display text-3xl font-extrabold text-red-600 sm:text-5xl">{s.v}</div>
            <div className="mt-2 text-sm text-ink-soft">{s.l}</div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- training */
const TRAIN_ICON = { bike: Bike, car: Car, sprout: Sprout, doc: FileText };

export function Training() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (paused || reduced) return;
    const t = setTimeout(() => setI((x) => (x + 1) % TRAINING.length), 6000);
    return () => clearTimeout(t);
  }, [i, paused, reduced]);
  const t = TRAINING[i];
  const Icon = TRAIN_ICON[t.icon];
  return (
    <section id="training" className="section scroll-mt-16 bg-mist">
      <div className="wrap">
        <Reveal>
          <span className="kicker">About & Training</span>
          <h2 className="h2">Training built around <span className="text-red-600">you.</span></h2>
          <p className="lead">G-TECH Motor Driving School is a family-owned driving school in Choondickal, Vellarada, helping first-time learners and people seeking refresher training build real confidence on the road.</p>
        </Reveal>
        <div className="mt-12 grid gap-6 lg:grid-cols-[380px_1fr]" onPointerEnter={(e) => e.pointerType === "mouse" && setPaused(true)} onPointerLeave={() => setPaused(false)}>
          <div className="flex gap-3 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible" role="tablist" aria-label="Training options">
            {TRAINING.map((x, k) => {
              const I = TRAIN_ICON[x.icon];
              const on = k === i;
              return (
                <button key={x.title} role="tab" aria-selected={on} onClick={() => setI(k)}
                  className={`relative flex min-w-[240px] items-center gap-4 overflow-hidden rounded-2xl border p-4 text-left transition lg:min-w-0 ${on ? "border-red-600 bg-white shadow-card" : "border-line bg-white/60 hover:bg-white"}`}>
                  <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${on ? "bg-red-600 text-white" : "bg-red-50 text-red-600"}`}><I className="h-6 w-6" /></span>
                  <span><b className="block font-display text-ink">{x.title}</b><small className="text-ink-mute">{x.short}</small></span>
                  {on && !reduced && !paused && <motion.span key={i} className="absolute bottom-0 left-0 h-[3px] bg-red-600" initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 6, ease: "linear" }} />}
                </button>
              );
            })}
          </div>
          <div className="relative overflow-hidden rounded-[28px] bg-red-600 p-8 text-white sm:p-12">
            <Icon className="absolute -bottom-10 -right-10 h-72 w-72 text-white/10" strokeWidth={1} />
            <AnimatePresence mode="wait">
              <motion.div key={i} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.35 }} className="relative">
                <span className="text-sm font-bold text-red-100">0{i + 1} / 0{TRAINING.length}</span>
                <h3 className="mt-3 text-3xl font-extrabold sm:text-4xl">{t.title}</h3>
                <p className="mt-4 max-w-lg text-lg text-red-50">{t.desc}</p>
                <ul className="mt-6 grid gap-3 sm:grid-cols-3">
                  {t.points.map((p) => <li key={p} className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2.5 text-sm font-semibold"><Check className="h-4 w-4" />{p}</li>)}
                </ul>
                {t.rto ? (
                  <a className="btn-white mt-8" href={waLink("Hello G-TECH, I'd like to ask about RTO procedures support.")} target="_blank" rel="noopener"><FileText className="h-4 w-4" /> Ask About RTO Support</a>
                ) : (
                  <a className="btn-white mt-8" href="#enquire">Enquire Now <ArrowRight className="h-4 w-4" /></a>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        <Journey />
      </div>
    </section>
  );
}

function Journey() {
  const steps = [
    ["Enquire", "Call or WhatsApp us and tell us what you want to learn."],
    ["Meet your instructor", "Start with friendly, patient guidance from day one."],
    ["Practise safely", "Learn in 5 star safety rated dual control vehicles."],
    ["Build confidence", "Gain real road awareness and safe habits."],
    ["RTO support", "Get support with RTO-related procedures."],
  ];
  return (
    <div className="mt-20">
      <Reveal>
        <span className="kicker">Your Journey</span>
        <h3 className="mt-3 text-2xl font-extrabold sm:text-4xl">From first lesson to <span className="text-red-600">open road</span></h3>
      </Reveal>
      <ol className="relative mt-10 grid gap-4 md:grid-cols-5">
        <div className="absolute left-0 right-0 top-7 hidden h-[3px] bg-[repeating-linear-gradient(90deg,#D2090F_0_18px,transparent_18px_32px)] opacity-40 md:block" aria-hidden />
        {steps.map(([t, b], k) => (
          <Reveal key={t} delay={k * 0.08}>
            <li className="relative list-none">
              <span className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-white font-display text-lg font-extrabold text-red-600 shadow-card ring-4 ring-mist">0{k + 1}</span>
              <b className="mt-4 block font-display text-lg">{t}</b>
              <p className="mt-1 text-sm text-ink-soft">{b}</p>
            </li>
          </Reveal>
        ))}
      </ol>
    </div>
  );
}

/* ------------------------------------------------------------- dual control demo */
export function Safety() {
  return (
    <section id="safety" className="section scroll-mt-16 overflow-hidden bg-red-950 text-white">
      <div className="wrap grid items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <span className="kicker !text-red-300 before:!bg-red-300">Safety & Dual Control Vehicles</span>
          <h2 className="mt-3 text-4xl font-extrabold leading-tight sm:text-6xl">Safety First.<br /><span className="text-red-400">Confidence Second.</span><br />Skill for Life.</h2>
          <p className="mt-5 max-w-lg text-lg text-red-100/90">Our 5 star safety rated dual control vehicles mean your instructor has their own brake, so they can step in whenever needed while you learn calmly.</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[["5 Star Safety Rated", "Dual control vehicles"], ["Instructor-assisted", "Guidance at every turn"], ["Controlled practice", "Safe habits step by step"]].map(([a, b]) => (
              <div key={a} className="rounded-2xl border border-white/10 bg-white/5 p-4"><ShieldCheck className="h-5 w-5 text-red-400" /><b className="mt-2 block text-sm">{a}</b><span className="text-xs text-red-100/80">{b}</span></div>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.1}><DualControlDemo /></Reveal>
      </div>
    </section>
  );
}

function DualControlDemo() {
  const lane = useRef<SVGLineElement>(null), w1 = useRef<SVGGElement>(null), w2 = useRef<SVGGElement>(null);
  const bl = useRef<SVGRectElement>(null), glow = useRef<SVGCircleElement>(null), box = useRef<HTMLDivElement>(null);
  const [speed, setSpeed] = useState(30);
  const [holding, setHolding] = useState(false);
  const holdRef = useRef(false);
  useEffect(() => { holdRef.current = holding; }, [holding]);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let s = 30, off = 0, rot = 0, last = performance.now(), raf = 0, visible = true, shown = 30;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    if (box.current) io.observe(box.current);
    const loop = (t: number) => {
      const dt = Math.min((t - last) / 1000, 0.05); last = t;
      if (visible) {
        s += holdRef.current ? -40 * dt : 12 * dt; s = Math.max(0, Math.min(30, s));
        off -= s * dt * 9; rot += s * dt * 30;
        lane.current?.setAttribute("stroke-dashoffset", off.toFixed(1));
        w1.current?.setAttribute("transform", `rotate(${rot.toFixed(1)} 54 74)`);
        w2.current?.setAttribute("transform", `rotate(${rot.toFixed(1)} 172 74)`);
        bl.current?.setAttribute("opacity", holdRef.current ? "1" : ".35");
        glow.current?.setAttribute("opacity", holdRef.current ? ".35" : "0");
        if (Math.round(s) !== shown) { shown = Math.round(s); setSpeed(shown); }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); io.disconnect(); };
  }, []);
  const start = (e: React.SyntheticEvent) => { e.preventDefault(); setHolding(true); if (navigator.vibrate) navigator.vibrate(15); };
  const stop = () => setHolding(false);
  return (
    <div ref={box} className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div><b className="block">Try it: dual control in action</b><small className="text-red-100/80">Hold the button to apply the instructor&apos;s brake</small></div>
        <div className="text-right font-display"><span className={`text-4xl font-extrabold tabular-nums ${speed < 3 ? "text-red-400" : ""}`}>{speed}</span><small className="ml-1 text-xs text-red-100/80">KM/H</small></div>
      </div>
      <div className="mt-4 overflow-hidden rounded-2xl">
        <svg viewBox="0 0 520 200" className="block w-full" aria-hidden>
          <rect width="520" height="200" fill="#360202" />
          <rect y="70" width="520" height="130" fill="#4a0a0a" />
          <rect y="70" width="520" height="4" fill="#fff" opacity=".5" />
          <line ref={lane} x1="-40" y1="140" x2="560" y2="140" stroke="#fff" strokeWidth="6" strokeDasharray="40 30" />
          <g transform="translate(150 78)">
            <ellipse cx="110" cy="84" rx="100" ry="6" fill="#000" opacity=".35" />
            <path d="M10 60 Q10 46 26 43 L62 39 Q80 16 106 15 L142 15 Q164 17 179 39 L201 42 Q218 45 218 58 L218 68 Q218 74 212 74 L16 74 Q10 74 10 68Z" fill="#D2090F" />
            <path d="M68 39 Q82 23 103 22 L115 22 L115 39Z" fill="#FFE1E1" /><path d="M121 22 L139 22 Q156 23 168 39 L121 39Z" fill="#FFE1E1" />
            <rect x="14" y="52" width="200" height="5" fill="#fff" />
            <rect ref={bl} x="6" y="46" width="10" height="9" rx="2" fill="#FF5C5C" opacity=".35" />
            <circle ref={glow} cx="8" cy="50" r="22" fill="#FF5C5C" opacity="0" />
            <rect x="140" y="44" width="18" height="18" rx="2" fill="#fff" stroke="#D2090F" strokeWidth="2" /><text x="144.5" y="58" fontFamily="Sora,sans-serif" fontWeight="800" fontSize="13" fill="#D2090F">L</text>
            <g ref={w1}><circle cx="54" cy="74" r="15" fill="#1E1516" stroke="#5c4a4c" strokeWidth="4" /><path d="M54 62v24M42 74h24" stroke="#9a8a8c" strokeWidth="2" /></g>
            <g ref={w2}><circle cx="172" cy="74" r="15" fill="#1E1516" stroke="#5c4a4c" strokeWidth="4" /><path d="M172 62v24M160 74h24" stroke="#9a8a8c" strokeWidth="2" /></g>
          </g>
        </svg>
      </div>
      <button type="button" onPointerDown={start} onPointerUp={stop} onPointerLeave={stop} onPointerCancel={stop} onContextMenu={(e) => e.preventDefault()}
        onKeyDown={(e) => (e.key === " " || e.key === "Enter") && start(e)} onKeyUp={(e) => (e.key === " " || e.key === "Enter") && stop()}
        className={`mt-4 flex h-14 w-full select-none items-center justify-center gap-2 rounded-2xl font-display text-base font-bold transition ${holding ? "scale-[0.98] bg-white text-red-700" : "bg-red-600 text-white hover:bg-red-500"}`}
        aria-label="Hold to apply the instructor's brake">
        {holding ? "Braking…" : "Hold: Instructor Brake"}
      </button>
      <p className="mt-3 text-xs text-red-100/70">A simple illustration of how a dual control vehicle lets your instructor slow the car.</p>
    </div>
  );
}

/* ------------------------------------------------------------- why us */
export function WhyUs() {
  const icons = [Users, HeartHandshake, ShieldCheck, Home, Users];
  return (
    <section id="why" className="section scroll-mt-16 bg-white">
      <div className="wrap">
        <Reveal className="text-center">
          <span className="kicker">Why Choose Us</span>
          <h2 className="h2">Why learners choose <span className="text-red-600">G-TECH</span></h2>
        </Reveal>
        <div className="mt-12 grid auto-rows-[minmax(190px,auto)] gap-4 md:grid-cols-3">
          {WHY.map((w, k) => {
            const I = icons[k];
            return (
              <Reveal key={w.title} delay={k * 0.06} className={w.big ? "md:row-span-2" : ""}>
                <TiltCard big={w.big}>
                  {w.big ? (
                    <>
                      <span className="kicker !text-red-100 before:!bg-red-100">Trusted by thousands</span>
                      <div className="mt-6 font-display text-7xl font-extrabold leading-none sm:text-8xl"><Counter to={5000} suffix="+" /></div>
                      <div className="mt-auto pt-10"><h3 className="text-2xl font-extrabold">{w.title}</h3><p className="mt-2 text-red-50">{w.body}</p></div>
                    </>
                  ) : (
                    <>
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600"><I className="h-6 w-6" /></span>
                      <div className="mt-auto pt-6"><h3 className="text-lg font-extrabold text-ink">{w.title}</h3><p className="mt-1.5 text-sm text-ink-soft">{w.body}</p></div>
                    </>
                  )}
                </TiltCard>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function TiltCard({ children, big }: { children: React.ReactNode; big?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const move = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    ref.current.style.transform = `perspective(900px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
    ref.current.style.setProperty("--mx", `${(x + 0.5) * 100}%`);
    ref.current.style.setProperty("--my", `${(y + 0.5) * 100}%`);
  };
  const leave = () => { if (ref.current) ref.current.style.transform = ""; };
  return (
    <div ref={ref} onPointerMove={move} onPointerLeave={leave}
      className={`group relative flex h-full flex-col overflow-hidden rounded-3xl p-7 transition-transform duration-200 ${big ? "bg-red-600 text-white shadow-glow" : "border border-line bg-white shadow-card"}`}>
      <span className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100"
        style={{ background: `radial-gradient(400px circle at var(--mx,50%) var(--my,50%), ${big ? "rgba(255,255,255,.18)" : "rgba(210,9,15,.07)"}, transparent 60%)` }} />
      <div className="relative flex h-full flex-col">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------- door to door */
export function DoorToDoor() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return (
    <section className="section bg-mist">
      <div className="wrap grid items-center gap-10 lg:grid-cols-2">
        <Reveal>
          <span className="kicker">Door to Door Service</span>
          <h2 className="h2">Training That <span className="text-red-600">Fits Your Routine.</span></h2>
          <p className="lead">G-TECH offers door to door service, 7 days a week, so driving lessons fit around work, college and family life.</p>
          <a href={waLink("Hello G-TECH, I'd like to ask about door to door pickup for my area.")} target="_blank" rel="noopener" className="btn-red mt-8"><WhatsAppIcon className="h-4 w-4" /> Ask About Pickup</a>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="card p-6 sm:p-8">
            <div className="grid grid-cols-7 gap-2">
              {days.map((d, k) => (
                <motion.div key={d} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: k * 0.07 }}
                  className="flex flex-col items-center gap-2 rounded-2xl bg-red-600 py-4 text-white">
                  <span className="text-[11px] font-bold uppercase sm:text-xs">{d}</span>
                  <Check className="h-4 w-4" />
                </motion.div>
              ))}
            </div>
            <div className="mt-6 flex items-center gap-3 rounded-2xl bg-red-50 p-4 text-sm text-ink-soft">
              <Navigation className="h-5 w-5 shrink-0 text-red-600" /> Call or WhatsApp us to check pickup availability for your area.
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- road signs */
export function Signs() {
  const [flipped, setFlipped] = useState<number | null>(null);
  return (
    <section className="section bg-white">
      <div className="wrap">
        <Reveal className="text-center">
          <span className="kicker">Learn the Basics</span>
          <h2 className="h2">Know your <span className="text-red-600">road signs</span></h2>
          <p className="lead mx-auto">Tap or hover a sign to see what it means.</p>
        </Reveal>
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {SIGNS.map((s, k) => {
            const on = flipped === k;
            return (
              <Reveal key={s.name} delay={k * 0.05}>
                <button type="button" onClick={() => setFlipped(on ? null : k)} onMouseEnter={() => setFlipped(k)} onMouseLeave={() => setFlipped(null)}
                  aria-label={`${s.name}: ${s.tip}`} className="group h-56 w-full [perspective:900px]">
                  <span className={`relative block h-full w-full rounded-3xl transition-transform duration-700 [transform-style:preserve-3d] ${on ? "[transform:rotateY(180deg)]" : ""}`}>
                    <span className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-3xl border border-line bg-white shadow-card [backface-visibility:hidden]">
                      <SignSvg kind={s.kind} className="h-24 w-24 drop-shadow" />
                      <small className="font-display font-bold text-ink">{s.name}</small>
                    </span>
                    <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-3xl bg-red-600 p-5 text-center text-white [backface-visibility:hidden] [transform:rotateY(180deg)]">
                      <b className="font-display">{s.name}</b><span className="text-sm text-red-50">{s.tip}</span>
                    </span>
                  </span>
                </button>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- RTO */
export function Rto() {
  return (
    <section id="rto" className="section scroll-mt-16 bg-red-600 text-white">
      <div className="wrap grid gap-12 lg:grid-cols-[1fr_1.1fr]">
        <Reveal>
          <span className="kicker !text-red-100 before:!bg-red-100">RTO Support</span>
          <h2 className="mt-3 text-3xl font-extrabold leading-tight sm:text-5xl">Help with RTO procedures, every step of the way</h2>
          <p className="mt-5 max-w-lg text-lg text-red-50">Licence paperwork can feel confusing. G-TECH provides support related to RTO procedures, so you know what to expect and can focus on learning to drive.</p>
          <a className="btn-white mt-8" href={waLink("Hello G-TECH, I'd like to ask about RTO procedures support.")} target="_blank" rel="noopener"><FileText className="h-4 w-4" /> Ask About RTO Support</a>
        </Reveal>
        <ol className="grid gap-4">
          {RTO_STEPS.map((s, k) => (
            <Reveal key={s.title} delay={k * 0.08}>
              <li className="flex list-none gap-5 rounded-3xl bg-white p-5 text-ink shadow-card">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-600 font-display text-xl font-extrabold text-white">{k + 1}</span>
                <div><b className="font-display text-lg">{s.title}</b><p className="mt-1 text-sm text-ink-soft">{s.body}</p></div>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- team */
export function Team() {
  return (
    <section id="team" className="section scroll-mt-16 bg-white">
      <div className="wrap">
        <Reveal className="text-center">
          <span className="kicker">Our Team</span>
          <h2 className="h2">Meet the people behind <span className="text-red-600">G-TECH</span></h2>
        </Reveal>
        <div className="mx-auto mt-12 grid max-w-3xl gap-6 sm:grid-cols-2">
          {TEAM.map((m, k) => (
            <Reveal key={m.name} delay={k * 0.1}>
              <div className="group relative overflow-hidden rounded-[28px] border border-line bg-white p-8 text-center shadow-card">
                <div className="absolute inset-x-0 top-0 h-28 bg-red-600 transition-all duration-500 group-hover:h-32" />
                <div className="relative mx-auto flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-[6px] border-white bg-red-50 font-display text-5xl font-extrabold text-red-600 shadow-card">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {m.photo ? <img src={m.photo} alt={`${m.name}, ${m.role}`} className="h-full w-full object-cover" /> : m.name.split(" ").map((x) => x[0]).join("")}
                </div>
                <h3 className="relative mt-5 text-2xl font-extrabold">{m.name}</h3>
                <span className="relative mt-1 inline-block rounded-full bg-red-50 px-3 py-1 text-sm font-bold text-red-700">{m.role}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- FAQ */
export function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section className="section bg-mist">
      <div className="wrap grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal>
          <span className="kicker">Questions</span>
          <h2 className="h2">Good to <span className="text-red-600">know</span></h2>
          <p className="lead">Still unsure? Call or WhatsApp us and we&apos;ll guide you.</p>
        </Reveal>
        <div className="grid gap-3">
          {FAQ.map(([q, a], k) => {
            const on = open === k;
            return (
              <div key={q} className={`overflow-hidden rounded-2xl border bg-white transition ${on ? "border-red-600 shadow-card" : "border-line"}`}>
                <button type="button" aria-expanded={on} onClick={() => setOpen(on ? -1 : k)} className="flex w-full items-center justify-between gap-4 p-5 text-left font-display font-bold">
                  {q}
                  <ChevronDown className={`h-5 w-5 shrink-0 text-red-600 transition-transform ${on ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence initial={false}>
                  {on && (
                    <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} transition={{ duration: 0.3 }}>
                      <p className="px-5 pb-5 text-ink-soft">{a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- gallery (hidden until photos exist) */
export function Gallery() {
  if (!GALLERY.length) return null;
  return (
    <section id="gallery" className="section bg-white">
      <div className="wrap">
        <Reveal><span className="kicker">Gallery</span><h2 className="h2">Life at <span className="text-red-600">G-TECH</span></h2></Reveal>
        <div className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3">
          {GALLERY.map((g) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={g.src} src={g.src} alt={g.caption} loading="lazy" className="mb-4 w-full rounded-3xl" />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- enquiry wizard */
export function Enquiry() {
  const [step, setStep] = useState(1);
  const [type, setType] = useState("");
  const [level, setLevel] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [time, setTime] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState<Record<string, string>>({});
  const [sent, setSent] = useState("");

  const next = () => {
    if (step === 1 && !type) return setErr({ s: "Please choose two-wheeler or four-wheeler" });
    if (step === 2 && !level) return setErr({ s: "Please choose your experience" });
    if (step === 3) {
      const e: Record<string, string> = {};
      if (name.trim().length < 2) e.name = "Please enter your name";
      const digits = phone.replace(/[\s+-]/g, "").replace(/^91(?=\d{10}$)/, "");
      if (!/^[6-9]\d{9}$/.test(digits)) e.phone = "Enter a valid 10-digit mobile number";
      setErr(e);
      if (Object.keys(e).length) return;
      const lines = ["Hello G-TECH Motor Driving School,", "I'd like to enquire about driving training.", "",
        `Name: ${name.trim()}`, `Phone: ${phone.trim()}`, `Training type: ${type}`, `Experience: ${level}`];
      if (time) lines.push(`Preferred time: ${time}`);
      if (msg.trim()) lines.push(`Message: ${msg.trim()}`);
      lines.push("", "(Sent from the G-TECH website)");
      const url = waLink(lines.join("\n"));
      window.open(url, "_blank", "noopener");
      setSent(url);
      return;
    }
    setErr({});
    setStep(step + 1);
  };
  const pick = (setter: (v: string) => void, v: string) => { setter(v); setErr({}); setTimeout(() => setStep((s) => Math.min(3, s + 1)), 320); };
  const Opt = ({ v, sub, on, onClick, icon: I }: { v: string; sub: string; on: boolean; onClick: () => void; icon: typeof Bike }) => (
    <button type="button" onClick={onClick} aria-pressed={on}
      className={`flex items-center gap-4 rounded-2xl border-2 p-4 text-left transition ${on ? "border-red-600 bg-red-50" : "border-line bg-white hover:border-red-300"}`}>
      <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${on ? "bg-red-600 text-white" : "bg-red-50 text-red-600"}`}><I className="h-6 w-6" /></span>
      <span><b className="block font-display">{v}</b><small className="text-ink-mute">{sub}</small></span>
    </button>
  );
  const input = "mt-1.5 h-12 w-full rounded-xl border border-line bg-white px-4 text-base outline-none transition focus:border-red-600 focus:ring-4 focus:ring-red-100";

  return (
    <section id="enquire" className="section scroll-mt-16 relative overflow-hidden bg-white">
      <div className="pointer-events-none absolute -right-40 -top-40 h-[480px] w-[480px] rounded-full bg-red-50" aria-hidden />
      <div className="wrap relative grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <span className="kicker">Enquiry & Admission</span>
          <h2 className="h2">Start your training <span className="text-red-600">today.</span></h2>
          <p className="lead">Three quick steps. Your enquiry opens in WhatsApp, ready to send to G-TECH. Prefer to talk? Call us directly.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={telLink} className="btn-red"><Phone className="h-4 w-4" /> Call {fmtPhone(SITE.phone)}</a>
            <a href={waLink(DEFAULT_WA)} target="_blank" rel="noopener" className="btn-ghost"><WhatsAppIcon className="h-4 w-4" /> WhatsApp</a>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="card p-6 sm:p-8">
            {sent ? (
              <div className="py-8 text-center">
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-600 text-white"><Check className="h-8 w-8" /></span>
                <h3 className="mt-4 text-2xl font-extrabold">You&apos;re all set!</h3>
                <p className="mt-2 text-ink-soft">WhatsApp opened with your enquiry. Just tap send.</p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <a href={sent} target="_blank" rel="noopener" className="btn-red"><WhatsAppIcon className="h-4 w-4" /> Open WhatsApp again</a>
                  <button className="btn-ghost" onClick={() => { setSent(""); setStep(1); setType(""); setLevel(""); setName(""); setPhone(""); setTime(""); setMsg(""); }}>New enquiry</button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between text-sm font-bold"><span>Step {step} of 3</span><span className="text-red-600">{["Training type", "Experience", "Your details"][step - 1]}</span></div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-red-50"><motion.div className="h-full bg-red-600" animate={{ width: `${(step / 3) * 100}%` }} /></div>
                <AnimatePresence mode="wait">
                  <motion.div key={step} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.25 }} className="mt-6">
                    {step === 1 && (
                      <div><h3 className="text-xl font-extrabold">What do you want to learn?</h3><p className="text-sm text-ink-mute">Choose your training type.</p>
                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                          <Opt v="Two-wheeler" sub="Control, balance and safe riding habits" on={type === "Two-wheeler"} onClick={() => pick(setType, "Two-wheeler")} icon={Bike} />
                          <Opt v="Four-wheeler" sub="Practice in a dual control vehicle" on={type === "Four-wheeler"} onClick={() => pick(setType, "Four-wheeler")} icon={Car} />
                        </div></div>
                    )}
                    {step === 2 && (
                      <div><h3 className="text-xl font-extrabold">Your experience</h3><p className="text-sm text-ink-mute">So we can plan the right start for you.</p>
                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                          <Opt v="Beginner" sub="Starting from zero" on={level === "Beginner"} onClick={() => pick(setLevel, "Beginner")} icon={Sprout} />
                          <Opt v="Experienced learner" sub="Refresher or more practice" on={level === "Experienced learner"} onClick={() => pick(setLevel, "Experienced learner")} icon={ShieldCheck} />
                        </div></div>
                    )}
                    {step === 3 && (
                      <div className="grid gap-4 sm:grid-cols-2">
                        <label className="text-sm font-semibold">Name<input className={input} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />{err.name && <span className="mt-1 block text-xs text-red-600">{err.name}</span>}</label>
                        <label className="text-sm font-semibold">Phone Number<input className={input} value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" autoComplete="tel" />{err.phone && <span className="mt-1 block text-xs text-red-600">{err.phone}</span>}</label>
                        <label className="text-sm font-semibold sm:col-span-2">Preferred Training Time
                          <select className={input} value={time} onChange={(e) => setTime(e.target.value)}>
                            <option value="">Choose a time (optional)</option>
                            {["Early morning", "Morning", "Afternoon", "Evening", "Flexible"].map((t) => <option key={t}>{t}</option>)}
                          </select></label>
                        <label className="text-sm font-semibold sm:col-span-2">Message<textarea className={`${input} h-24 py-3`} value={msg} onChange={(e) => setMsg(e.target.value)} /></label>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
                {err.s && <p className="mt-3 text-sm text-red-600">{err.s}</p>}
                <div className="mt-6 flex items-center justify-between gap-3">
                  {step > 1 ? <button type="button" onClick={() => { setStep(step - 1); setErr({}); }} className="text-sm font-bold text-ink-soft hover:text-red-700">← Back</button> : <span />}
                  <button type="button" onClick={next} className="btn-red">{step === 3 ? <><WhatsAppIcon className="h-4 w-4" /> Enquire Now</> : <>Continue <ArrowRight className="h-4 w-4" /></>}</button>
                </div>
              </>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- contact */
export function Contact() {
  const dir = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(SITE.mapQuery)}`;
  return (
    <section id="contact" className="section scroll-mt-16 bg-mist">
      <div className="wrap">
        <Reveal><span className="kicker">Contact & Location</span><h2 className="h2">Find <span className="text-red-600">G-TECH</span></h2></Reveal>
        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          <Reveal>
            <div className="card flex h-full flex-col gap-5 p-7">
              <Brand />
              <div className="flex gap-3"><MapPin className="h-5 w-5 shrink-0 text-red-600" /><span>{SITE.addressLines.map((l) => <span key={l} className="block">{l}</span>)}</span></div>
              <a href={telLink} className="flex gap-3 hover:text-red-700"><Phone className="h-5 w-5 shrink-0 text-red-600" /> {fmtPhone(SITE.phone)} <span className="text-ink-mute">(calls)</span></a>
              <a href={waLink(DEFAULT_WA)} target="_blank" rel="noopener" className="flex gap-3 hover:text-red-700"><WhatsAppIcon className="h-5 w-5 shrink-0 text-red-600" /> {fmtPhone(SITE.whatsapp)} <span className="text-ink-mute">(WhatsApp)</span></a>
              <a href={`mailto:${SITE.email}`} className="flex gap-3 break-all hover:text-red-700"><Mail className="h-5 w-5 shrink-0 text-red-600" /> {SITE.email}</a>
              <div className="mt-auto flex flex-wrap gap-3 pt-2">
                <a href={dir} target="_blank" rel="noopener" className="btn-red"><Navigation className="h-4 w-4" /> Get Directions</a>
                <a href={telLink} className="btn-ghost"><Phone className="h-4 w-4" /> Call Now</a>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="overflow-hidden rounded-3xl border border-line bg-white shadow-card">
              <iframe title="Map of Choondickal, Vellarada" src={`https://www.google.com/maps?q=${encodeURIComponent(SITE.mapQuery)}&output=embed`}
                className="h-[360px] w-full sm:h-[440px]" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
              <p className="p-4 text-xs text-ink-mute">Map shows the Choondickal, Vellarada area. Call us for exact directions.</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- footer */
export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-red-700 text-white">
      <div className="wrap relative py-16">
        <LogoMark className="pointer-events-none absolute -right-10 -top-6 h-72 w-72 text-white/[0.06]" bg="transparent" />
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Brand light />
            <p className="mt-4 max-w-sm italic text-red-100">{SITE.tagline}</p>
            <p className="mt-6 font-display text-2xl font-extrabold">{SITE.joinLine}</p>
            <a href="#enquire" className="btn-white mt-6">Start Your Training <ArrowRight className="h-4 w-4" /></a>
          </div>
          <div>
            <b className="font-display">Explore</b>
            <ul className="mt-4 grid gap-2 text-red-100">
              {[["Home", "#home"], ["Training", "#training"], ["Why Choose Us", "#why"], ["RTO Support", "#rto"], ["Team", "#team"], ["Contact", "#contact"]].map(([l, h]) => (
                <li key={h}><a href={h} className="hover:text-white">{l}</a></li>
              ))}
            </ul>
          </div>
          <div className="text-red-100">
            <b className="font-display text-white">Contact</b>
            <p className="mt-4">{SITE.addressLines.join(", ")}</p>
            <p className="mt-2">Phone: <a href={telLink} className="font-semibold text-white">{fmtPhone(SITE.phone)}</a></p>
            <p>WhatsApp: <a href={waLink(DEFAULT_WA)} className="font-semibold text-white">{fmtPhone(SITE.whatsapp)}</a></p>
            <p className="break-all">Email: <a href={`mailto:${SITE.email}`} className="font-semibold text-white">{SITE.email}</a></p>
            <p className="mt-3 text-sm">{TEAM.map((m) => `${m.name}, ${m.role}`).join(" · ")}</p>
          </div>
        </div>
        <div className="mt-12 flex flex-col justify-between gap-2 border-t border-white/15 pt-6 text-sm text-red-100 sm:flex-row">
          <span>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</span>
          <span>{SITE.hashtag}</span>
        </div>
      </div>
    </footer>
  );
}
