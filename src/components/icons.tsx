import type { SVGProps } from "react";

export function WhatsAppIcon(p: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3a.5.5 0 0 0 0-.4l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4 5.1 5.1 0 0 0 3.2.7 2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.2-.2-.5-.3Z" />
    </svg>
  );
}

/** G-TECH mark: learner silhouette + steering wheel (vector version of the poster logo). */
export function LogoMark({ className, bg = "#D2090F" }: { className?: string; bg?: string }) {
  return (
    <svg viewBox="0 0 312 328" fill="none" stroke="currentColor" className={className} aria-hidden style={{ ["--logo-bg" as string]: bg }}>
      <circle cx="153" cy="67" r="62" strokeWidth="9" />
      <path d="M26 264 C 26 185 82 133 153 133 C 224 133 282 185 282 264 Z" strokeWidth="9" />
      <circle cx="154" cy="264" r="58" fill="currentColor" stroke="none" />
      <g fill="var(--logo-bg)" stroke="none">
        <path d="M154 216a48 48 0 0 0-46 34c14-6 30-9 46-9s32 3 46 9a48 48 0 0 0-46-34z" />
        <path d="M108 270a48 48 0 0 0 36 40l-6-30c-8-6-18-9-30-10z" />
        <path d="M200 270a48 48 0 0 1-36 40l6-30c8-6 18-9 30-10z" />
        <circle cx="154" cy="266" r="12" />
      </g>
    </svg>
  );
}

export function SignSvg({ kind, className }: { kind: string; className?: string }) {
  const c = className;
  switch (kind) {
    case "stop":
      return <svg viewBox="0 0 100 100" className={c}><polygon points="30,4 70,4 96,30 96,70 70,96 30,96 4,70 4,30" fill="#D2090F" stroke="#fff" strokeWidth="4" /><text x="50" y="60" textAnchor="middle" fontFamily="Sora,sans-serif" fontWeight="800" fontSize="24" fill="#fff">STOP</text></svg>;
    case "noentry":
      return <svg viewBox="0 0 100 100" className={c}><circle cx="50" cy="50" r="46" fill="#D2090F" /><rect x="18" y="42" width="64" height="16" rx="3" fill="#fff" /></svg>;
    case "speed":
      return <svg viewBox="0 0 100 100" className={c}><circle cx="50" cy="50" r="46" fill="#fff" stroke="#D2090F" strokeWidth="9" /><text x="50" y="62" textAnchor="middle" fontFamily="Sora,sans-serif" fontWeight="800" fontSize="34" fill="#1E1516">50</text></svg>;
    case "ped":
      return <svg viewBox="0 0 100 100" className={c}><path d="M50 6 96 90H4z" fill="#fff" stroke="#D2090F" strokeWidth="8" strokeLinejoin="round" /><circle cx="52" cy="40" r="5" fill="#1E1516" /><path d="M51 47l-6 14 6 4-2 12M51 50l9 8M47 58l-7 6M53 64l7 12" stroke="#1E1516" strokeWidth="4.5" fill="none" strokeLinecap="round" /></svg>;
    case "giveway":
      return <svg viewBox="0 0 100 100" className={c}><path d="M4 10h92L50 94z" fill="#fff" stroke="#D2090F" strokeWidth="9" strokeLinejoin="round" /></svg>;
    default:
      return <svg viewBox="0 0 100 100" className={c}><circle cx="50" cy="50" r="44" fill="#1D4ED8" stroke="#D2090F" strokeWidth="9" /><text x="50" y="66" textAnchor="middle" fontFamily="Sora,sans-serif" fontWeight="800" fontSize="44" fill="#fff">P</text><path d="M22 22 78 78" stroke="#D2090F" strokeWidth="9" /></svg>;
  }
}
