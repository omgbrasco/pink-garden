# Agent rails — pink-garden

You are editing a **girlfriend gift**. She is not technical. She uses an iPhone home-screen web clip, not a desktop browser.

Live: https://omgbrasco.github.io/pink-garden/
Repo: `omgbrasco/pink-garden` (GitHub Pages from **`master`**)
Local: `C:\Users\braed\src\pink-garden`

Read `docs/HANDOFF.md` before you touch code. Read `docs/REVERSING.md` before any git write.

## Non-negotiables

- Static HTML, CSS, JS only. No React, Vue, Vite, Next, Tailwind-as-a-build, no bundler.
- No backend. No accounts. No posting. No X.
- No outbound LLM. No public API keys. No network calls except loading this origin's files.
- Sandbox: moon/sky/skins, localStorage play state, firefly mini-game, chat replies from `app.js` dictionaries.
- She must never leave the garden (no external links).
- Keep it cute, simple, safe, playful.
- The joke egg was removed (v18, Braedon's call). Do not add it or any other NSFW back.
- iPhone 13 first, then iPhone 16 Pro. Safe areas, `viewport-fit=cover`, home-screen capable.
- Do not use Cursor Cloud Agents for this repo. Edit files here and push `master`.

## Art

- Customizable pieces (moon on the **pink** garden) are **their own transparent image layers**.
- Never tint with a CSS circle, blob, or mix-blend on a flattened JPEG/PNG.
- Serve WebP (or small PNG icons) from `assets/`. Keep fat PNG masters in `originals/` (not referenced by the page).
- Do not delete `originals/`.

## Folders

```
index.html styles.css app.js sw.js manifest.webmanifest
assets/      # what her iPhone loads
originals/   # PNG masters, not served
docs/        # handoff for humans and coding agents
```

## Ship (every visible change)

1. Bump the **same** cache number together:
   - `index.html` `?v=N` on every local asset
   - `app.js` `const BUILD = N`
   - `sw.js` `dumpling-vN`
   - `manifest.webmanifest` `start_url` and icon `?v=N`
2. Commit on `master` with a short why-message.
3. `git push origin master` (never `--force`).
4. Tell Braedon: same URL, **force-quit the home-screen icon** (swipe the app away, tap again). Safari refresh is not enough. Dock **icon art** only updates if she deletes the icon and Add-to-Home-Screen again.

Current cache as of this handoff: **v=18**.

## Product rules that already bit us

- Home is the **blue** night garden (`assets/skin-blue.webp`). Floating Dumpling is **pink garden only**.
- On blue, she talks to the **painted** dumpling: face bubble (`#speech`), her line fades at the top (`#said`). No stacked chat bubbles on blue.
- Do not hide Dumpling with a "keyboard is up" class driven by `screen.height` vs `visualViewport` — Safari chrome looks like a keyboard and he vanishes.
- App icon must be **square** (512×512). A 3:2 PNG gets stretched by iOS.
- `100dvh` + a dark `body` background = black bar on 16 Pro. Fill the screen; keep chat padding inside the safe area.
- Composer is **one glass pill**. Mic lives inside it. Do not bring back a separate mic button.

## Play state

`localStorage` key `dumpling-play-v1`: moon color, sky, night, skin (`pink`|`blue`), `homeBlue`.
Do not wipe it unless Braedon asks.

## Who she is talking to

On **blue** (default): the dumpling sitting on the rock in the painting.
On **pink**: the floating cutout `#buddy`.
