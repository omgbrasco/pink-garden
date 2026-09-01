# Handoff — 2026-08-30

Closed from the Grok Bot "Dumpling" workshop. This repo is the source of truth.

## Live

- URL: https://omgbrasco.github.io/pink-garden/
- Branch: `master` (GitHub Pages)
- Cache: **v=22** (`BUILD = 22`, SW `dumpling-v22`)
- Last ship: real nav bar. Tabs are now Home / Chats / Settings (was Garden / Catch / Glow). The `i` info button is gone; its "how I work" text and the chat history moved into their own tab screens.

## What she sees (default = blue garden)

- Full-bleed blue night painting (`assets/skin-blue.webp`). Dumpling sits on a mossy rock.
- No floating cutout on this skin. She is talking to the **painted** dumpling.
- His replies: glass bubble `#speech` near his face.
- Her lines: `#said`, faint at the top, then fade.
- One glass composer pill: field + in-pill mic + send arrow.
- Tap mic → waveform in the pill → SpeechRecognition transcript → `sendText`.
- Tabs: **Home** (garden + composer, live per-message speech/thought bubbles), **Chats** (full scrollable transcript, permanent, never wipes), **Settings** (plain-English "how I work" note, Skin toggle, Light toggle, moon-color swatches when on pink, "Catch fireflies" button).
- Quick-action chips (Pink garden, Catch fireflies, night/morning, etc.) still float above the composer on Home while she's actively typing — those are shortcuts into chat, separate from the real controls in Settings.

## Pink garden (opt-in)

Settings → Skin → "Pink garden". Then:

- Layered scene: CSS sky + `garden.webp` (moon painted out) + `moon.webp` tint layer.
- Floating Dumpling (`dumpling-avatar.webp`) with thought bubble and idle float.
- Stacked glass chat bubbles in `#log`.
- Joke egg is gone (removed v18).

## Files that matter

| File | Role |
|---|---|
| `index.html` | Shell, cache query strings |
| `styles.css` | Layout, safe areas, blue vs pink, composer, speech |
| `app.js` | Play state, replies, skins, fireflies, mic, tabs, settings, viewport |
| `sw.js` | `dumpling-vN`; images cache-first; html/css/js network-first |
| `manifest.webmanifest` | Standalone PWA, `start_url ./?v=N` |
| `assets/skin-blue.webp` | Home art |
| `assets/garden.webp` + `moon.webp` | Pink layered garden |
| `assets/dumpling-avatar.webp` | Floating dumpling (pink only) |
| `assets/dumpling-icon.png` | 512×512 square home-screen icon |
| `originals/` | Masters. Do not delete. Do not serve. |

## localStorage

`dumpling-play-v1`: `{ moon, sky, night, skin, homeBlue }`. First load after `homeBlue` shipped forces blue once; after that her last skin sticks.

`dumpling-chat-v1`: array of every message either side has said (`{ who, text, t }`), capped at 300. Powers the **Chats** tab. Never wiped on ship.

## iPhone notes

- **13** (notch) is the size to protect. **16 Pro** (Dynamic Island + home indicator) is the other target.
- Viewport: `width=device-width, initial-scale=1, viewport-fit=cover`.
- `apple-mobile-web-app-capable` + `black-translucent`.
- Updates: force-quit the icon. Safari pull-to-refresh often lies.
- Home-screen **icon bitmap** is cached by iOS until she deletes the icon and adds it again.
- `webkitSpeechRecognition` is flaky or missing in iOS Safari. UI still shows the waveform; fallback is the keyboard mic. Do not add a cloud STT.

## Known leftover (optional, not blockers)

- Speech bubble `#speech` position (`left: 54%; top: 26%`) may need a nudge vs his cheek on 16 Pro. Ask for a screenshot before guessing.
- iOS page dictation may never be reliable without leaving the sandbox.
- `originals/friend.png` is the blue-garden master; live copy is `assets/skin-blue.webp`.
- `originals/dumpling-icon-landscape.png` is the old stretched 512×341 icon. Keep it. Do not serve it.

## What "done" looks like for a change

1. Blue home still full-bleed, painted dumpling still the speaker.
2. Pink still has floating dumpling + layered moon.
3. Cache number bumped in all four places.
4. 13 and 16 Pro: no black/pink bar under the app, composer above the home indicator.
5. Braedon told to force-quit the icon.
