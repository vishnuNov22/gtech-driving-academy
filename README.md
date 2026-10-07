# G-TECH Motor Driving Academy — website

Single-page static site. Open `index.html`, or run `python -m http.server 8080` and visit http://localhost:8080

## Edit content
Everything is in the **EDIT HERE** block at the top of the `<script>` in `index.html`:
- `SITE.phone` — calling number · `SITE.whatsapp` — WhatsApp number for enquiries
- `TRAINING` — training cards (add new packages here)
- `TEAM` — add photos: put `shaji.jpg` / `athul.jpg` in `images/` and set `photo: "images/shaji.jpg"`
- `GALLERY` — add real photos, e.g. `{ src: "images/gallery-1.jpg", caption: "Four-wheeler training" }`.
  The Gallery section and menu link appear automatically once at least one photo is added.

## Map
The map shows the Choondickal, Vellarada area using `SITE.mapQuery`. For an exact pin, replace `mapQuery` with the academy's Google Maps place name or address once confirmed.

## How enquiries work
The 3-step enquiry form (training type → experience → details) checks the details, then opens WhatsApp (8590392667) with the enquiry typed out. The learner taps send.
Call buttons dial 8075732441. Nothing is stored on a server.

## Deploy free
Push this folder to a GitHub repo, then import it on vercel.com (Framework Preset: Other) — every `git push` updates the live site.
