"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Phone, X } from "lucide-react";
import { DEFAULT_WA, SITE, telLink, waLink } from "@/content/site";
import { LogoMark, WhatsAppIcon } from "./icons";

const LINKS = [
  ["Home", "#home"], ["Training", "#training"], ["Safety", "#safety"], ["Why Us", "#why"],
  ["RTO Support", "#rto"], ["Team", "#team"], ["Contact", "#contact"],
] as const;

export function Brand({ light = false, onWhite = false }: { light?: boolean; onWhite?: boolean }) {
  return (
    <a href="#home" className="flex items-center gap-2.5" aria-label="G-TECH Motor Driving School — home">
      <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${light ? "bg-white text-red-600" : "bg-red-600 text-white"}`}>
        <LogoMark className="h-8 w-8" bg={light ? "#ffffff" : "#D2090F"} />
      </span>
      <span className="leading-none">
        <span className={`block font-display text-xl font-extrabold tracking-tight ${light ? "text-white" : onWhite ? "text-[#5C0404]" : "text-ink"}`}>G-TECH</span>
        <span className={`block text-[10px] font-bold uppercase tracking-[0.18em] ${light ? "text-red-100" : onWhite ? "text-red-600" : "text-red-400"}`}>Motor Driving School</span>
      </span>
    </a>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? "bg-surface/90 shadow-[0_6px_30px_-12px_rgba(0,0,0,.6)] backdrop-blur-lg" : "bg-transparent"}`}>
        <div className="wrap flex h-16 items-center justify-between gap-4 sm:h-[72px]">
          <Brand onWhite={!scrolled} />
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
            {LINKS.map(([l, h]) => (
              <a key={h} href={h} className={`rounded-full px-3.5 py-2 text-sm font-semibold transition ${scrolled ? "text-ink-soft hover:bg-white/10 hover:text-white" : "text-[#5C0404] hover:bg-red-600 hover:text-white"}`}>{l}</a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <a href={telLink} className={`hidden h-11 items-center gap-2 rounded-full px-4 text-sm font-bold md:inline-flex ${scrolled ? "text-ink hover:text-red-300" : "text-[#5C0404] hover:text-red-600"}`}><Phone className="h-4 w-4 text-red-500" /> Call</a>
            <a href="#enquire" className="btn-red hidden h-11 sm:inline-flex">Enquire Now</a>
            <button onClick={() => setOpen(true)} className="flex h-11 w-11 items-center justify-center rounded-full bg-red-600 text-white lg:hidden" aria-label="Open menu" aria-expanded={open}>
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-[60] flex flex-col bg-red-600 text-white lg:hidden" initial={{ clipPath: "circle(0% at 92% 4%)" }}
            animate={{ clipPath: "circle(150% at 92% 4%)" }} exit={{ clipPath: "circle(0% at 92% 4%)" }} transition={{ duration: 0.5, ease: [0.7, 0, 0.2, 1] }}>
            <div className="wrap flex h-16 items-center justify-between">
              <Brand light />
              <button onClick={() => setOpen(false)} className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-red-600" aria-label="Close menu"><X className="h-5 w-5" /></button>
            </div>
            <nav className="wrap mt-6 flex flex-1 flex-col gap-1" aria-label="Mobile">
              {LINKS.map(([l, h], i) => (
                <motion.a key={h} href={h} onClick={() => setOpen(false)} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.05 }}
                  className="flex items-baseline gap-4 border-b border-white/15 py-3.5 font-display text-3xl font-extrabold">
                  <span className="text-sm font-bold text-red-200">0{i + 1}</span>{l}
                </motion.a>
              ))}
            </nav>
            <div className="wrap grid grid-cols-2 gap-3 pb-8">
              <a href={telLink} className="btn-white"><Phone className="h-4 w-4" /> Call</a>
              <a href={waLink(DEFAULT_WA)} target="_blank" rel="noopener" className="btn-white"><WhatsAppIcon className="h-4 w-4" /> WhatsApp</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function Preloader() {
  const [done, setDone] = useState(false);
  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = setTimeout(() => setDone(true), reduced ? 0 : 1400);
    return () => clearTimeout(t);
  }, []);
  return (
    <AnimatePresence>
      {!done && (
        <motion.div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-red-600 text-white" exit={{ y: "-100%" }} transition={{ duration: 0.7, ease: [0.7, 0, 0.2, 1] }}>
          <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6 }}>
            <LogoMark className="h-24 w-24" />
          </motion.div>
          <p className="mt-5 font-display text-3xl font-extrabold tracking-tight">G-TECH</p>
          <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.22em] text-red-100">{SITE.taglineParts[0]} · {SITE.taglineParts[1]}</p>
          <div className="mt-6 h-[3px] w-40 overflow-hidden rounded-full bg-white/25">
            <motion.div className="h-full bg-white" initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 1.2, ease: "easeInOut" }} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function FloatingActions() {
  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col gap-3">
      <a href={waLink(DEFAULT_WA)} target="_blank" rel="noopener" aria-label="Chat on WhatsApp"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_-8px_rgba(37,211,102,.7)] transition hover:scale-105">
        <WhatsAppIcon className="h-7 w-7" />
      </a>
      <a href={telLink} aria-label={`Call G-TECH on ${SITE.phone}`}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-white shadow-glow transition hover:scale-105 md:hidden">
        <Phone className="h-6 w-6" />
      </a>
    </div>
  );
}
