# G-TECH Motor Driving School: website v2 (Next.js + 3D)

This version uses a red & white theme taken from the G-TECH poster. The first screen is a
scroll-driven **3D story**: a red G-TECH car drives a winding road through five chapters as the
visitor scrolls.

## Run it on your laptop

```powershell
npm install
npm run dev
```

Then open http://localhost:3000. On Windows you can also double-click `start-dev.bat`.

## Deploy free (Vercel)

1. Push this folder to a GitHub repo.
2. On vercel.com, choose **Add New → Project**, import the repo and click **Deploy**. Leave the settings as they are; Next.js is detected automatically.
3. Every `git push` updates the live site.

The site is a static export (`output: "export"`), so `npm run build` also produces a plain `out/` folder that works on any static host.

## Edit content

Everything is in **`src/content/site.ts`**:

| What | Where |
|---|---|
| Phone, WhatsApp, email, address, map | `SITE` |
| Team names, roles and photos | `TEAM` (put photos in `public/images/` and set, for example, `photo: "/images/athul-dev.jpg"`) |
| Training cards | `TRAINING` |
| 3D story chapter text | `STORY` |
| Why-us cards | `WHY` |
| Road signs, RTO steps, FAQ | `SIGNS`, `RTO_STEPS`, `FAQ` |
| Gallery | `GALLERY` (the section stays hidden until you add a photo) |

## The 3D story (`src/components/story/`)

- `world.ts` holds the three.js scene: road with red-white kerbs, the G-TECH car with an L-board,
  a start gate, a dual-control halo, road signs that pop up, a town with traffic, and the
  `#DriveWithGtech` finish arch.
- `Story.tsx` connects scroll position to the scene and shows the chapter cards.
- On phones it automatically uses lighter graphics (no shadows, fewer trees).
- If WebGL isn't available, a red poster-style background is shown instead. The chapter text still works.
- If the visitor has `prefers-reduced-motion` on, idle animations are switched off and the
  scene follows the scroll directly.

## Rules kept from v1

- Only the supplied claims are used: Family Owned & Operated · More Than 5000 Students Trained · 5 Star Safety Rated Dual Control Vehicles · Door to Door Service 7 Days A Week · Trained & Experienced Instructors.
- No pass-rate claims, guaranteed licences, government affiliation claims, offers or countdowns.
- Enquiries open WhatsApp (8590392667) with the details filled in. Nothing is stored on a server.
