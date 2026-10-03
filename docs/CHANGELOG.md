# Changelog (ships)

Newest first. Hashes are on `master`.

- v31 — Less reading, more showing. Settings is now just Garden + Feedback. Feedback is a "Type it…" box and one fat "Say it" button (tap to record, tap again and it sends; taps under 1s are ignored). Removed the Feedback description, the voice-memo chip, the "ideas waiting" line, the Play/Catch fireflies button (still in the ☰ menu and chips), and the How I work section (Braedon's call). New what's-new card: the first open after an update, Dumpling pops up with a bubble explaining what changed and a "Show me" button (v31's opens the menu). Shown once, tracked in `dumpling-seen-v1`. Fixed: an idea sent while an earlier one was still uploading could be wiped from the queue.
- v30 — Clean home + side menu. The bottom tab bar is gone: home is just Dumpling, his speech bubble, and the composer. A ☰ button (top-left, where the moon bubble was) slides out a menu: Chat history, switch garden, Catch fireflies, Settings. Streak moved into the menu header. Feedback tab merged into Settings as "Ideas for Braedon" (same gist sync, same localStorage keys). Chat history and Settings are full screens with a back arrow. Tap outside or swipe left to close the menu. Fixed an empty "🎤 ×" voice-memo chip that always showed in the idea box (CSS `display:flex` was overriding `hidden`). Checked on every current iPhone size, SE (375×667) to 16/17 Pro Max (440×956), as a home-screen app and in a Safari tab, both gardens, plus landscape.
- v29 — Dumpling stops misreading everyday words. Color words now only count as whole words, so "I'm tired / bored / scared" no longer turns the moon red. "Long day" no longer flips to morning, "tonight" no longer dims the lights, "still awake" no longer says good morning, "they" no longer gets "Hey you", "huge" no longer boops, "playlist" no longer starts the firefly game. Removed the leftover reply that still pointed at the joke egg (egg itself was removed in v18) - it fired on normal words like "find" and "secret". Asking for a moon color on the blue garden now says it shows in the pink garden (the moon isn't drawn on blue). "hiii" / "heyyy" now get a hello. Fallback grammar fix ("Try making the moon teal").
- v28 — "Leave me a note": say "remember [anything]" in chat and Dumpling keeps it (up to 40, oldest drop off); ask "what did I tell you?" (or tap the new chip) to hear the most recent one back, with a plain "X min/hours/days ago" timestamp. Fully local, nothing sent anywhere - same as chat/play state. Added a line to the "How I work" panel so she knows the feature exists.
- v27 — Feedback sync setup moved OUT of the shipped app entirely: no dev/setup UI lives on her phone anymore (Braedon's call - "the app stays on her phone, dev tools shouldn't be in it"). New unlinked page `setup-feedback.html` (not in nav, not in manifest, not precached) holds the Gist ID/token fields instead - visit it once per phone, never again. Status bar switched from `black-translucent` to `black` (removes the blur band on Chats/Feedback/Settings, Braedon's call after being told the trade-off). Viewport-refit on resize/scroll now coalesced through `requestAnimationFrame` instead of running on every raw event (perf pass). Responsive check across both target phones: no fixed oversized widths found, safe-area/dvh handling already solid from prior versions - nothing else needed there.
- v26 — Feedback tab tidy-up per Braedon's phone review: collapsed the separate record-button row and "voice memo attached" row into one compact box (textarea + mic + send, mic and clip-chip inside the same rounded box, matching the home composer's "controls live inside the input" language). Extra bottom padding on Chats/Feedback/Settings screens so the last item doesn't sit flush against the tab bar.
- v25 — Day-streak badge (top-left, home screen). On-screen skin-switch bubble next to it - tap to flip blue/pink without opening Settings. New Feedback tab: type, dictate (free, iOS keyboard mic), or record a raw voice memo; queues locally then sends to a private gist once Braedon sets up a gist ID + token in Settings > Feedback sync. First network call this app has ever made - AGENTS.md's "no network calls" rule was relaxed for this one path, on purpose, everything else stays local. "How I work" panel copy updated to say so honestly.
- v24 — Pink garden is full-bleed now (was capped to bottom ~52%, leaving an ugly seam against the flat CSS sky above it). Moon alignment carried over automatically since it shares garden.webp's crop.
- v23 — Bug fix: removed a `screen.height` viewport hack in `fitViewport()` that was pushing the entire tab bar off the bottom edge (invisible) on her iPhone 13.
- v22 — Real nav bar: Home / Chats / Settings (was Garden / Catch / Glow). Info button removed; how-I-work note and real controls (skin, light, moon color) moved into Settings, full transcript moved into Chats.
- v21 — Killed pinch-zoom, double-tap-zoom, and page bounce/rubber-band. Locked for the two phones that actually use it (16 Pro, 13).
- v20 — PWA hardening: core art + html/css/js precached on install (fixes the broken-image icon on a flaky load), app opens fully offline, launch splash color matches blue garden.
- v19 — Info panel: tap `i` for a plain-English "how I work" note plus the full chat history. Bubbles stay up ~9s and dismiss on tap instead of vanishing.
- v18 — Joke egg (`#sneaky`) removed.
- **7dc4f12** v17 — Mic inside the typing pill. Waveform. Auto-send. Glass composer.
- **d713091** v16 — Blue garden is home. Painted dumpling talks from a face bubble. User line at top. Floating dumpling pink-only.
- **59e6af6** v15 — Dumpling un-hidden (Safari chrome was a fake keyboard). Garden zoomed out. Tabs Garden/Catch/Glow. Mic button (later moved inside the pill).
- **b721f03** v14 — Square 512 icon (old file was 512×341, iOS stretched him). Keyboard no longer recrops the garden.
- **f152a8c** v13 — Killed the iOS sheet. Full-screen garden, glass overlay bubbles, tiny composer.
- **783e4cd** v12 — Fill 16 Pro to the real bottom (home-indicator strip was a black bar).
- **9f7124b** v11 — Blue night garden skin. 13 / 16 Pro breakpoints.
- **f6e1c22** v10 — Float Dumpling out of the circle. iOS sheet, moon chips, sparkles.
- **2058087** v9 — `assets/` vs `originals/`.
- **40c3604** v8 — Moon split into `moon.webp`. No fake CSS circle.
- **903bee0** — WebP garden + dumpling for iPhone 13 load. Originals kept.
- **69f35b4** v6 — Tiny app: thought bubble, firefly catch.
- **ea1cbd4** — Moon overlay matches art. Tap Dumpling = boop, not chat spam.
- **5081142** — Round avatar, soft sheet, keep joke egg.
- **15f3b27** — Moon/sky recolor sandbox. Network-first refresh.
- **493a3ad** — First dumpling agent + easter egg.
- **9cd7062** — Dumpling is the main dude.
- **68be239** — First pink garden page.

Git is the log. Do not rewrite these commits.
