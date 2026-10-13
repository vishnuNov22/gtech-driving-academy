# G-TECH MOTOR DRIVING SCHOOL — PROJECT RULES (v2, Next.js)

- Professional, trustworthy, modern driving school website. NOT an ecommerce site.
- Stack: Next.js 15 (App Router, static export) + Tailwind + framer-motion. No three.js / 3D (client removed it).
- Hero: muted, autoplay, looping video of a car doing the Kerala H test (public/videos/hero-h-test.mp4, HERO_VIDEO in site.ts); animated SVG H-track fallback.
- All content lives in src/content/site.ts (EDIT HERE).

## Business information (use exactly)
- G-TECH Motor Driving School — Choondickal, Vellarada, Trivandrum, Kerala — 695505
- Managing Director: Meethi Shaji · Instructor: Athul Dev
- Phone (calls): 8075732441 · WhatsApp (enquiries): 8590392667 · Email: sathi7474@gmail.com
- Tagline (client theme): "DRIVEN BY QUALITY · DEFINED BY TRUST" — shown in the hero, the promise band, the preloader and the footer · Join #DriveWithGtech and start your journey today!
- Do not invent street address, website URL, social handles or extra phone numbers.

## Supplied claims only
Family Owned & Operated · More Than 5000 Students Trained · 5 Star Safety Rated Dual Control Vehicles ·
Door to Door Service 7 Days A Week · Trained & Experienced Instructors.
No government certification, guaranteed licence, pass-rate or authority-affiliation claims. No offers/countdowns.
Copy note: the family-owned line reads "A family-run academy…" (client asked to remove the word "local").

## Visual identity
Alternating RED and PURE WHITE sections (client request). Hero = pure white with red text + red-framed video.
Red sections (maroon #360202 / #2A0101 / red-900 / red-950): Ticker, Promise, Safety, Door to Door, RTO, FAQ, Contact, Footer.
White sections (class="light" flips the CSS-variable tokens in globals.css): Stats, Training, Why Us, Signs, Team, Gallery, Enquiry.
Use token classes (text-ink, text-ink-soft, text-accent, bg-card, bg-tint, border-line) so content works on both. Fonts: Sora (headings) + Manrope (body).
Logo: learner silhouette + steering wheel (public/brand/logo-mark.svg, LogoMark component).
