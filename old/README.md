# Aura SpecialFX website

A one-page premium website for Aura SpecialFX (Trivandrum, Kerala), in the brand's own colours: deep forest green, cream and champagne gold.

## Folder structure

```
aura-specialfx-website/
├── index.html              ← the page (open this)
├── css/style.css           ← all styling; colours are the variables at the top
├── js/effects.js           ← particle engine (sparks, fog, petals, foam, bubbles…)
├── js/main.js              ← effects list, gallery, showreel, WhatsApp form
├── assets/
│   ├── brand/              ← logo files (gold / green / cream PNG + original)
│   ├── fonts/              ← Italiana + Outfit, self-hosted
│   ├── images/             ← PUT THE INSTAGRAM PHOTOS HERE (see step 2)
│   └── videos/             ← showreel.mp4 (web cut) + optional clips
└── showreel/
    ├── aura-showreel-1080p.mp4   ← 15-second motion showreel, full quality with sound
    └── source/                   ← code that renders the showreel
```

## 1. Open in VS Code

1. Unzip, then **File → Open Folder…** and pick `aura-specialfx-website`.
2. Install the **Live Server** extension (by Ritwick Dey).
3. Right-click `index.html` → **Open with Live Server**. The page reloads every time you save.

## 2. Add the photos

`aura-media-images.zip` was downloaded to your Downloads folder. Unzip it and copy everything inside its `images` folder into `assets/images/`.

The gallery expects these file names (already matching the zip):

grand-entry, dry-ice-clouds, beach-rose-shower, cold-pyro, booth-360, foam-party-kerala,
glitter-shower, rose-petals-couple, bubbles-dryice-glitter, wedding-entry-magical,
foam-dj-lights, dry-ice-entry, petal-shower, foam-haldi, wedding-entry-1, dry-ice-effect,
aura-magic, foam-madhuramvepp (all `.jpg`)

To change captions or order, edit the `GALLERY` list in `js/main.js`.

## 3. Add videos (optional, recommended)

Ask Aura for their original reel files (much better quality than Instagram).

- **Gallery clips:** save as `assets/videos/<same-name>.mp4`, e.g. `dry-ice-clouds.mp4`. Tiles with a ▶ icon play the clip; if the file is missing, the photo shows instead.
- **Hero background:** save a short silent loop as `assets/videos/hero.mp4`. Until then, `dry-ice-clouds.jpg` shows behind the sparks.

Keep web videos small: `ffmpeg -i in.mp4 -vf scale=-2:720 -crf 27 -an -movflags +faststart out.mp4`

## 4. Change colours, text and contact details

- **Colours:** `:root` block at the top of `css/style.css`.
- **Phone / WhatsApp:** `WHATSAPP` at the top of `js/main.js`, plus the `tel:` and `wa.me` links in `index.html`.
- **Packages:** in `index.html` under `PACKAGES`. Confirm what Aura actually sells before going live.

## 5. The showreel

`showreel/aura-showreel-1080p.mp4` is a 15-second, 1080p motion piece with a soundtrack, ready for Instagram, WhatsApp or the pitch meeting.

To edit and re-render it: open `showreel/source/reel.html`, change the scene functions, then run

```
pip install playwright numpy scipy && playwright install chromium
python render.py      # renders video_noaudio.mp4
python audio.py       # builds soundtrack.wav
ffmpeg -i video_noaudio.mp4 -i soundtrack.wav -c:v libx264 -crf 21 -pix_fmt yuv420p -c:a aac -shortest aura-showreel-1080p.mp4
```

## 6. Go live

- **Quickest:** drag the folder onto https://app.netlify.com/drop to get a live link in about a minute.
- **For the client:** buy a domain (e.g. auraspecialfx.in) and connect it in Netlify or Vercel.

## Before handing over

- [ ] Get Aura's permission to use their photos and videos, plus the original high-resolution logo file (the current logo comes from a 150 px image)
- [ ] Confirm the package contents and partner names
- [ ] Set up a Google Business Profile and link it to the site
- [ ] Test the WhatsApp form on a phone
