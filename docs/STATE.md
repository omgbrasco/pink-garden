# State

Live dest: `C:\Users\braed\src\pink-garden`
GitHub: `omgbrasco/pink-garden` (public, Pages from `master`)
Live: https://omgbrasco.github.io/pink-garden/

Girlfriend gift. Fun/public. Not NSFW. Not Aria.

Cache **v28** (`BUILD = 28`, SW `dumpling-v28`). v28: "leave me a note" - chat-driven, no new tab, no new UI surface. Say "remember ..." to save, "what did I tell you?" to recall (also a chip). Stored in `dumpling-notes-v1`, local only, capped at 40. See CHANGELOG.

Cache **v27** (`BUILD = 27`, SW `dumpling-v27`). v27: moved feedback-sync setup out of the app into a standalone `setup-feedback.html` (see below), switched status bar to opaque `black` (Braedon's call, accepted the trade-off flagged in v26), throttled viewport refit via rAF.

**Feedback sync setup lives OUTSIDE the shipped app now.** `setup-feedback.html`, same repo/origin, NOT linked from index.html, NOT in the tab bar, NOT in manifest.webmanifest, NOT in sw.js's PRECACHE list - on purpose, so it never surfaces in her normal use and isn't treated as an app screen. It writes the same `dumpling-fb-gist` / `dumpling-fb-token` localStorage keys `app.js` reads. Braedon opens that URL directly (typed or a link he sends himself) once per phone (his and hers), never through in-app navigation. Do not add a link to it from index.html or the nav - that was explicitly rejected in favor of this approach ("the app stays on her phone, dev tools shouldn't be in it").

Status bar is now opaque `black` (was `black-translucent` through v26). If a black-bar-style regression shows up on either skin, this is the thing to check first before touching viewport/dvh code - it's a one-line meta revert, not a CSS bug. Last ship: a small on-screen skin-switch bubble (top-left, tap to flip blue/pink without going into Settings), a day-streak badge, and a new Feedback tab - she can type, dictate (iOS keyboard mic, free), or record a raw voice memo; it queues in `localStorage` and sends to a private gist once Braedon has entered a gist ID + token in Settings > Feedback sync. No git tags yet.

Default skin is the blue garden. Pink garden is opt-in via Settings, or the new top-left bubble on the home screen.

Grok Bot **Dumpling** is retired. Hired hands (Claude Code or Codex) open this folder. No replacement Grok bot.

**First network call this app makes, ever:** the Feedback tab, on purpose (see AGENTS.md). Everything else stays 100% local. The "How I work" panel in Settings was updated to say this honestly - don't let it drift back to claiming zero network activity while the Feedback tab exists.

## Not wired

- Feedback sync needs Braedon to actually create a private gist + a gist-scoped token and enter both in Settings > Feedback sync on his phone AND hers. Until that's done, her entries queue locally on her phone and nothing is lost, they just don't reach him yet.
- Speech bubble `#speech` may need a 16 Pro nudge. Screenshot before guessing.
- iOS page dictation is flaky in Safari. No cloud STT for the Feedback tab's raw voice memos either - they're saved as an audio clip only, not transcribed (no backend to do that without breaking the no-LLM rule).
- `originals/dumpling-icon-landscape.png` is unused. Keep. Do not serve.
- Golden-path jobs/adr/archive folders exist empty. Fill when a real coding job starts.

See `docs/HANDOFF.md` for the full scene and file map. Do not delete `originals/`.
