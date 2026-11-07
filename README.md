# HymnFlow — Modern SDA Hymnal Website (Starter)

A responsive **blue and turquoise glassmorphism** HTML/CSS/JavaScript website inspired by modern worship music dashboards.

## Features
- English and Tagalog demo catalog
- Search by song title, demo number, language, lyrics, or category
- Favorites and a worship plan saved locally in the browser
- Song details with verses and illustrative sheet-music notation
- Simple synthesized melody demo via browser Web Audio API
- Presentation mode with next/previous verse controls
- Light and dark modes, responsive design, and font size controls

## Important copyright / accuracy note
The six songs included in `js/script.js` are **original fictional demonstration songs**. They are not presented as official Seventh-day Adventist Hymnal entries. The notation and audio are illustrative melodies, not authentic scores. Before adding official English or Tagalog hymn texts, arrangements, sheet music, or recordings, verify the correct rights and source materials for each work and recording. Do not bulk-copy another application's catalog.

## Run locally
Open `index.html` in a modern browser. No installation, database, or build step is required.

## Deploy using GitHub Pages
1. Create a new **public** repository named `sda-hymnal-website` on GitHub.
2. Upload `index.html`, `css/style.css`, `js/script.js`, and this README, keeping folder structure.
3. In repository **Settings → Pages**, choose **Deploy from a branch**, branch **main**, folder **/(root)**, and save.
4. After deployment, visit the Pages link listed in Settings.

## Customize
- Colors and glass effects: `css/style.css` (see `:root` variables)
- Hymn data: `HYMNS` array at the start of `js/script.js`
- Branding, labels, layout: `index.html`

## Project limitations
Favorites and worship plan are stored **per browser**, not synced to accounts. The song catalog is a local demo array, not an online database. The website is an independent concept and is not an official church publication.