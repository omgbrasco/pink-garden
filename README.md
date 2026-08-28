# Pink Garden

Live: https://omgbrasco.github.io/pink-garden/

She talks to Dumpling from her iPhone home-screen icon. This repo is the toy.

## Layout
- `index.html` `styles.css` `app.js` `sw.js` `manifest.webmanifest` — the app
- `assets/` — what her phone loads (WebP, icon)
- `originals/` — PNG masters, not served

## Ship
Bump the same `?v=N` / BUILD / SW cache name together. Push `master`. She force-quits the icon to pick it up.

Customizable pieces (moon, later sky) are their own transparent layers. Do not fake tints with a CSS circle on the flattened garden.
