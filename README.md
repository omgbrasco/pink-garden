# Pink Garden / Dumpling

Live: https://omgbrasco.github.io/pink-garden/

A one-page iPhone gift. She talks to Dumpling from a home-screen icon. No login, no backend, no AI network calls.

**Open this folder in Claude Code or Codex.** Read `AGENTS.md` and `docs/HANDOFF.md` first.

## Layout

- App: `index.html` `styles.css` `app.js` `sw.js` `manifest.webmanifest`
- `assets/` — what the phone loads (WebP, icon)
- `originals/` — PNG masters, not served
- `docs/` — handoff, changelog, how to reverse a ship

## Ship

Bump the same cache version in html query strings, `BUILD` in `app.js`, the SW cache name, and the manifest. Push `master`. She force-quits the home-screen icon to pick it up.

## Rails (short)

Static HTML/CSS/JS. Layered art (no fake CSS moon). Blue garden is home. Floating Dumpling is pink-only. Keep the joke egg. No extra NSFW. No force-push.
