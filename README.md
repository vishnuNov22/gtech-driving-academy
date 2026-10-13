# G-TECH Motor Driving School: website v3 (Next.js)

Dark maroon & red theme across the whole site (client request). The first screen is a full-screen,
**muted, auto-playing, looping video** of a car taking the Kerala "H" test, with the tagline
DRIVEN BY QUALITY / DEFINED BY TRUST on top. No 3D / three.js any more.

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
| Hero video files | `HERO_VIDEO` |
| Why-us cards | `WHY` |
| Road signs, RTO steps, FAQ | `SIGNS`, `RTO_STEPS`, `FAQ` |
| Gallery | `GALLERY` (the section stays hidden until you add a photo) |

## The hero video

1. Put the video at `public/videos/hero-h-test.mp4` (H.264, no audio, about 1920px wide, ideally under 8 MB).
2. Optional: add `hero-h-test.webm` and a still `hero-poster.jpg`, then set them in `HERO_VIDEO` in `src/content/site.ts`.
3. Compress with ffmpeg if needed:
   `ffmpeg -i input.mp4 -an -vcodec libx264 -crf 28 -preset slow -movflags +faststart -vf scale=1920:-2 hero-h-test.mp4`

The video always plays without sound (`muted`, `playsInline`, `loop`) so it autoplays on phones too, and visitors
can pause it. If the file is missing, an animated H-track drawing is shown instead.

## Rules kept from v1

- Only the supplied claims are used: Family Owned & Operated · More Than 5000 Students Trained · 5 Star Safety Rated Dual Control Vehicles · Door to Door Service 7 Days A Week · Trained & Experienced Instructors.
- No pass-rate claims, guaranteed licences, government affiliation claims, offers or countdowns.
- Enquiries open WhatsApp (8590392667) with the details filled in. Nothing is stored on a server.
