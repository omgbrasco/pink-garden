# State

Live dest: `C:\Users\braed\src\pink-garden`
GitHub: `omgbrasco/pink-garden` (public, Pages from `master`)
Live: https://omgbrasco.github.io/pink-garden/

Girlfriend gift. Fun/public. Not NSFW. Not Aria.

Cache **v25** (`BUILD = 25`, SW `dumpling-v25`). Last ship: a small on-screen skin-switch bubble (top-left, tap to flip blue/pink without going into Settings), a day-streak badge, and a new Feedback tab - she can type, dictate (iOS keyboard mic, free), or record a raw voice memo; it queues in `localStorage` and sends to a private gist once Braedon has entered a gist ID + token in Settings > Feedback sync. No git tags yet.

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
