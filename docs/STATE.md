# State

Live dest: `C:\Users\braed\src\pink-garden`
GitHub: `omgbrasco/pink-garden` (public, Pages from `master`)
Live: https://omgbrasco.github.io/pink-garden/

Girlfriend gift. Fun/public. Not NSFW. Not Aria.

Cache **v46** (`BUILD = 46`, SW `dumpling-v46`). v46: names from the PC. See CHANGELOG.

Cache **v45** (`BUILD = 45`, SW `dumpling-v45`). v45: looser note phrasing. See CHANGELOG.

Cache **v44** (`BUILD = 44`, SW `dumpling-v44`). v44: forgiving link codes. See CHANGELOG.

Cache **v43** (`BUILD = 43`, SW `dumpling-v43`). v43: Ideas tab goes to the PC when linked. See CHANGELOG.

Cache **v42** (`BUILD = 42`, SW `dumpling-v42`). v42: she can see/wipe brain memory. See CHANGELOG.

Cache **v41** (`BUILD = 41`, SW `dumpling-v41`). v41: hotfix for v40 first-open-of-day crash + brain link (`dumpling-brain-v1`). See CHANGELOG.

Cache **v40** (`BUILD = 40`, SW `dumpling-v40`). v40: daily notes from Braedon (`dumpling-note-day`, `NOTES_PACK`). Placeholder notes until he sends real ones. See CHANGELOG.

Cache **v39** (`BUILD = 39`, SW `dumpling-v39`). v39: list splits on "and". See CHANGELOG.

Cache **v38** (`BUILD = 38`, SW `dumpling-v38`). v38: tap the box → chat slides up into a full thread (`body.thread`). See CHANGELOG.

Cache **v37** (`BUILD = 37`, SW `dumpling-v37`). v37: full screen (`black-translucent` status bar), no blur anywhere. See CHANGELOG.

Cache **v36** (`BUILD = 36`, SW `dumpling-v36`). v36: one-time flip back to pink on every phone (`homePink36`). See CHANGELOG.

Cache **v35** (`BUILD = 35`, SW `dumpling-v35`). v35: dev/user phones (7 taps on title; `dumpling-role`). See CHANGELOG.

Cache **v34** (`BUILD = 34`, SW `dumpling-v34`). v34: countdowns in chat (`dumpling-countdowns-v1`). See CHANGELOG.

Cache **v33** (`BUILD = 33`, SW `dumpling-v33`). v33: Dumpling floats above the chat (no more covering replies), more idle thoughts incl. time-of-day. See CHANGELOG.

Cache **v32** (`BUILD = 32`, SW `dumpling-v32`). v32: pink garden is home (one-time flip via `homePink`). The night garden's menus, screens and bubbles restyled to match pink in a dark "midnight pink" style (`--ui-*` theme variables). See CHANGELOG.

Cache **v31** (`BUILD = 31`, SW `dumpling-v31`). v31: Settings = Garden + Feedback only (type it / say it). How I work and the Settings fireflies button removed. What's-new card on first open after an update (`NEWS` list in app.js, `dumpling-seen-v1` key). My list + in-app reminders (`dumpling-list-v1`; no notifications, no server, Braedon's call). See CHANGELOG.

Cache **v30** (`BUILD = 30`, SW `dumpling-v30`). v30: tab bar removed. Home = Dumpling + speech bubble + composer. ☰ top-left opens a slide-out menu (Chat history, switch garden, Catch fireflies, Settings). Feedback now lives inside Settings as "Ideas for Braedon". Streak is in the menu header. See CHANGELOG.

Cache **v29** (`BUILD = 29`, SW `dumpling-v29`). v29: chat reply matching fixed so everyday words stop triggering commands ("tired" no longer = red moon, "long day" no longer = morning, etc.), dead joke-egg reply removed. See CHANGELOG.

Cache **v28** (`BUILD = 28`, SW `dumpling-v28`). v28: "leave me a note" - chat-driven, no new tab, no new UI surface. Say "remember ..." to save, "what did I tell you?" to recall (also a chip). Stored in `dumpling-notes-v1`, local only, capped at 40. See CHANGELOG.

Cache **v27** (`BUILD = 27`, SW `dumpling-v27`). v27: moved feedback-sync setup out of the app into a standalone `setup-feedback.html` (see below), switched status bar to opaque `black` (Braedon's call, accepted the trade-off flagged in v26), throttled viewport refit via rAF.

**Feedback sync setup lives OUTSIDE the shipped app now.** `setup-feedback.html`, same repo/origin, NOT linked from index.html, NOT in the tab bar, NOT in manifest.webmanifest, NOT in sw.js's PRECACHE list - on purpose, so it never surfaces in her normal use and isn't treated as an app screen. It writes the same `dumpling-fb-gist` / `dumpling-fb-token` localStorage keys `app.js` reads. Braedon opens that URL directly (typed or a link he sends himself) once per phone (his and hers), never through in-app navigation. Do not add a link to it from index.html or the nav - that was explicitly rejected in favor of this approach ("the app stays on her phone, dev tools shouldn't be in it").

Status bar is `black-translucent` again as of v37 (was opaque `black` v27-v36). No blur anywhere as of v37 (Braedon's call). If a black-bar-style regression shows up on either skin, this is the thing to check first before touching viewport/dvh code - it's a one-line meta revert, not a CSS bug. Last ship: a small on-screen skin-switch bubble (top-left, tap to flip blue/pink without going into Settings), a day-streak badge, and a new Feedback tab - she can type, dictate (iOS keyboard mic, free), or record a raw voice memo; it queues in `localStorage` and sends to a private gist once Braedon has entered a gist ID + token in Settings > Feedback sync. No git tags yet.

Default skin is the pink garden (v32). The night garden is the opt-in dark theme (midnight-pink menus and screens), via Settings or the switch-garden row in the ☰ menu.

Grok Bot **Dumpling** is retired. Hired hands (Claude Code or Codex) open this folder. No replacement Grok bot.

**First network call this app makes, ever:** Feedback (in Settings), on purpose (see AGENTS.md). Everything else stays 100% local. The "How I work" panel was removed in v31 (Braedon's call: less reading). If any privacy note comes back, it must say Feedback goes to Braedon.

## Not wired

- Feedback sync needs Braedon to actually create a private gist + a gist-scoped token and enter both on `setup-feedback.html` on his phone AND hers. Until that's done, her entries queue locally on her phone and nothing is lost, they just don't reach him yet.
- Speech bubble `#speech` may need a 16 Pro nudge. Screenshot before guessing.
- iOS page dictation is flaky in Safari. No cloud STT for the Feedback tab's raw voice memos either - they're saved as an audio clip only, not transcribed (no backend to do that without breaking the no-LLM rule).
- `originals/dumpling-icon-landscape.png` is unused. Keep. Do not serve.
- Golden-path jobs/adr/archive folders exist empty. Fill when a real coding job starts.

See `docs/HANDOFF.md` for the full scene and file map. Do not delete `originals/`.
