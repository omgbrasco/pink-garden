# Handoff — 2026-08-30

Closed from the Grok Bot "Dumpling" workshop. This repo is the source of truth.

## Live

- URL: https://omgbrasco.github.io/pink-garden/
- Branch: `master` (GitHub Pages)
- Cache: **v=33** (`BUILD = 33`, SW `dumpling-v33`). `docs/STATE.md` has the latest.
- Last ship: pink garden's `#garden` is now full-bleed (`inset:0`), matching blue. It was previously capped to the bottom ~52% of the screen with a flat CSS gradient filling the rest above it — but `garden.webp` already contains a complete painted sky, so that produced a hard, ugly seam. `moon.webp` shares the same crop as `garden.webp`, so alignment carried over automatically with no separate retuning.

## Night garden (opt-in dark theme since v32)

The app opens on the pink garden (see below). The night garden is the opt-in dark theme: the ☰ menu's switch row, or Settings → Skin. Its menus and screens use the "midnight pink" colors (`--ui-*` variables).

- Full-bleed blue night painting (`assets/skin-blue.webp`). Dumpling sits on a mossy rock.
- No floating cutout on this skin. She is talking to the **painted** dumpling.
- His replies: glass bubble `#speech` near his face.
- Her lines: `#said`, faint at the top, then fade.
- One glass composer pill: field + in-pill mic + send arrow.
- Tap mic → waveform in the pill → SpeechRecognition transcript → `sendText`.
- No tab bar (removed v30). Home is just the garden, Dumpling's bubble, and the composer.
- ☰ top-left opens a slide-out menu: streak in the header, then **My list** (things she asked Dumpling to keep, some with a ⏰ reminder time; count badge), **Chat history** (full transcript, never wipes), switch garden, **Catch fireflies**, **Settings** (Garden: Skin, Light, moon swatches on pink. Feedback: "Type it…" box + fat "Say it" button, syncs to the gist). Chat history and Settings are full screens with a back arrow.
- Quick-action chips (Pink garden, Catch fireflies, night/morning, etc.) still float above the composer on Home while she's actively typing — those are shortcuts into chat, separate from the real controls in Settings.

## What's new card

First open after an update: Dumpling pops up with a short bubble (one or more steps, Next between them) and a "Show me" button. Entries live in the `NEWS` list at the top of `app.js`, with each step two short lines. If she missed several updates, she sees all their steps in one card, oldest first (up to 4). Seen state: `dumpling-seen-v1` in localStorage.

## My list + reminders

`dumpling-list-v1`: `[{ id, text, done, t, due?, reminded? }]`, capped at 100. Chat: "add X to my list", "what's on my list", "got X", "clear my list", "remind me to X at 5 / in 20 minutes / tomorrow / tonight / monday". No server, so no phone notifications: Dumpling shows "⏰ Don't forget: X" on home the first time she's there after the due time. Real push would need a backend and a rail change, and that's Braedon's call (he chose in-app, v31).

## Pink garden (default since v32)

What she sees when she opens the app:

- Layered scene: CSS sky + `garden.webp` (moon painted out) + `moon.webp` tint layer.
- Floating Dumpling (`dumpling-avatar.webp`) with thought bubble and idle float.
- Dumpling's replies show in the bubble right above him (`#thought`, wraps for long replies, stays up 9 to 20s depending on length). Her line fades at the top (`#said`). No stacked bubbles on home (v33).
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

`dumpling-play-v1`: `{ moon, sky, night, skin, homePink }`. The first load after v32 forces pink once; after that her last skin sticks.

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
